import { generateOpenApi } from '@ts-rest/open-api';

import { contract } from '@/shared/api/contracts';

import { enrichOpenApiSessionAuth } from './enrich-openapi-session-auth';
import { zod4SchemaTransformer } from './zod4-schema-transformer';

/**
 * Builds the OpenAPI 3 document from domain ts-rest contracts.
 * Better Auth `/api/auth/*` routes are intentionally omitted.
 */
export function buildOpenApiDocument() {
  const document = generateOpenApi(
    contract,
    {
      info: {
        title: 'Next Auth Admin API',
        version: '0.1.0',
        description:
          'Domain ts-rest API for this app. Authentication protocol endpoints live under `/api/auth/*` (Better Auth) and are not listed here — see https://www.better-auth.com/docs.',
      },
      servers: [
        {
          url: '/api',
          description: 'Same-origin App Router (`/api/...`)',
        },
      ],
    },
    {
      setOperationId: 'concatenated-path',
      schemaTransformer: zod4SchemaTransformer,
    },
  );

  return enrichOpenApiSessionAuth(document);
}
