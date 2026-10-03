import { headers } from 'next/headers';
import { z } from 'zod';

import { getUserMeById } from '@/entities/user/model/get-user-me';
import { auth } from '@/shared/auth/auth';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/auth/password-policy';
import { getSession } from '@/shared/auth/session';

const setPasswordBodySchema = z.object({
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

/**
 * POST /api/users/me/set-password — OAuth-only users (Better Auth `setPassword` is server-only).
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { status: 401 as const, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const user = await getUserMeById(session.user.id);

    if (user.hasPassword) {
      return Response.json(
        {
          status: 400 as const,
          error: 'Password already set. Use change password instead.',
        },
        { status: 400 },
      );
    }

    const json: unknown = await request.json();
    const parsed = setPasswordBodySchema.safeParse(json);

    if (!parsed.success) {
      return Response.json(
        { status: 400 as const, error: 'Invalid password' },
        { status: 400 },
      );
    }

    await auth.api.setPassword({
      body: {
        newPassword: parsed.data.newPassword,
      },
      headers: await headers(),
    });

    const updatedUser = await getUserMeById(session.user.id);

    return Response.json(updatedUser, { status: 200 });
  } catch (error: unknown) {
    console.error('[api/users/me/set-password] failed', error);

    const message =
      error instanceof Error ? error.message : 'Internal Server Error';

    return Response.json(
      { status: 500 as const, error: message },
      { status: 500 },
    );
  }
}
