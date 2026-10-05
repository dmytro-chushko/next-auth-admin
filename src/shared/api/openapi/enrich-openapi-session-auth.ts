import type { generateOpenApi } from '@ts-rest/open-api';

export const SESSION_COOKIE_SECURITY_SCHEME = 'sessionCookie' as const;

/** Default Better Auth session cookie name (`cookiePrefix.session_token`). */
export const BETTER_AUTH_SESSION_COOKIE_NAME = 'better-auth.session_token';

type OpenApiDocument = ReturnType<typeof generateOpenApi>;

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type OpenApiOperation = {
  security?: Array<Record<string, string[]>>;
};

type OpenApiPathItem = Partial<Record<HttpMethod, OpenApiOperation>>;

type OpenApiPaths = Record<string, OpenApiPathItem | undefined>;

function readOpenApiOperation(
  paths: OpenApiPaths | undefined,
  path: string,
  method: HttpMethod,
): OpenApiOperation | undefined {
  return paths?.[path]?.[method];
}

/** Session-protected domain operations currently in the ts-rest contract. */
const PROTECTED_OPERATIONS: ReadonlyArray<{
  path: string;
  method: HttpMethod;
}> = [
  { path: '/users/me', method: 'get' },
  { path: '/users/me/avatar/upload-intent', method: 'post' },
  { path: '/users/me/avatar/confirm', method: 'post' },
  { path: '/users/me/avatar', method: 'delete' },
];

/**
 * Adds OpenAPI cookie security scheme and marks session-protected routes.
 */
export function enrichOpenApiSessionAuth(
  document: OpenApiDocument,
  cookieName: string = BETTER_AUTH_SESSION_COOKIE_NAME,
): OpenApiDocument {
  document.components ??= {};
  document.components.securitySchemes = {
    ...document.components.securitySchemes,
    [SESSION_COOKIE_SECURITY_SCHEME]: {
      type: 'apiKey',
      in: 'cookie',
      name: cookieName,
      description:
        'HttpOnly Better Auth session cookie (set on sign-in via /api/auth/*). ' +
        'Same-origin Scalar “Try it” sends the cookie automatically after you log in in this browser.',
    },
  };

  const paths = document.paths as OpenApiPaths | undefined;

  for (const { path, method } of PROTECTED_OPERATIONS) {
    const operation = readOpenApiOperation(paths, path, method);

    if (operation === undefined) {
      continue;
    }

    operation.security = [{ [SESSION_COOKIE_SECURITY_SCHEME]: [] }];
  }

  return document;
}
