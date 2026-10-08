/** JSON error body shared by domain route handlers (`{ status, error }`). */
export function apiErrorResponse(status: number, error: string): Response {
  return Response.json({ status, error }, { status });
}
