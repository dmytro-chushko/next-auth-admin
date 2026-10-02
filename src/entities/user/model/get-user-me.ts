import type { UserMe } from '@/shared/api/contracts';
import { mapUserToMe } from '@/shared/api/helpers/map-session-user';
import { prisma } from '@/shared/db/prisma';

/** Load current-user DTO with account-derived password / OAuth fields. */
export async function getUserMeById(userId: string): Promise<UserMe> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          providerId: true,
          password: true,
        },
      },
    },
  });

  return mapUserToMe(user);
}
