import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("../prisma", () => ({
  prisma: {
    notification: { create: vi.fn().mockResolvedValue({} as any) },
  },
}))

import {
  bookingConfirmationEmail,
  paymentSuccessEmail,
  sendNotification,
} from "../notification-engine"
import { prisma } from "../prisma"

describe("Notification Engine", () => {
  beforeEach(() => { vi.clearAllMocks() })

  describe("bookingConfirmationEmail", () => {
    it("should generate HTML with booking details", () => {
      const html = bookingConfirmationEmail({
        bookingCode: "MRV250315-0001",
        customerName: "Test User",
        serviceName: "Airport Transfer",
        date: "2025-03-20",
        time: "10:00",
        tripType: "ONE_WAY",
        total: 525000,
        currency: "VND",
      })

      expect(html).toContain("MRV250315-0001")
      expect(html).toContain("Test User")
      expect(html).toContain("Airport Transfer")
      expect(html).toContain("2025-03-20")
      expect(html).toContain("525,000")
      expect(html).toContain("One Way")
    })

    it("should show Round Trip label for round trip", () => {
      const html = bookingConfirmationEmail({
        bookingCode: "MRV250315-0002",
        customerName: "Test",
        serviceName: "Tour",
        date: "2025-03-20",
        time: "09:00",
        tripType: "ROUND_TRIP",
        total: 1000000,
        currency: "VND",
      })

      expect(html).toContain("Round Trip")
    })
  })

  describe("paymentSuccessEmail", () => {
    it("should generate HTML with payment details", () => {
      const html = paymentSuccessEmail({
        bookingCode: "MRV250315-0001",
        customerName: "Test User",
        total: 525000,
        currency: "VND",
      })

      expect(html).toContain("Payment Received")
      expect(html).toContain("MRV250315-0001")
      expect(html).toContain("525,000")
    })
  })

  describe("sendNotification", () => {
    it("should save notification to database", async () => {
      await sendNotification({
        userId: "user-1",
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        message: "Your booking is confirmed",
        email: "test@example.com",
        emailSubject: "Booking Confirmed",
        emailHtml: "<html>test</html>",
      })

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          type: "BOOKING_CONFIRMED",
          title: "Booking Confirmed",
          message: "Your booking is confirmed",
          isRead: false,
        },
      })
    })

    it("should not throw if email fails", async () => {
      // Should not throw even if email sending fails
      await expect(
        sendNotification({
          type: "SYSTEM",
          title: "Test",
          message: "Test",
          email: "test@example.com",
          emailSubject: "Test",
          emailHtml: "<html>test</html>",
        })
      ).resolves.toBeUndefined()
    })
  })
})