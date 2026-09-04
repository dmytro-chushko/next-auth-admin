import { initContract } from '@ts-rest/core';

import {
  internalServerErrorResponse,
  unauthorizedResponse,
} from './schemas/error';
import { userMeSchema } from './schemas/user';

const c = initContract();

/**
 * Current-user domain API. Auth protocol stays on `/api/auth/*` (Better Auth).
 * Admin routes are added in stage G.
 */
export const userContract = c.router(
  {
    me: {
      method: 'GET',
      path: '/me',
      responses: {
        200: userMeSchema,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Current user profile',
      description: 'Requires session cookie from Better Auth login.',
    },
  },
  {
    pathPrefix: '/users',
  },
);

export type UserContract = typeof userContract;
