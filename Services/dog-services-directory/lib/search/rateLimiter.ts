/**
 * Simple rate limiter for search API
 */
export async function rateLimit(request: any): Promise<{ success: boolean }> {
  // For now, return success - implement proper rate limiting later
  // This could integrate with Redis or database for persistent rate limiting
  return { success: true };
}
