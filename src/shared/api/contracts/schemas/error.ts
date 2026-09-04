import { z } from 'zod';

const errorResponseBase = z.object({
  status: z.number(),
  error: z.string(),
});

export const unauthorizedResponse = errorResponseBase.extend({
  status: z.literal(401),
});

export const internalServerErrorResponse = errorResponseBase.extend({
  status: z.literal(500),
});
