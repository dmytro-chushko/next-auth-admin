import { buildOpenApiDocument } from '@/shared/api/openapi';

export function GET() {
  return Response.json(buildOpenApiDocument(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
