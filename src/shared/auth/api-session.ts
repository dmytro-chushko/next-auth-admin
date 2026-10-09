import { recordAuditLog } from '@/entities/audit-log';
import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';

import type { Session } from './auth';
import { getAuditRequestContextFromHeaders } from './request-audit-context';
import { getSession } from './session';

/**
 * Admin guard for route handlers.
 *
 * Unlike `requireAdmin`, this never redirects: callers get a JSON 401/403
 * `Response` to return as-is.
 */
export async function requireAdminApiSession(
  request?: Request,
): Promise<Session | Response> {
  const session = await getSession();

  if (!session) {
    return apiErrorResponse(401, 'Unauthorized');
  }

  if (session.user.role !== 'admin') {
    const requestContext = getAuditRequestContextFromHeaders(
      request?.headers ?? new Headers(),
    );

    await recordAuditLog({
      action: 'ADMIN_ACCESS_DENIED',
      actorId: session.user.id,
      success: false,
      ...requestContext,
      metadata: {
        role: session.user.role,
        ...(request
          ? {
              path: new URL(request.url).pathname,
              method: request.method,
            }
          : {}),
      },
    });

    return apiErrorResponse(403, 'Forbidden');
  }

  return session;
}
