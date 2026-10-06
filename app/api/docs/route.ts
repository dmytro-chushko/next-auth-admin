import { ApiReference } from '@scalar/nextjs-api-reference';

/**
 * Standalone Scalar UI for domain OpenAPI.
 * Spec: `/api/docs/openapi.json`
 */
export const GET = ApiReference({
  url: '/api/docs/openapi.json',
  pageTitle: 'Next Auth Admin API',
  // Pin the browser renderer; package version alone does not pin the CDN build.
  cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.72.4',
});
