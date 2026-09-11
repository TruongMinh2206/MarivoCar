import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock prisma
vi.mock("@prisma/client", () => ({
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
    booking: {
      findUnique: vi.fn(),
    },
    review: {
      findUnique: vi.fn(),
      create: vi.fn(),
      aggregate: vi.fn(),
    },
    service: {
      update: vi.fn(),
    },
  },
}))

import { prisma } from "../prisma"
import { POST } from "@/app/api/reviews/route"

// Helper to create a mock NextRequest
function mockRequest(body: unknown) {
  return new Request("http://localhost/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any
}

// ─── Fixtures ────────────────────────────────────────────────────────────────

const VALID_BODY = {
  serviceId: "svc-sedan-1",
  bookingCode: "MRV250910-0001",
  email: "guest@example.com",
  rating: 5,
  comment: "Excellent driver, on time!",
}

const BOOKING = {
  id: "booking-1",
  bookingCode: "MRV250910-0001",
  userId: "user-guest-1",
  serviceId: "svc-sedan-1",
  customerEmail: "guest@example.com",
  status: "COMPLETED",
  items: [{ id: "item-1", serviceId: "svc-sedan-1", serviceName: "Airport Transfer - Sedan" }],
}

const CREATED_REVIEW = {
  id: "review-1",
  userId: "user-guest-1",
  serviceId: "svc-sedan-1",
  bookingId: "booking-1",
  rating: 5,
  comment: "Excellent driver, on time!",
  isVisible: true,
  createdAt: new Date(),
}

function setupHappyPath() {
  vi.mocked(prisma.booking.findUnique).mockResolvedValue(BOOKING as any)
  vi.mocked(prisma.review.findUnique).mockResolvedValue(null)
  vi.mocked(prisma.review.create).mockResolvedValue(CREATED_REVIEW as any)
  vi.mocked(prisma.review.aggregate).mockResolvedValue({
    _avg: { rating: 4.5 },
    _count: { rating: 2 },
  } as any)
  vi.mocked(prisma.service.update).mockResolvedValue({ id: "svc-sedan-1" } as any)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("creates a review with the booking's real userId (not anonymous)", async () => {
    setupHappyPath()

    const res = await POST(mockRequest(VALID_BODY))
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.data.rating).toBe(5)

    // Booking is looked up by bookingCode (guest-friendly), not raw cuid
    expect(prisma.booking.findUnique).toHaveBeenCalledWith({
      where: { bookingCode: VALID_BODY.bookingCode },
      include: { items: { select: { serviceId: true } } },
    })

    // FK integrity: review is created with the booking's userId
    expect(prisma.review.create).toHaveBeenCalledWith({
      data: {
        userId: "user-guest-1",
        serviceId: "svc-sedan-1",
        bookingId: "booking-1",
        rating: 5,
        comment: "Excellent driver, on time!",
      },
    })
  })

  it("returns 404 when the booking does not exist", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

    const res = await POST(mockRequest(VALID_BODY))
    const json = await res.json()

    expect(res.status).toBe(404)
    expect(json.error.code).toBe("NOT_FOUND")
    expect(prisma.review.create).not.toHaveBeenCalled()
  })

  it("returns 403 when the email does not match the booking", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(BOOKING as any)

    const res = await POST(
      mockRequest({ ...VALID_BODY, email: "someone-else@example.com" })
    )
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.error.code).toBe("FORBIDDEN")
    expect(prisma.review.create).not.toHaveBeenCalled()
  })

  it("returns 403 when the booking is for a different service", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue({
      ...BOOKING,
      items: [{ serviceId: "svc-other-1", serviceName: "Other Service" }],
    } as any)

    const res = await POST(mockRequest(VALID_BODY))
    const json = await res.json()

    expect(res.status).toBe(403)
    expect(json.error.code).toBe("FORBIDDEN")
    expect(prisma.review.create).not.toHaveBeenCalled()
  })

  it("returns 409 when the booking has already been reviewed", async () => {
    vi.mocked(prisma.booking.findUnique).mockResolvedValue(BOOKING as any)
    vi.mocked(prisma.review.findUnique).mockResolvedValue(CREATED_REVIEW as any)

    const res = await POST(mockRequest(VALID_BODY))
    const json = await res.json()

    expect(res.status).toBe(409)
    expect(json.error.code).toBe("CONFLICT")
    expect(prisma.review.create).not.toHaveBeenCalled()
  })

  it("returns 400 for invalid input (rating 6, bad email)", async () => {
    const res = await POST(
      mockRequest({ ...VALID_BODY, rating: 6, email: "not-an-email" })
    )

    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
    expect(prisma.review.create).not.toHaveBeenCalled()
  })

  it("updates the service rating aggregate after creating", async () => {
    setupHappyPath()

    await POST(mockRequest(VALID_BODY))

    expect(prisma.review.aggregate).toHaveBeenCalledWith({
      where: { serviceId: "svc-sedan-1", isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    })
    expect(prisma.service.update).toHaveBeenCalledWith({
      where: { id: "svc-sedan-1" },
      data: { rating: 4.5, reviewCount: 2 },
    })
  })
})
