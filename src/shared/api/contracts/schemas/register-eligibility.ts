import { z } from 'zod';

export const registerEligibilityStatusSchema = z.enum([
  'allowed',
  'oauth_only',
  'pending_verification',
  'already_registered',
]);

export type RegisterEligibilityStatus = z.infer<
  typeof registerEligibilityStatusSchema
>;
