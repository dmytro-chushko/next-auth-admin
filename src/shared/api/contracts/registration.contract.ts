import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  badRequestResponse,
  internalServerErrorResponse,
} from './schemas/error';
import { registerEligibilityStatusSchema } from './schemas/register-eligibility';

const c = initContract();

const registerEligibilityResponseSchema = z.object({
  status: registerEligibilityStatusSchema,
});

/**
 * Guest registration helpers (not Better Auth protocol — that stays on `/api/auth/*`).
 */
export const registrationContract = c.router({
  checkEligibility: {
    method: 'GET',
    path: '/register/eligibility',
    query: z.object({
      email: z.email(),
    }),
    responses: {
      200: registerEligibilityResponseSchema,
      400: badRequestResponse,
      500: internalServerErrorResponse,
    },
    summary: 'Check whether an email can register with password',
  },
});

export type RegistrationContract = typeof registrationContract;
