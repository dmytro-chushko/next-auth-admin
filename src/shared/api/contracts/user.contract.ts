import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
  unauthorizedResponse,
} from './schemas/error';
import {
  avatarConfirmBodySchema,
  avatarUploadIntentBodySchema,
  avatarUploadIntentSchema,
  userMeSchema,
} from './schemas/user';

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

    avatarUploadIntent: {
      method: 'POST',
      path: '/me/avatar/upload-intent',
      body: avatarUploadIntentBodySchema,
      responses: {
        200: avatarUploadIntentSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Create signed upload URL for avatar',
    },

    avatarConfirm: {
      method: 'POST',
      path: '/me/avatar/confirm',
      body: avatarConfirmBodySchema,
      responses: {
        200: userMeSchema,
        400: badRequestResponse,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Confirm avatar upload and update profile image',
    },

    avatarDelete: {
      method: 'DELETE',
      path: '/me/avatar',
      body: z.object({}).strict(),
      responses: {
        200: userMeSchema,
        401: unauthorizedResponse,
        500: internalServerErrorResponse,
      },
      summary: 'Remove custom avatar; restore OAuth image when available',
    },
  },
  {
    pathPrefix: '/users',
  },
);

export type UserContract = typeof userContract;
