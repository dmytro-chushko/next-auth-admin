import { Prisma } from '@/generated/prisma/client';
import {
  ADMIN_USERS_ERROR_MESSAGES,
  type AdminUserDetail,
  type AdminUserListItem,
  type AdminUserListResult,
  type AdminUsersListQuery,
  type Role,
} from '@/shared/api/contracts';
import {
  normalizeRole,
  resolveConnectedProviders,
  resolveHasPassword,
  type AccountSource,
} from '@/shared/api/helpers/map-session-user';
import { prisma } from '@/shared/db/prisma';
import { deleteManagedAvatarIfPresent } from '@/shared/storage';

import { AdminUsersError } from './admin-users-error';

const ACCOUNTS_SELECT = {
  select: {
    providerId: true,
    password: true,
  },
} as const;

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: string | null;
  emailVerified: boolean;
  createdAt: Date;
  accounts: AccountSource[];
};

function mapAdminUserListItem(user: AdminUserRow): AdminUserListItem {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    role: normalizeRole(user.role),
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    connectedProviders: resolveConnectedProviders(user.accounts),
    hasPassword: resolveHasPassword(user.accounts),
  };
}

function buildRoleFilter(role: Role): Prisma.UserWhereInput {
  // `role` is nullable in the schema; rows without a role behave as `user`.
  return role === 'admin'
    ? { role: 'admin' }
    : { OR: [{ role: 'user' }, { role: null }] };
}

function buildWhere(query: AdminUsersListQuery): Prisma.UserWhereInput {
  const filters: Prisma.UserWhereInput[] = [];

  if (query.search) {
    filters.push({
      OR: [
        { email: { contains: query.search, mode: 'insensitive' } },
        { name: { contains: query.search, mode: 'insensitive' } },
      ],
    });
  }

  if (query.role !== undefined) {
    filters.push(buildRoleFilter(query.role));
  }

  if (query.verified !== undefined) {
    filters.push({ emailVerified: query.verified });
  }

  return filters.length > 0 ? { AND: filters } : {};
}

export async function listAdminUsers(
  query: AdminUsersListQuery,
): Promise<AdminUserListResult> {
  const where = buildWhere(query);

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      // Secondary `id` sort keeps pagination stable across equal sort values.
      orderBy: [{ [query.sortBy]: query.sortOrder }, { id: 'asc' }],
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      include: { accounts: ACCOUNTS_SELECT },
    }),
  ]);

  return {
    items: users.map(mapAdminUserListItem),
    total,
    page: query.page,
    pageSize: query.pageSize,
  };
}

export async function getAdminUserDetail(
  userId: string,
): Promise<AdminUserDetail> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: ACCOUNTS_SELECT,
      sessions: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userAgent: true,
          ipAddress: true,
          createdAt: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AdminUsersError(404, 'User not found');
  }

  return {
    ...mapAdminUserListItem(user),
    updatedAt: user.updatedAt,
    sessions: user.sessions,
  };
}

type UpdateAdminUserRoleInput = {
  actorId: string;
  userId: string;
  role: Role;
};

export async function updateAdminUserRole({
  actorId,
  userId,
  role,
}: UpdateAdminUserRoleInput): Promise<AdminUserDetail> {
  if (actorId === userId) {
    throw new AdminUsersError(
      400,
      ADMIN_USERS_ERROR_MESSAGES.CANNOT_CHANGE_OWN_ROLE,
    );
  }

  await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) {
      throw new AdminUsersError(404, 'User not found');
    }

    const isDemotingAdmin =
      normalizeRole(target.role) === 'admin' && role !== 'admin';

    if (isDemotingAdmin) {
      await assertMoreThanOneAdmin(
        tx,
        ADMIN_USERS_ERROR_MESSAGES.CANNOT_DEMOTE_LAST_ADMIN,
      );
    }

    await tx.user.update({
      where: { id: userId },
      data: { role, updatedAt: new Date() },
    });
  });

  return getAdminUserDetail(userId);
}

export async function revokeAdminUserSessions(userId: string): Promise<number> {
  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!exists) {
    throw new AdminUsersError(404, 'User not found');
  }

  const { count } = await prisma.session.deleteMany({ where: { userId } });

  return count;
}

type DeleteAdminUserInput = {
  actorId: string;
  userId: string;
};

/**
 * Deletes a user. Sessions and accounts cascade in the database.
 * Managed avatar files are removed after the row is gone.
 */
export async function deleteAdminUser({
  actorId,
  userId,
}: DeleteAdminUserInput): Promise<void> {
  if (actorId === userId) {
    throw new AdminUsersError(
      400,
      ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_SELF,
    );
  }

  const deleted = await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, image: true },
    });

    if (!target) {
      throw new AdminUsersError(404, 'User not found');
    }

    if (normalizeRole(target.role) === 'admin') {
      await assertMoreThanOneAdmin(
        tx,
        ADMIN_USERS_ERROR_MESSAGES.CANNOT_DELETE_LAST_ADMIN,
      );
    }

    await tx.user.delete({ where: { id: userId } });

    return target;
  });

  try {
    await deleteManagedAvatarIfPresent(deleted.image);
  } catch (error: unknown) {
    console.error('[admin] failed to cleanup avatar on user delete', error);
  }
}

/**
 * Locks every admin row, then rejects the change when only one admin remains.
 * The lock stops two concurrent demotes or deletes from both succeeding.
 */
async function assertMoreThanOneAdmin(
  tx: Prisma.TransactionClient,
  message: string,
): Promise<void> {
  const admins = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "user" WHERE role = 'admin' ORDER BY id FOR UPDATE
  `;

  if (admins.length <= 1) {
    throw new AdminUsersError(400, message);
  }
}
