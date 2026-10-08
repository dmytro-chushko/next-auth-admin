import { initContract } from '@ts-rest/core';

import { adminContract } from './admin.contract';
import { registrationContract } from './registration.contract';
import { userContract } from './user.contract';

const c = initContract();

/** Domain API contract root. */
export const contract = c.router({
  users: userContract,
  registration: registrationContract,
  admin: adminContract,
});

export type AppContract = typeof contract;

export { userContract } from './user.contract';
export type { UserContract } from './user.contract';
export { registrationContract } from './registration.contract';
export type { RegistrationContract } from './registration.contract';
export { adminContract } from './admin.contract';
export type { AdminContract } from './admin.contract';
export { userMeSchema, roleSchema, AVATAR_MAX_BYTES } from './schemas/user';
export type {
  UserMe,
  Role,
  ConnectedProvider,
  AvatarUploadIntent,
} from './schemas/user';
export {
  ADMIN_USERS_ERROR_MESSAGES,
  ADMIN_USERS_PAGE_SIZE_DEFAULT,
  ADMIN_USERS_PAGE_SIZE_MAX,
  ADMIN_USERS_SEARCH_MAX_LENGTH,
  adminUpdateUserRoleBodySchema,
  adminUserDetailSchema,
  adminUserListItemSchema,
  adminUsersListQuerySchema,
  toAdminUsersListQueryParams,
} from './schemas/admin';
export type {
  AdminRevokeSessionsResult,
  AdminUpdateUserRoleBody,
  AdminUserDetail,
  AdminUserListItem,
  AdminUserListResult,
  AdminUserSessionSummary,
  AdminUsersListQuery,
  AdminUsersListQueryParams,
} from './schemas/admin';
export {
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from './schemas/error';
