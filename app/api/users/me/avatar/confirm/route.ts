import { confirmUserAvatarUpload } from '@/entities/user/model/user-avatar';
import { avatarConfirmBodySchema } from '@/shared/api/contracts/schemas/user';
import { getSession } from '@/shared/auth/session';
import { AvatarStorageError } from '@/shared/storage';

function errorResponse(status: 400 | 401 | 500, error: string) {
  return Response.json({ status, error }, { status });
}

/**
 * POST /api/users/me/avatar/confirm — implements `userContract.avatarConfirm`.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse(401, 'Unauthorized');
    }

    const json: unknown = await request.json();
    const parsed = avatarConfirmBodySchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse(400, 'Invalid avatar confirm payload');
    }

    const user = await confirmUserAvatarUpload(
      session.user.id,
      parsed.data.path,
      parsed.data.confirmToken,
    );

    return Response.json(user, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AvatarStorageError) {
      return errorResponse(error.status, error.message);
    }

    console.error('[api/users/me/avatar/confirm] failed', error);

    return errorResponse(500, 'Internal Server Error');
  }
}
