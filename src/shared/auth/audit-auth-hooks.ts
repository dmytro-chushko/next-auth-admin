import { APIError, createAuthMiddleware, isAPIError } from 'better-auth/api';

import { recordAuditLog } from '@/entities/audit-log';

import { getAuditRequestContextFromHeaders } from './request-audit-context';

function readEmailFromBody(body: unknown): string | undefined {
  if (
    typeof body === 'object' &&
    body !== null &&
    'email' in body &&
    typeof (body as { email: unknown }).email === 'string'
  ) {
    return (body as { email: string }).email;
  }

  return undefined;
}

function isSignInPath(path: string): boolean {
  return (
    path === '/sign-in/email' ||
    path.startsWith('/callback/') ||
    path === '/sign-in/social'
  );
}

/**
 * After-hook middleware that records login success/failure and logout.
 * Admin revoke uses Prisma `session.deleteMany` directly, so it does not
 * create LOGOUT rows here — that stays `SESSIONS_REVOKED` in the admin service.
 */
export const auditAuthAfterHook = createAuthMiddleware(async (ctx) => {
  const requestHeaders = ctx.headers ?? new Headers();
  const requestContext = getAuditRequestContextFromHeaders(requestHeaders);
  const returned = ctx.context.returned;

  if (ctx.path === '/sign-out') {
    const actorId = ctx.context.session?.user.id ?? null;

    await recordAuditLog({
      action: 'LOGOUT',
      actorId,
      success: true,
      ...requestContext,
    });

    return;
  }

  if (isSignInPath(ctx.path)) {
    const newSession = ctx.context.newSession;

    if (newSession) {
      await recordAuditLog({
        action: 'LOGIN_SUCCESS',
        actorId: newSession.user.id,
        success: true,
        ipAddress: newSession.session.ipAddress ?? requestContext.ipAddress,
        userAgent: newSession.session.userAgent ?? requestContext.userAgent,
        metadata: {
          email: newSession.user.email,
          path: ctx.path,
        },
      });

      return;
    }

    if (isAPIError(returned) || returned instanceof APIError) {
      await recordAuditLog({
        action: 'LOGIN_FAILED',
        actorId: null,
        success: false,
        ...requestContext,
        metadata: {
          email: readEmailFromBody(ctx.body),
          path: ctx.path,
          reason: 'invalid_credentials',
        },
      });
    }
  }
});

/**
 * Better Auth self-delete path. Admin delete uses Prisma directly and records
 * `USER_DELETED` in the admin service instead.
 */
export async function recordAccountSelfDeletedAudit(user: {
  id: string;
  email: string;
}): Promise<void> {
  await recordAuditLog({
    action: 'ACCOUNT_SELF_DELETED',
    actorId: null,
    targetUserId: null,
    success: true,
    metadata: {
      email: user.email,
      userId: user.id,
    },
  });
}
