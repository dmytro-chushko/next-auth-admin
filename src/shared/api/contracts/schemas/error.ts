import { z } from 'zod';

const errorResponseBase = z.object({
  status: z.number(),
  error: z.string(),
});

export const badRequestResponse = errorResponseBase.extend({
  status: z.literal(400),
});

export const unauthorizedResponse = errorResponseBase.extend({
  status: z.literal(401),
});

export const forbiddenResponse = errorResponseBase.extend({
  status: z.literal(403),
});

export const notFoundResponse = errorResponseBase.extend({
  status: z.literal(404),
});

export const internalServerErrorResponse = errorResponseBase.extend({
  status: z.literal(500),
});
