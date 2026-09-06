import { z } from 'zod';

import { getRegisterEligibility } from '@/entities/user/model/get-register-eligibility';

const eligibilityQuerySchema = z.object({
  email: z.email(),
});

/**
 * GET /api/register/eligibility?email= — implements `registrationContract.checkEligibility`.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = eligibilityQuerySchema.safeParse({
      email: searchParams.get('email') ?? '',
    });

    if (!parsed.success) {
      return Response.json(
        { status: 400 as const, error: 'Invalid email' },
        { status: 400 },
      );
    }

    const status = await getRegisterEligibility(parsed.data.email);

    return Response.json({ status }, { status: 200 });
  } catch (error: unknown) {
    console.error('[api/register/eligibility] failed', error);

    return Response.json(
      { status: 500 as const, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
