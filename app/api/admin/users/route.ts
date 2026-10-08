import { listAdminUsers } from '@/entities/admin/model/admin-users-service';
import { adminUsersListQuerySchema } from '@/shared/api/contracts/schemas/admin';
import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';
import { requireAdminApiSession } from '@/shared/auth/api-session';

/**
 * GET /api/admin/users — implements `adminContract.listUsers`.
 */
export async function GET(request: Request) {
  try {
    const sessionOrResponse = await requireAdminApiSession();

    if (sessionOrResponse instanceof Response) {
      return sessionOrResponse;
    }

    const searchParams = new URL(request.url).searchParams;
    const parsed = adminUsersListQuerySchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!parsed.success) {
      return apiErrorResponse(400, 'Invalid users list query');
    }

    const result = await listAdminUsers(parsed.data);

    return Response.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('[api/admin/users] failed', error);

    return apiErrorResponse(500, 'Internal Server Error');
  }
}
