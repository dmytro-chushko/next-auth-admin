import { avatarUploadIntentBodySchema } from '@/shared/api/contracts/schemas/user';
import { getSession } from '@/shared/auth/session';
import { AvatarStorageError, createAvatarUploadIntent } from '@/shared/storage';

function errorResponse(status: 400 | 401 | 500, error: string) {
  return Response.json({ status, error }, { status });
}

/**
 * POST /api/users/me/avatar/upload-intent — implements `userContract.avatarUploadIntent`.
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return errorResponse(401, 'Unauthorized');
    }

    const json: unknown = await request.json();
    const parsed = avatarUploadIntentBodySchema.safeParse(json);

    if (!parsed.success) {
      return errorResponse(400, 'Invalid upload intent');
    }

    const intent = await createAvatarUploadIntent(session.user.id, {
      contentType: parsed.data.contentType,
      contentLength: parsed.data.contentLength,
    });

    return Response.json(intent, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AvatarStorageError) {
      return errorResponse(error.status, error.message);
    }

    console.error('[api/users/me/avatar/upload-intent] failed', error);

    return errorResponse(500, 'Internal Server Error');
  }
}
