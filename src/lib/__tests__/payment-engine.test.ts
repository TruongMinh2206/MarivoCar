import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock @prisma/client enums
vi.mock("@prisma/client", () => ({
  BookingStatus: {
    WAITING_PAYMENT: "WAITING_PAYMENT",
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    PAID: "PAID",
    CANCELLED: "CANCELLED",
    PAYMENT_FAILED: "PAYMENT_FAILED",
    COMPLETED: "COMPLETED",
  },
  PaymentStatus: {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    PAID: "PAID",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED",
  },
}))

vi.mock("../prisma", () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    payment: {
      create: vi.fn(),
      update: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

import { initializePayment, processPaymentCallback } from "../payment-engine"
import { prisma } from "../prisma"
import { BookingStatus, PaymentStatus } from "@prisma/client"

describe("Payment Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("initializePayment", () => {
    it("should throw when booking not found", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue(null)

      await expect(
        initializePayment({ bookingId: "nonexistent", provider: "mock" })
      ).rejects.toThrow("Booking not found")
    })

    it("should throw when booking not in WAITING_PAYMENT status", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1", status: BookingStatus.PAID, total: 500000,
        currency: "VND", payments: [],
      } as any)

      await expect(
        initializePayment({ bookingId: "b1", provider: "mock" })
      ).rejects.toThrow("Booking cannot accept payment in status")
    })

    it("should throw when payment already completed", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1", status: BookingStatus.WAITING_PAYMENT, total: 500000,
        currency: "VND", bookingCode: "MRV250315-0001",
        payments: [{ status: PaymentStatus.PAID }],
      } as any)

      await expect(
        initializePayment({ bookingId: "b1", provider: "mock" })
      ).rejects.toThrow("Payment has already been completed")
    })

    it("should throw for invalid provider", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1", status: BookingStatus.WAITING_PAYMENT, total: 500000,
        currency: "VND", bookingCode: "MRV250315-0001", payments: [],
      } as any)

      await expect(
        initializePayment({ bookingId: "b1", provider: "invalid" })
      ).rejects.toThrow("Payment provider not supported")
    })

    it("should create payment record and return payment URL", async () => {
      vi.mocked(prisma.booking.findUnique).mockResolvedValue({
        id: "b1", bookingCode: "MRV250315-0001",
        status: BookingStatus.WAITING_PAYMENT, total: 500000,
        currency: "VND", payments: [],
      } as any)
      vi.mocked(prisma.payment.create).mockResolvedValue({ id: "pay-1" } as any)
      vi.mocked(prisma.payment.update).mockResolvedValue({} as any)
      vi.mocked(prisma.booking.update).mockResolvedValue({} as any)

      const result = await initializePayment({
        bookingId: "b1",
        provider: "mock",
      })

      expect(result.paymentId).toBe("pay-1")
      expect(result.provider).toBe("mock")
      expect(result.amount).toBe(500000)
      expect(result.paymentUrl).toContain("mock")
      expect(prisma.payment.create).toHaveBeenCalledTimes(1)
      expect(prisma.booking.update).toHaveBeenCalledTimes(1)
    })
  })

  describe("processPaymentCallback", () => {
    it("should throw for unknown provider", async () => {
      await expect(
        processPaymentCallback("unknown", {}, {})
      ).rejects.toThrow("Unknown payment provider")
    })

    it("should process successful payment (PAID)", async () => {
      vi.mocked(prisma.payment.findFirst).mockResolvedValue({
        id: "pay-1", bookingId: "b1", amount: 500000,
        status: PaymentStatus.PENDING, provider: "mock",
      } as any)

      const mockTx = {
        payment: { update: vi.fn().mockResolvedValue({}) },
        booking: { update: vi.fn().mockResolvedValue({}) },
      }
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn(mockTx))

      const result = await processPaymentCallback(
        "mock",
        { transactionId: "txn_123", amount: 500000, currency: "VND", status: "PAID" },
        {}
      )

      expect(result.success).toBe(true)
      expect(result.bookingId).toBe("b1")
      expect(mockTx.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: PaymentStatus.PAID }),
        })
      )
    })

    it("should handle idempotent callback (already PAID)", async () => {
      vi.mocked(prisma.payment.findFirst).mockResolvedValue({
        id: "pay-1", bookingId: "b1", amount: 500000,
        status: PaymentStatus.PAID, provider: "mock",
      } as any)

      const result = await processPaymentCallback(
        "mock",
        { transactionId: "txn_123", amount: 500000, currency: "VND", status: "PAID" },
        {}
      )

      expect(result.alreadyProcessed).toBe(true)
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it("should throw on amount mismatch", async () => {
      vi.mocked(prisma.payment.findFirst).mockResolvedValue({
        id: "pay-1", bookingId: "b1", amount: 500000,
        status: PaymentStatus.PENDING, provider: "mock",
      } as any)

      await expect(
        processPaymentCallback(
          "mock",
          { transactionId: "txn_123", amount: 300000, currency: "VND", status: "PAID" },
          {}
        )
      ).rejects.toThrow("Payment amount does not match")
    })

    it("should throw when payment not found", async () => {
      vi.mocked(prisma.payment.findFirst).mockResolvedValue(null)

      await expect(
        processPaymentCallback(
          "mock",
          { transactionId: "txn_123", amount: 500000, currency: "VND", status: "PAID" },
          {}
        )
      ).rejects.toThrow("Payment not found")
    })

    it("should handle FAILED status and update booking", async () => {
      vi.mocked(prisma.payment.findFirst).mockResolvedValue({
        id: "pay-1", bookingId: "b1", amount: 500000,
        status: PaymentStatus.PENDING, provider: "mock",
      } as any)

      const mockTx = {
        payment: { update: vi.fn().mockResolvedValue({}) },
        booking: { update: vi.fn().mockResolvedValue({}) },
      }
      vi.mocked(prisma.$transaction).mockImplementation(async (fn: any) => fn(mockTx))

      const result = await processPaymentCallback(
        "mock",
        { transactionId: "txn_123", amount: 500000, currency: "VND", status: "FAILED" },
        {}
      )

      expect(result.success).toBe(false)
      expect(mockTx.payment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: PaymentStatus.FAILED }),
        })
      )
      expect(mockTx.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: BookingStatus.PAYMENT_FAILED,
          }),
        })
      )
    })
  })
})