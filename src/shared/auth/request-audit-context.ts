import { headers } from 'next/headers';

export type RequestAuditContext = {
  ipAddress: string | null;
  userAgent: string | null;
};

function firstForwardedIp(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const first = value.split(',')[0]?.trim();

  return first && first.length > 0 ? first : null;
}

export function getAuditRequestContextFromHeaders(
  headerList: Headers,
): RequestAuditContext {
  return {
    ipAddress:
      firstForwardedIp(headerList.get('x-forwarded-for')) ??
      headerList.get('x-real-ip'),
    userAgent: headerList.get('user-agent'),
  };
}

export async function getAuditRequestContext(): Promise<RequestAuditContext> {
  return getAuditRequestContextFromHeaders(await headers());
}
