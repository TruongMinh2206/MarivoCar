import { describe, it, expect, vi, beforeEach } from "vitest"
import { generateBookingCode, ensureUniqueBookingCode } from "../booking-code"

// Mock prisma
vi.mock("../prisma", () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from "../prisma"

describe("Booking Code Generator", () => {
  describe("generateBookingCode", () => {
    it("should generate a code with correct format MRV{YYMMDD}-{SEQUENCE}", () => {
      const code = generateBookingCode()
      expect(code).toMatch(/^MRV\d{6}-\d{4}$/)
    })

    it("should generate unique codes on each call", () => {
      const codes = new Set<string>()
      for (let i = 0; i < 100; i++) {
        codes.add(generateBookingCode())
      }
      // Allow small chance of collision due to randomness
      expect(codes.size).toBeGreaterThan(90)
    })
  })

  describe("ensureUniqueBookingCode", () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it("should return code immediately if not in database", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

      const code = await ensureUniqueBookingCode()

      expect(code).toMatch(/^MRV\d{6}-\d{4}$/)
      expect(prisma.booking.findUnique).toHaveBeenCalledTimes(1)
    })

    it("should retry if code exists in database", async () => {
      // First call returns existing booking, second returns null
      vi.mocked(prisma.booking.findUnique)
        .mockResolvedValueOnce({ id: "existing" } as any)
        .mockResolvedValueOnce(null)

      const code = await ensureUniqueBookingCode()

      expect(code).toMatch(/^MRV\d{6}-\d{4}$/)
      expect(prisma.booking.findUnique).toHaveBeenCalledTimes(2)
    })

    it("should throw after max attempts", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({ id: "existing" } as any)

      await expect(ensureUniqueBookingCode()).rejects.toThrow(
        "Unable to generate unique booking code"
      )
      expect(prisma.booking.findUnique).toHaveBeenCalledTimes(10)
    })
  })
})