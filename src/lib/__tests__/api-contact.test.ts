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
    contactMessage: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
  },
}))

import { prisma } from "../prisma"
import { POST } from "@/app/api/contact/route"

// Helper to create a mock NextRequest
function mockRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as any
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should save contact message to database", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "msg-1",
      name: "Test User",
      email: "test@example.com",
      phone: "0901234567",
      subject: "Inquiry",
      message: "I would like to know more about your services.",
      isRead: false,
      createdAt: new Date(),
    } as any)

    const req = mockRequest({
      name: "Test User",
      email: "test@example.com",
      phone: "0901234567",
      subject: "Inquiry",
      message: "I would like to know more about your services.",
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(201)
    expect(json.data.message).toContain("has been sent")
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        email: "test@example.com",
        phone: "0901234567",
        subject: "Inquiry",
        message: "I would like to know more about your services.",
      },
    })
  })

  it("should return 400 for invalid data", async () => {
    const req = mockRequest({
      name: "",
      email: "not-an-email",
      subject: "Hi",
      message: "Short",
    })

    const res = await POST(req)
    const json = await res.json()

    expect(res.status).toBe(400)
    expect(json.error.code).toBe("VALIDATION_ERROR")
  })

  it("should handle optional phone field", async () => {
    vi.mocked(prisma.contactMessage.create).mockResolvedValue({
      id: "msg-2", name: "No Phone", email: "no@example.com",
      phone: null, subject: "Question", message: "Do you have availability?",
      isRead: false, createdAt: new Date(),
    } as any)

    const req = mockRequest({
      name: "No Phone",
      email: "no@example.com",
      subject: "Question",
      message: "Do you have availability for next week?",
    })

    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(prisma.contactMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ phone: null }),
    })
  })
})