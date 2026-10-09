import { z } from 'zod';

import { connectedProviderSchema, roleSchema } from './user';

export const ADMIN_USERS_PAGE_SIZE_DEFAULT = 20;
export const ADMIN_USERS_PAGE_SIZE_MAX = 100;
export const ADMIN_USERS_SEARCH_MAX_LENGTH = 200;

/**
 * Error messages shared by admin routes and the client error mapper.
 * Keep the wording stable — the UI matches on it to pick a localized message.
 */
export const ADMIN_USERS_ERROR_MESSAGES = {
  CANNOT_CHANGE_OWN_ROLE: 'Administrators cannot change their own role',
  CANNOT_DEMOTE_LAST_ADMIN: 'The last administrator cannot be demoted',
} as const;

export const adminUserListItemSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  image: z.string().nullable(),
  role: roleSchema,
  emailVerified: z.boolean(),
  createdAt: z.coerce.date(),
  connectedProviders: z.array(connectedProviderSchema),
  hasPassword: z.boolean(),
});

export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;

export const adminUserListResultSchema = z.object({
  items: z.array(adminUserListItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});

export type AdminUserListResult = z.infer<typeof adminUserListResultSchema>;

export const adminUserSessionSummarySchema = z.object({
  id: z.string(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export type AdminUserSessionSummary = z.infer<
  typeof adminUserSessionSummarySchema
>;

export const adminUserDetailSchema = adminUserListItemSchema.extend({
  updatedAt: z.coerce.date(),
  sessions: z.array(adminUserSessionSummarySchema),
});

export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>;

export const adminUserIdParamsSchema = z.object({
  id: z.string().min(1),
});

export type AdminUserIdParams = z.infer<typeof adminUserIdParamsSchema>;

export const adminUsersListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(ADMIN_USERS_PAGE_SIZE_MAX)
    .default(ADMIN_USERS_PAGE_SIZE_DEFAULT),
  search: z.string().max(ADMIN_USERS_SEARCH_MAX_LENGTH).optional(),
  role: roleSchema.optional(),
  verified: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  sortBy: z.enum(['createdAt', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/** Parsed query (server side, after Zod validation). */
export type AdminUsersListQuery = z.output<typeof adminUsersListQuerySchema>;

/** Raw HTTP query params (ts-rest client `query` argument). */
export type AdminUsersListQueryParams = z.input<
  typeof adminUsersListQuerySchema
>;

export function toAdminUsersListQueryParams(
  query: AdminUsersListQuery,
): AdminUsersListQueryParams {
  return {
    ...query,
    verified:
      query.verified === undefined
        ? undefined
        : query.verified
          ? 'true'
          : 'false',
  };
}

export const adminUpdateUserRoleBodySchema = z.object({
  role: roleSchema,
});

export type AdminUpdateUserRoleBody = z.infer<
  typeof adminUpdateUserRoleBodySchema
>;

export const adminRevokeSessionsResultSchema = z.object({
  revokedCount: z.number().int().nonnegative(),
});

export type AdminRevokeSessionsResult = z.infer<
  typeof adminRevokeSessionsResultSchema
>;
