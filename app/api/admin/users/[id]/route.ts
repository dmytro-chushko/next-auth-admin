import { AdminUsersError } from '@/entities/admin/model/admin-users-error';
import {
  deleteAdminUser,
  getAdminUserDetail,
  updateAdminUserRole,
} from '@/entities/admin/model/admin-users-service';
import { adminUpdateUserRoleBodySchema } from '@/shared/api/contracts/schemas/admin';
import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';
import { requireAdminApiSession } from '@/shared/auth/api-session';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function handleFailure(scope: string, error: unknown): Response {
  if (error instanceof AdminUsersError) {
    return apiErrorResponse(error.status, error.message);
  }

  console.error(`[api/admin/users/[id]] ${scope} failed`, error);

  return apiErrorResponse(500, 'Internal Server Error');
}

/**
 * GET /api/admin/users/:id — implements `adminContract.getUser`.
 */
export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const sessionOrResponse = await requireAdminApiSession();

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const { id } = await params;
    const user = await getAdminUserDetail(id);

    return Response.json(user, { status: 200 });
  } catch (error: unknown) {
    return handleFailure('GET', error);
  }
}

/**
 * PATCH /api/admin/users/:id — implements `adminContract.updateUserRole`.
 */
export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const sessionOrResponse = await requireAdminApiSession();

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const { id } = await params;
    let json: unknown;

    try {
      json = await request.json();
    } catch {
      return apiErrorResponse(400, 'Invalid JSON body');
    }

    const parsed = adminUpdateUserRoleBodySchema.safeParse(json);

    if (!parsed.success) {
      return apiErrorResponse(400, 'Invalid role payload');
    }

    const user = await updateAdminUserRole({
      actorId: sessionOrResponse.user.id,
      userId: id,
      role: parsed.data.role,
    });

    return Response.json(user, { status: 200 });
  } catch (error: unknown) {
    return handleFailure('PATCH', error);
  }
}

/**
 * DELETE /api/admin/users/:id
 * Implements `adminContract.deleteUser`.
 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const sessionOrResponse = await requireAdminApiSession();

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const { id } = await params;

    await deleteAdminUser({
      actorId: sessionOrResponse.user.id,
      userId: id,
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return handleFailure('DELETE', error);
  }
}
