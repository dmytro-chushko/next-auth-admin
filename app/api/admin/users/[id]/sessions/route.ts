import { AdminUsersError } from '@/entities/admin/model/admin-users-error';
import { revokeAdminUserSessions } from '@/entities/admin/model/admin-users-service';
import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';
import { requireAdminApiSession } from '@/shared/auth/api-session';
import { getAuditRequestContextFromHeaders } from '@/shared/auth/request-audit-context';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * DELETE /api/admin/users/:id/sessions — implements `adminContract.revokeUserSessions`.
 */
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const sessionOrResponse = await requireAdminApiSession(request);

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const { id } = await params;
    const auditContext = getAuditRequestContextFromHeaders(request.headers);
    const revokedCount = await revokeAdminUserSessions({
      actorId: sessionOrResponse.user.id,
      userId: id,
      ...auditContext,
    });

    return Response.json({ revokedCount }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof AdminUsersError) {
      return apiErrorResponse(error.status, error.message);
    }

    console.error('[api/admin/users/[id]/sessions] DELETE failed', error);

    return apiErrorResponse(500, 'Internal Server Error');
  }
}
