import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/shared/db/prisma';

import type { AuditLogRecordInput } from './audit-log-record-input';

/**
 * Persist a security audit event.
 * Failures are logged and swallowed so business flows are never blocked.
 */
export async function recordAuditLog(
  input: AuditLogRecordInput,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: input.action,
        actorId: input.actorId ?? null,
        targetUserId: input.targetUserId ?? null,
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        success: input.success,
        metadata:
          input.metadata === null || input.metadata === undefined
            ? undefined
            : (input.metadata as Prisma.InputJsonValue),
      },
    });
  } catch (error: unknown) {
    console.error('[audit] failed to record event', {
      action: input.action,
      error,
    });
  }
}
