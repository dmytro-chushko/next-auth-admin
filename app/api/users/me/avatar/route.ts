import { deleteUserAvatar } from '@/entities/user/model/user-avatar';
import { getSession } from '@/shared/auth/session';
import { AvatarStorageError } from '@/shared/storage';

function errorResponse(status: 401 | 500, error: string) {
  return Response.json({ status, error }, { status });
}

/**
 * DELETE /api/users/me/avatar — implements `userContract.avatarDelete`.
 * Restores `oauthImage` when a managed Supabase avatar is removed.
 */
export async function DELETE() {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse(401, 'Unauthorized');
    }

    const user = await deleteUserAvatar(session.user.id);

    return Response.json(user, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AvatarStorageError) {
      return errorResponse(500, error.message);
    }

    console.error('[api/users/me/avatar] delete failed', error);

    return errorResponse(500, 'Internal Server Error');
  }
}
