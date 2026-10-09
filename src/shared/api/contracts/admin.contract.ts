import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  adminRevokeSessionsResultSchema,
  adminUpdateUserRoleBodySchema,
  adminUserDetailSchema,
  adminUserIdParamsSchema,
  adminUserListResultSchema,
  adminUsersListQuerySchema,
} from './schemas/admin';
import {
  badRequestResponse,
  forbiddenResponse,
  internalServerErrorResponse,
  notFoundResponse,
  unauthorizedResponse,
} from './schemas/error';

const c = initContract();

/** Admin user management API. Every route requires an `admin` session cookie. */
export const adminContract = c.router(
  {
    listUsers: {
      method: 'GET',
      path: '/users',
      query: adminUsersListQuerySchema,
      responses: {
        200: adminUserListResultSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        500: internalServerErrorResponse,
      },
      summary: 'List users (admin)',
    },

    getUser: {
      method: 'GET',
      path: '/users/:id',
      pathParams: adminUserIdParamsSchema,
      responses: {
        200: adminUserDetailSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Get user detail (admin)',
    },

    updateUserRole: {
      method: 'PATCH',
      path: '/users/:id',
      pathParams: adminUserIdParamsSchema,
      body: adminUpdateUserRoleBodySchema,
      responses: {
        200: adminUserDetailSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Update user role (admin)',
    },

    deleteUser: {
      method: 'DELETE',
      path: '/users/:id',
      pathParams: adminUserIdParamsSchema,
      body: c.noBody(),
      responses: {
        204: c.noBody(),
        400: badRequestResponse,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Delete user (admin)',
    },

    revokeUserSessions: {
      method: 'DELETE',
      path: '/users/:id/sessions',
      pathParams: adminUserIdParamsSchema,
      body: z.object({}).strict(),
      responses: {
        200: adminRevokeSessionsResultSchema,
        401: unauthorizedResponse,
        403: forbiddenResponse,
        404: notFoundResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Revoke all sessions for a user (admin)',
    },
  },
  {
    pathPrefix: '/admin',
  },
);

export type AdminContract = typeof adminContract;
