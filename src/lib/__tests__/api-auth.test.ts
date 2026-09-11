import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock prisma BEFORE importing the routes under test
vi.mock("@prisma/client", () => ({
  UserRole: {
    CUSTOMER: "CUSTOMER", STAFF: "STAFF", MANAGER: "MANAGER",
    ADMIN: "ADMIN", SUPER_ADMIN: "SUPER_ADMIN",
  },
}))

vi.mock("../prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    verificationToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

vi.mock("../email", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}))

vi.mock("../rate-limit", () => ({
  checkRateLimit: vi.fn().mockReturnValue({ allowed: true, retryAfterMs: 0 }),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}))

// bcrypt with SALT_ROUNDS=10 is slow in tests — stub hashPassword at the
// lib boundary. register/reset tests verify the call shape, not the hash.
vi.mock("../auth", () => ({
  hashPassword: vi.fn().mockResolvedValue("$2a$10$hashedmockvalue"),
}))

import { prisma } from "../prisma"
import { sendEmail } from "../email"
import { hashPassword } from "../auth"
import { checkRateLimit } from "../rate-limit"
import { POST as registerPOST } from "@/app/api/auth/register/route"
import { POST as forgotPOST } from "@/app/api/auth/forgot-password/route"
import { POST as resetPOST } from "@/app/api/auth/reset-password/route"

function mockRequest(body: unknown, ip = "127.0.0.1") {
  return new Request("http://localhost/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  }) as any
}

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 })
  })

  const validBody = {
    name: "Test User",
    email: "test@example.com",
    phone: "+84912345678",
    password: "Password1",
  }

  it("creates a CUSTOMER user with a hashed password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      name: "Test User",
      role: "CUSTOMER",
    } as any)

    const res = await registerPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.data.user.email).toBe("test@example.com")
    expect(json.data.user.role).toBe("CUSTOMER")
    // Password must never leak into the response
    expect(JSON.stringify(json)).not.toContain("Password1")
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        name: "Test User",
        phone: "+84912345678",
        passwordHash: expect.any(String),
        role: "CUSTOMER",
      },
      select: expect.anything(),
    })
  })

  it("returns 409 when the email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing",
    } as any)

    const res = await registerPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.error.code).toBe("CONFLICT")
    expect(prisma.user.create).not.toHaveBeenCalled()
  })

  it("returns 400 for invalid input", async () => {
    const res = await registerPOST(
      mockRequest({ name: "A", email: "nope", phone: "x", password: "weak" })
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
  })

  it("returns 429 when the register rate limit is exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: false, retryAfterMs: 60_000 })

    const res = await registerPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(json.error.message).toMatch(/too many/i)
    expect(prisma.user.create).not.toHaveBeenCalled()
  })
})

describe("POST /api/auth/forgot-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 })
  })

  it("creates a VerificationToken and sends the reset email", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as any)
    vi.mocked(prisma.verificationToken.create).mockResolvedValue({} as any)

    const res = await forgotPOST(mockRequest({ email: "user@example.com" }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(prisma.verificationToken.create).toHaveBeenCalledTimes(1)
    expect(sendEmail).toHaveBeenCalledTimes(1)

    const emailArg = vi.mocked(sendEmail).mock.calls[0][0]
    expect(emailArg.to).toBe("user@example.com")
    // The raw token must reach the user's inbox via the reset link
    expect(emailArg.html).toContain(vi.mocked(prisma.verificationToken.create).mock.calls[0][0].data.token)
  })

  it("still returns 200 generic success when the email does NOT exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

    const res = await forgotPOST(mockRequest({ email: "ghost@example.com" }))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data.message).toMatch(/if an account .* exists/i)
    // No token, no email — but the response must look identical to success
    expect(prisma.verificationToken.create).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it("never reveals account existence in the message for existing users", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "u1" } as any)

    const res = await forgotPOST(mockRequest({ email: "user@example.com" }))
    const json = await res.json()

    expect(json.data.message).toMatch(/if an account .* exists/i)
  })

  it("returns 400 for an invalid email", async () => {
    const res = await forgotPOST(mockRequest({ email: "not-an-email" }))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
  })

  it("returns 429 when the password-reset limit is exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: false, retryAfterMs: 60_000 })

    const res = await forgotPOST(mockRequest({ email: "user@example.com" }))
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(prisma.verificationToken.create).not.toHaveBeenCalled()
  })
})

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true, retryAfterMs: 0 })
  })

  const validBody = { token: "raw-token", password: "NewPassword1" }

  it("consumes a valid token and updates the password hash", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      identifier: "user@example.com",
      token: "raw-token",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    } as any)
    vi.mocked(prisma.user.update).mockResolvedValue({ id: "u1" } as any)

    const res = await resetPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(hashPassword).toHaveBeenCalledWith("NewPassword1")
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "user@example.com" },
      data: { passwordHash: expect.any(String) },
    })
    // Token must be single-use — deleted after consumption
    expect(prisma.verificationToken.delete).toHaveBeenCalledWith({
      where: { token: "raw-token" },
    })
    expect(json.data.message).toBeTruthy()
  })

  it("rejects an unknown token with 400", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue(null)

    const res = await resetPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("rejects an expired token with 400", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      identifier: "user@example.com",
      token: "raw-token",
      expires: new Date(Date.now() - 1000),
    } as any)

    const res = await resetPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 400 when the password fails the policy", async () => {
    vi.mocked(prisma.verificationToken.findUnique).mockResolvedValue({
      identifier: "user@example.com",
      token: "raw-token",
      expires: new Date(Date.now() + 30 * 60 * 1000),
    } as any)

    const res = await resetPOST(
      mockRequest({ token: "raw-token", password: "weak" })
    )
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
    expect(prisma.user.update).not.toHaveBeenCalled()
  })

  it("returns 429 when the rate limit is exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: false, retryAfterMs: 60_000 })

    const res = await resetPOST(mockRequest(validBody))
    const json = await res.json()

    expect(res.status).toBe(429)
    expect(prisma.verificationToken.findUnique).not.toHaveBeenCalled()
  })
})
