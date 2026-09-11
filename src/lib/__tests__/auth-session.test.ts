/**
 * resolveSessionUser — /api/auth/me payload mapping.
 *
 * The endpoint returns two real shapes:
 * - {data:{user}} when a session cookie is present (successResponse envelope)
 * - {user:null}   when there is no session
 * The mapper must accept both and reject payloads without a user.
 */
import { describe, expect, it } from "vitest"
import { resolveSessionUser } from "../auth-session"

const USER = {
  id: "u1",
  name: "Session Restore",
  email: "session@marivo.vn",
  phone: "+84 912 000 111",
  role: "CUSTOMER",
}

describe("resolveSessionUser", () => {
  it("restores the user from the {data:{user}} envelope (session present)", () => {
    const user = resolveSessionUser({ data: { user: USER } })
    expect(user).not.toBeNull()
    expect(user?.email).toBe("session@marivo.vn")
  })

  it("keeps working for the bare {user:...} shape", () => {
    const user = resolveSessionUser({ user: USER })
    expect(user).not.toBeNull()
    expect(user?.id).toBe("u1")
  })

  it("returns null for the no-session {user:null} response", () => {
    expect(resolveSessionUser({ user: null })).toBeNull()
  })

  it("returns null for an envelope without a user", () => {
    expect(resolveSessionUser({ data: {} })).toBeNull()
  })

  it("returns null for empty/invalid payloads", () => {
    expect(resolveSessionUser(null)).toBeNull()
    expect(resolveSessionUser(undefined)).toBeNull()
    expect(resolveSessionUser("nope")).toBeNull()
    expect(resolveSessionUser(42)).toBeNull()
    expect(resolveSessionUser({})).toBeNull()
  })
})
