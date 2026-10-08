import { AdminUsersError } from '@/entities/admin/model/admin-users-error';
import { revokeAdminUserSessions } from '@/entities/admin/model/admin-users-service';
import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';
import { requireAdminApiSession } from '@/shared/auth/api-session';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/admin/users/:id/sessions — implements `adminContract.revokeUserSessions`.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const sessionOrResponse = await requireAdminApiSession();

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const { id } = await params;
    const revokedCount = await revokeAdminUserSessions(id);

    return Response.json({ revokedCount }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AdminUsersError) {
      return apiErrorResponse(error.status, error.message);
    }

    console.error('[api/admin/users/[id]/sessions] DELETE failed', error);

    return apiErrorResponse(500, 'Internal Server Error');
  }
}
