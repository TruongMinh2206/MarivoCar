import { describe, it, expect, vi, beforeEach } from "vitest"

// Fake Prisma enums so tests run without a generated client
vi.mock("@prisma/client", () => ({
  UserRole: {
    CUSTOMER: "CUSTOMER",
    STAFF: "STAFF",
    MANAGER: "MANAGER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
  },
}))

// Mock prisma BEFORE importing the module under test
vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import bcrypt from "bcryptjs"
import { prisma } from "../prisma"
import {
  hashPassword,
  verifyPassword,
  SESSION_COOKIE_NAME,
  createSession,
  destroySession,
  getSessionUser,
  requireUser,
  requireAdmin,
} from "../auth"

describe("auth-engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("hashPassword / verifyPassword", () => {
    it("hashes and verifies a password", async () => {
      const hash = await hashPassword("Secret123!")
      expect(hash).not.toBe("Secret123!")
      expect(hash.startsWith("$2")).toBe(true)
      expect(await verifyPassword("Secret123!", hash)).toBe(true)
    })

    it("rejects wrong password", async () => {
      const hash = await hashPassword("Secret123!")
      expect(await verifyPassword("wrong", hash)).toBe(false)
    })
  })

  describe("createSession", () => {
    it("creates a DB session with a hashed token and returns the raw token", async () => {
      vi.mocked(prisma.session.create).mockResolvedValue({
        id: "s1",
        sessionToken: "hash",
        userId: "u1",
        expires: new Date(),
      } as any)

      const result = await createSession("u1")
      // returns a raw token (non-empty) to set as cookie
      expect(result.sessionToken).toBeTruthy()
      expect(result.expires).toBeInstanceOf(Date)
      // stores userId it was called with
      expect(vi.mocked(prisma.session.create).mock.calls[0][0].data.userId).toBe(
        "u1"
      )
      // sessionToken must be hashed before storing, never the raw token
      const storedToken = vi.mocked(prisma.session.create).mock.calls[0][0].data
        .sessionToken
      expect(storedToken).not.toBe(result.sessionToken)
      expect(storedToken).toHaveLength(64) // sha256 hex
    })
  })

  describe("getSessionUser", () => {
    it("returns null when no raw token", async () => {
      const user = await getSessionUser(null)
      expect(user).toEqual({ session: null, user: null })
      expect(prisma.session.findUnique).not.toHaveBeenCalled()
    })

    it("returns user and session for valid token", async () => {
      const fakeUser = {
        id: "u1",
        email: "a@b.c",
        name: "A",
        role: "ADMIN",
        isActive: true,
      } as any
      const fakeSession = {
        sessionToken: "hashed",
        expires: new Date(Date.now() + 100000),
        user: fakeUser,
      } as any
      vi.mocked(prisma.session.findUnique).mockResolvedValue(fakeSession)

      const result = await getSessionUser("raw-token")
      expect(result.session).not.toBeNull()
      expect(result.user!.id).toBe("u1")
      // must query with hashed token
      const where = vi.mocked(prisma.session.findUnique).mock.calls[0][0]
      expect(where.where.sessionToken).not.toBe("raw-token")
    })

    it("returns null when session expired", async () => {
      const fakeSession = {
        expires: new Date(Date.now() - 100000),
        user: { isActive: true } as any,
      } as any
      vi.mocked(prisma.session.findUnique).mockResolvedValue(fakeSession)

      const result = await getSessionUser("raw")
      expect(result).toEqual({ session: null, user: null })
    })

    it("returns null when user inactive", async () => {
      const fakeSession = {
        expires: new Date(Date.now() + 100000),
        user: { isActive: false, role: "CUSTOMER" } as any,
      } as any
      vi.mocked(prisma.session.findUnique).mockResolvedValue(fakeSession)

      const result = await getSessionUser("raw")
      expect(result).toEqual({ session: null, user: null })
    })
  })

  describe("destroySession", () => {
    it("deletes the session by raw token (hashed lookup)", async () => {
      await destroySession("raw-token")
      const where = vi.mocked(prisma.session.delete).mock.calls[0][0]
      expect(where.where.sessionToken).not.toBe("raw-token")
    })
  })

  describe("requireUser", () => {
    it("throws UnauthorizedError when unauthenticated", async () => {
      await expect(requireUser({ user: null, session: null })).rejects.toThrow(
        /Authentication required/
      )
    })

    it("returns user when authenticated", async () => {
      const user = { id: "u1" } as any
      const session = { sessionToken: "x" } as any
      const result = await requireUser({ user, session } as any)
      expect(result).toEqual({ user, session })
    })
  })

  describe("requireAdmin", () => {
    it("throws ForbiddenError when user is CUSTOMER", async () => {
      const auth = { user: { id: "u1", role: "CUSTOMER" }, session: {} } as any
      await expect(requireAdmin(auth)).rejects.toThrow(
        /Insufficient permissions/
      )
    })

    it("allows ADMIN role", async () => {
      const auth = {
        user: { id: "u1", role: "ADMIN", isActive: true },
        session: { sessionToken: "x" },
      } as any
      const result = await requireAdmin(auth)
      expect(result.user!.role).toBe("ADMIN")
    })
  })

  // bcrypt roundtrip sanity (no prisma)
  it("bcrypt dependency present", async () => {
    const h = await bcrypt.hash("x", 4)
    expect(await bcrypt.compare("x", h)).toBe(true)
  })
})
