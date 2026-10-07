import type { SchemaTransformerSync } from '@ts-rest/open-api';
import { z } from 'zod';

/**
 * Zod 4 → OpenAPI 3.0 schema transformer for `@ts-rest/open-api`.
 * Default built-in transformer targets Zod 3 / `@anatine/zod-openapi`.
 */
export const zod4SchemaTransformer: SchemaTransformerSync = ({ schema }) => {
  if (!(schema instanceof z.ZodType)) {
    return null;
  }

  const jsonSchema = z.toJSONSchema(schema, {
    unrepresentable: 'any',
    target: 'openapi-3.0',
  }) as Record<string, unknown>;

  delete jsonSchema.$schema;

  return jsonSchema as NonNullable<ReturnType<SchemaTransformerSync>>;
};
