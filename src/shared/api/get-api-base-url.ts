/**
 * Base path for domain ts-rest routes (Next Route Handlers under `app/api`).
 * Relative URL keeps same-origin cookies without baking a host at module load.
 */
export function getApiBaseUrl(): string {
  return '/api';
}
