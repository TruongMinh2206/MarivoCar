/**
 * Session response mapping for /api/auth/me.
 *
 * The endpoint uses the standard response envelope ({data:{user}}) when a
 * session cookie is present, but returns a bare {user:null} when it is not.
 * Any client that reads only json.user silently drops a valid session on
 * page load — the header flips back to "Sign In" while the cookie is still
 * valid. One shared mapper keeps every consumer aligned with the API contract.
 */

/** Minimal user shape shared by the auth API. */
export interface AuthUserPayload {
  id: string
  name: string | null
  email: string
  phone: string | null
  role: string
  image?: string | null
}

/**
 * Map the /api/auth/me payload to a user, tolerating both real shapes:
 * - {data:{user}}   — session present (successResponse envelope)
 * - {user:null}     — no session (legacy bare shape)
 * Returns null when neither shape carries a user.
 */
export function resolveSessionUser(json: unknown): AuthUserPayload | null {
  if (json === null || typeof json !== "object") return null
  const obj = json as Record<string, unknown>
  const direct = obj.user
  if (direct !== null && direct !== undefined) {
    return direct as AuthUserPayload
  }
  const data = obj.data
  if (data !== null && typeof data === "object") {
    const nested = (data as Record<string, unknown>).user
    if (nested !== null && nested !== undefined) {
      return nested as AuthUserPayload
    }
  }
  return null
}
