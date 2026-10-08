import { apiErrorResponse } from '@/shared/api/helpers/api-error-response';

import type { Session } from './auth';
import { getSession } from './session';

/**
 * Admin guard for route handlers.
 *
 * Unlike `requireAdmin`, this never redirects: callers get a JSON 401/403
 * `Response` to return as-is.
 */
export async function requireAdminApiSession(): Promise<Session | Response> {
  const session = await getSession();

  if (!session) {
    return apiErrorResponse(401, 'Unauthorized');
  }

  if (session.user.role !== 'admin') {
    return apiErrorResponse(403, 'Forbidden');
  }

  return session;
}
