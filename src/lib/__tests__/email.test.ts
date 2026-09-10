import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// ─── Mocks ──────────────────────────────────────────────────────────────────

// Resend SDK is only imported lazily when an API key exists — mock the module
// so the import never hits the network in tests.
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null }),
    },
  })),
}))

import { sendEmail, isEmailConfigured } from "../email"

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("email sender", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete process.env.RESEND_API_KEY
  })

  describe("isEmailConfigured", () => {
    it("returns false when RESEND_API_KEY is missing", () => {
      delete process.env.RESEND_API_KEY
      expect(isEmailConfigured()).toBe(false)
    })

    it("returns true when RESEND_API_KEY is set", () => {
      process.env.RESEND_API_KEY = "re_test_key"
      expect(isEmailConfigured()).toBe(true)
    })
  })

  describe("sendEmail (console fallback)", () => {
    it("logs and returns true when no API key is configured", async () => {
      delete process.env.RESEND_API_KEY
      const log = vi.spyOn(console, "log").mockImplementation(() => {})

      const ok = await sendEmail({
        to: "guest@example.com",
        subject: "Booking Confirmed",
        html: "<p>Hi</p>",
      })

      expect(ok).toBe(true)
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining("guest@example.com")
      )
    })
  })

  describe("sendEmail (Resend)", () => {
    it("sends via the Resend SDK when an API key exists", async () => {
      process.env.RESEND_API_KEY = "re_test_key"

      const ok = await sendEmail({
        to: "guest@example.com",
        subject: "Payment Received",
        html: "<p>Thanks</p>",
        text: "Thanks",
      })

      expect(ok).toBe(true)
      // The console fallback must NOT be used when Resend is configured
      expect(console.log).not.toHaveBeenCalledWith(
        expect.stringContaining("[EMAIL]")
      )
    })

    it("returns false instead of throwing when Resend errors", async () => {
      process.env.RESEND_API_KEY = "re_test_key"

      // Reject on the next send call
      const { Resend } = await import("resend")
      vi.mocked(Resend).mockImplementation(
        () =>
          ({
            emails: {
              send: vi.fn().mockResolvedValue({ data: null, error: { message: "quota exceeded" } }),
            },
          }) as unknown as import("resend").Resend
      )

      const ok = await sendEmail({
        to: "guest@example.com",
        subject: "Any",
        html: "<p>x</p>",
      })

      expect(ok).toBe(false)
    })
  })
})
