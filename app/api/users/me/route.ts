import { mapSessionUserToMe } from '@/shared/api/map-session-user';
import { getSession } from '@/shared/auth/session';

/**
 * GET /api/users/me — implements `userContract.me`.
 * Session comes from Better Auth cookie via `getSession`.
 */
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { status: 401 as const, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    return Response.json(mapSessionUserToMe(session.user), { status: 200 });
  } catch (error: unknown) {
    console.error('[api/users/me] failed', error);

    return Response.json(
      { status: 500 as const, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
