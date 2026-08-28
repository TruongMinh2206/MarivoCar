import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@prisma/client", () => ({
  UserRole: {
    CUSTOMER: "CUSTOMER", STAFF: "STAFF", MANAGER: "MANAGER",
    ADMIN: "ADMIN", SUPER_ADMIN: "SUPER_ADMIN",
  },
  BookingStatus: {
    WAITING_PAYMENT: "WAITING_PAYMENT",
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PAID: "PAID",
    CANCELLED: "CANCELLED",
    PAYMENT_FAILED: "PAYMENT_FAILED",
    COMPLETED: "COMPLETED",
  },
}))

vi.mock("../prisma", () => ({
  prisma: {
    booking: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    bookingItem: {
      createMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock("../availability-engine", () => ({
  checkAvailability: vi.fn().mockResolvedValue({ available: true, remainingCapacity: 10, maxCapacity: 20 }),
  reserveCapacity: vi.fn().mockResolvedValue(undefined),
  releaseCapacity: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("../price-engine", () => ({
  calculatePrice: vi.fn().mockResolvedValue({
    subtotal: 500000,
    discount: 0,
    serviceFee: 25000,
    total: 525000,
    currency: "VND",
    breakdown: [],
  }),
}))

vi.mock("../booking-code", () => ({
  generateBookingCode: vi.fn().mockReturnValue("MRV250315-0001"),
}))

vi.mock("../quote-engine", () => ({
  validateQuote: vi.fn().mockResolvedValue({
    quoteId: "quote-1",
    serviceId: "svc-1",
    serviceName: "Airport Transfer",
    vehicleId: "veh-1",
    vehicleName: "Sedan",
    tripType: "ONE_WAY",
    date: "2025-03-15",
    time: "10:00",
    passengers: 2,
    luggage: 1,
    pickup: undefined,
    dropoff: undefined,
    flightNumber: undefined,
    priceBreakdown: [],
    subtotal: 500000,
    discount: 0,
    serviceFee: 25000,
    total: 525000,
    currency: "VND",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }),
  markQuoteUsed: vi.fn().mockResolvedValue(undefined),
}))

import { createBooking, getBookingByCode, cancelBooking, confirmBooking } from "../booking-engine"
import { prisma } from "../prisma"

describe("Booking Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createBooking", () => {
    it("should create booking with correct data from quote", async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
        const mockTx = {
          booking: {
            create: vi.fn().mockResolvedValue({
              id: "booking-1",
              bookingCode: "MRV250315-0001",
              status: "WAITING_PAYMENT",
              total: 525000,
            }),
          },
        }
        return fn(mockTx)
      })

      const result = await createBooking({
        quoteId: "quote-1",
        customer: {
          fullName: "Test User",
          email: "test@example.com",
          phone: "0901234567",
          hotel: "Resort",
          specialRequest: "Late arrival",
        },
        userId: "user-1",
        notes: "VIP",
      })

      expect(result.bookingCode).toBe("MRV250315-0001")
      expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    })

    it("should create booking without userId (guest)", async () => {
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
        const mockTx = {
          booking: {
            create: vi.fn().mockResolvedValue({
              id: "booking-1",
              bookingCode: "MRV250315-0001",
              status: "WAITING_PAYMENT",
              total: 525000,
            }),
          },
        }
        return fn(mockTx)
      })

      const result = await createBooking({
        quoteId: "quote-1",
        customer: {
          fullName: "Guest User",
          email: "guest@example.com",
          phone: "0901234567",
        },
      })

      expect(result.bookingCode).toBe("MRV250315-0001")
    })
  })

  describe("getBookingByCode", () => {
    it("should find booking by code with items and payments", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "booking-1",
        bookingCode: "MRV250315-0001",
        items: [],
        payments: [],
      } as any)

      const result = await getBookingByCode("MRV250315-0001")
      expect(result).toBeDefined()
      expect(result?.bookingCode).toBe("MRV250315-0001")
    })

    it("should throw for non-existent code", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

      await expect(getBookingByCode("MRV000000-0000")).rejects.toThrow("Booking not found")
    })
  })

  describe("confirmBooking", () => {
    it("should confirm a paid booking", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "booking-1",
        status: "PAID",
        items: [],
      } as any)
      vi.mocked(prisma.booking.update).mockResolvedValue({} as any)

      const result = await confirmBooking("booking-1")

      expect(result.success).toBe(true)
      expect(prisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "booking-1" },
          data: { status: "CONFIRMED" },
        })
      )
    })

    it("should throw if booking not paid", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "booking-1",
        status: "WAITING_PAYMENT",
        items: [],
      } as any)

      await expect(confirmBooking("booking-1")).rejects.toThrow("Cannot confirm booking in status")
    })
  })

  describe("cancelBooking", () => {
    it("should cancel a waiting payment booking", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "booking-1",
        status: "WAITING_PAYMENT",
        items: [{ serviceId: "svc-1", serviceSnapshot: { date: "2025-03-15" } }],
      } as any)
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
        const mockTx = { booking: { update: vi.fn().mockResolvedValue({} as any) } }
        return fn(mockTx)
      })

      const result = await cancelBooking("booking-1", "Customer cancelled")

      expect(result.success).toBe(true)
      expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    })

    it("should throw if booking not cancellable", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "booking-1",
        status: "COMPLETED",
        items: [],
      } as any)

      await expect(cancelBooking("booking-1")).rejects.toThrow("Booking cannot be cancelled")
    })
  })
})