import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@prisma/client", () => ({
  BookingStatus: {
    WAITING_PAYMENT: "WAITING_PAYMENT", PENDING: "PENDING",
    CONFIRMED: "CONFIRMED", PAID: "PAID", CANCELLED: "CANCELLED",
  },
}))

vi.mock("../prisma", () => ({
  prisma: {
    booking: { findUnique: vi.fn() },
  },
}))

// Mock qrcode
vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,MOCK_QR_CODE"),
  },
}))

import { generateVoucher, generateVoucherHtml } from "../voucher-engine"
import { prisma } from "../prisma"

describe("Voucher Engine", () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe("generateVoucher", () => {
    it("should generate voucher with QR code for confirmed booking", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1",
        bookingCode: "MRV250315-0001",
        customerName: "Test User",
        status: "CONFIRMED",
        items: [{
          serviceName: "Airport Transfer",
          serviceSnapshot: {
            name: "Airport Transfer",
            date: "2025-03-20",
            time: "10:00",
            tripType: "ONE_WAY",
            passengers: 2,
            pickup: "Airport",
            dropoff: "Hotel",
          },
        }],
      } as any)

      const voucher = await generateVoucher("MRV250315-0001")

      expect(voucher.bookingCode).toBe("MRV250315-0001")
      expect(voucher.customerName).toBe("Test User")
      expect(voucher.serviceName).toBe("Airport Transfer")
      expect(voucher.date).toBe("2025-03-20")
      expect(voucher.time).toBe("10:00")
      expect(voucher.passengers).toBe(2)
      expect(voucher.qrCodeDataUrl).toContain("data:image/png;base64,MOCK_QR_CODE")
    })

    it("should throw for non-existent booking", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

      await expect(generateVoucher("MRV000000-0000")).rejects.toThrow("Booking not found")
    })

    it("should throw for unconfirmed booking", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1",
        bookingCode: "MRV250315-0001",
        status: "WAITING_PAYMENT",
        items: [],
      } as any)

      await expect(generateVoucher("MRV250315-0001")).rejects.toThrow(
        "only available for confirmed/paid bookings"
      )
    })
  })

  describe("generateVoucherHtml", () => {
    it("should generate HTML voucher with all details", () => {
      const html = generateVoucherHtml({
        bookingCode: "MRV250315-0001",
        customerName: "Test User",
        serviceName: "Airport Transfer",
        date: "2025-03-20",
        time: "10:00",
        tripType: "ONE_WAY",
        passengers: 2,
        pickup: "Airport",
        dropoff: "Hotel",
        qrCodeDataUrl: "data:image/png;base64,MOCK",
      })

      expect(html).toContain("MARIVO Travel Voucher")
      expect(html).toContain("MRV250315-0001")
      expect(html).toContain("Test User")
      expect(html).toContain("Airport Transfer")
      expect(html).toContain("Airport")
      expect(html).toContain("Hotel")
      expect(html).toContain("MOCK")
    })
  })
})