import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@prisma/client", () => ({
  UserRole: {
    CUSTOMER: "CUSTOMER", STAFF: "STAFF", MANAGER: "MANAGER",
    ADMIN: "ADMIN", SUPER_ADMIN: "SUPER_ADMIN",
  },
  BookingStatus: {
    WAITING_PAYMENT: "WAITING_PAYMENT", PENDING: "PENDING",
    CONFIRMED: "CONFIRMED", PAID: "PAID", CANCELLED: "CANCELLED",
    PAYMENT_FAILED: "PAYMENT_FAILED", COMPLETED: "COMPLETED",
  },
  PaymentStatus: {
    PENDING: "PENDING", PROCESSING: "PROCESSING", PAID: "PAID",
    FAILED: "FAILED", CANCELLED: "CANCELLED", REFUNDED: "REFUNDED",
  },
}))

vi.mock("../prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn(), create: vi.fn() },
    booking: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    bookingItem: { createMany: vi.fn() },
    serviceAvailability: { findFirst: vi.fn(), update: vi.fn() },
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
    subtotal: 500000, discount: 0, serviceFee: 25000,
    total: 525000, currency: "VND", breakdown: [],
  }),
}))

vi.mock("../booking-code", () => ({
  generateBookingCode: vi.fn().mockReturnValue("MRV250315-0001"),
  ensureUniqueBookingCode: vi.fn().mockResolvedValue("MRV250315-0001"),
}))

vi.mock("../quote-engine", () => ({
  validateQuote: vi.fn().mockReturnValue({
    quoteId: "q1", serviceId: "svc-1", serviceName: "Airport Transfer",
    vehicleId: "veh-1", vehicleName: "Sedan", tripType: "ONE_WAY",
    date: "2025-03-15", time: "10:00", passengers: 2, luggage: 1,
    pickup: undefined, dropoff: undefined, flightNumber: undefined,
    priceBreakdown: [], subtotal: 500000, discount: 0,
    serviceFee: 25000, total: 525000, currency: "VND",
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }),
}))

vi.mock("../payment-engine", () => ({
  initializePayment: vi.fn().mockResolvedValue({
    paymentId: "pay-1", paymentUrl: "/payment/mock?txn=test",
    provider: "mock", amount: 525000, currency: "VND",
  }),
  getPaymentByBookingId: vi.fn().mockResolvedValue([]),
}))

import { GET, PATCH } from "@/app/api/bookings/[id]/route"
import { prisma } from "../prisma"

function mockRequest(body?: unknown, method = "GET") {
  return new Request(`http://localhost/api/bookings/test`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }) as any
}

describe("GET /api/bookings/[id]", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("should find booking by code (starts with MRV)", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: "b1", bookingCode: "MRV250315-0001",
      customerName: "Test", customerEmail: "t@t.com",
      customerPhone: "0901234567", customerHotel: null,
      specialRequest: null, items: [], payments: [],
      statusHistory: [],
    } as any)

    const req = mockRequest()
    const res = await GET(req, { params: Promise.resolve({ id: "MRV250315-0001" }) })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data.bookingCode).toBe("MRV250315-0001")
    expect(json.data.customer.fullName).toBe("Test")
  })

  it("should return 404 for non-existent booking", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

    const req = mockRequest()
    const res = await GET(req, { params: Promise.resolve({ id: "MRV000000-0000" }) })
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error.code).toBe("BOOKING_NOT_FOUND")
  })
})

describe("PATCH /api/bookings/[id] (cancel)", () => {
  beforeEach(() => { vi.clearAllMocks() })

  it("should cancel a booking", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      id: "b1", status: "WAITING_PAYMENT",
      items: [{ serviceId: "svc-1", serviceSnapshot: { date: "2025-03-15" } }],
    } as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => {
      return fn({ booking: { update: vi.fn().mockResolvedValue({}) } })
    })

    const req = mockRequest({ status: "CANCELLED" }, "PATCH")
    const res = await PATCH(req, { params: Promise.resolve({ id: "b1" }) })
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json.data.message).toContain("cancelled")
  })

  it("should reject invalid status update", async () => {
    const req = mockRequest({ status: "INVALID" }, "PATCH")
    const res = await PATCH(req, { params: Promise.resolve({ id: "b1" }) })
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("INVALID_STATUS")
  })
})