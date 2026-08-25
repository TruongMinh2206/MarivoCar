import { prisma } from "./prisma"
import { AppError } from "./errors"
import { v4 as uuid } from "uuid"
import { PAYMENT_STATUS, BOOKING_STATUS } from "@prisma/client"

interface PaymentInitInput {
  bookingId: string
  provider: string
  paymentMethod?: string
  returnUrl?: string
  cancelUrl?: string
}

interface PaymentInitResult {
  paymentId: string
  paymentUrl: string
  provider: string
  amount: number
  currency: string
}

// Abstracted payment provider interface
interface PaymentProvider {
  name: string
  createPayment(amount: number, currency: string, metadata: Record<string, unknown>): Promise<{ url: string; transactionId: string }>
  verifyCallback(body: unknown, headers: Record<string, string>): Promise<{
    verified: boolean
    transactionId: string
    amount: number
    currency: string
    status: "PAID" | "FAILED" | "CANCELLED"
  }>
}

// Mock payment provider for development
class MockPaymentProvider implements PaymentProvider {
  name = "mock"

  async createPayment(
    amount: number,
    currency: string,
    metadata: Record<string, unknown>
  ) {
    const transactionId = `txn_${uuid().slice(0, 8)}`
    const paymentUrl = `/payment/mock?txn=${transactionId}&amount=${amount}&currency=${currency}&booking=${metadata.bookingCode}`
    return { url: paymentUrl, transactionId }
  }

  async verifyCallback(body: unknown, headers: Record<string, string>) {
    const data = body as Record<string, string>
    return {
      verified: true,
      transactionId: data.transactionId || `txn_${uuid().slice(0, 8)}`,
      amount: Number(data.amount) || 0,
      currency: data.currency || "VND",
      status: (data.status as "PAID" | "FAILED" | "CANCELLED") || "PAID",
    }
  }
}

// Initialize payment providers
const providers: Record<string, PaymentProvider> = {
  mock: new MockPaymentProvider(),
  // Add real providers here:
  // momo: new MomoProvider(),
  // vnpay: new VnPayProvider(),
  // stripe: new StripeProvider(),
}

export async function initializePayment(input: PaymentInitInput): Promise<PaymentInitResult> {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { payments: true },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  if (booking.status !== BOOKING_STATUS.WAITING_PAYMENT) {
    throw new AppError(
      400,
      "INVALID_BOOKING_STATUS",
      `Booking cannot accept payment in status: ${booking.status}`
    )
  }

  // Check if payment already exists and is successful
  const existingPaidPayment = booking.payments.find(
    (p) => p.status === PAYMENT_STATUS.PAID
  )
  if (existingPaidPayment) {
    throw new AppError(
      409,
      "PAYMENT_ALREADY_COMPLETED",
      "Payment has already been completed for this booking"
    )
  }

  const provider = providers[input.provider]
  if (!provider) {
    throw new AppError(400, "INVALID_PROVIDER", `Payment provider not supported: ${input.provider}`)
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: input.provider,
      paymentMethod: input.paymentMethod || null,
      amount: booking.total,
      currency: booking.currency,
      status: PAYMENT_STATUS.PENDING,
      transactionId: null,
      metadata: {
        bookingCode: booking.bookingCode,
      },
    },
  })

  // Initialize with payment provider
  const result = await provider.createPayment(
    Number(booking.total),
    booking.currency,
    {
      bookingCode: booking.bookingCode,
      paymentId: payment.id,
    }
  )

  // Update payment with transaction ID
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      transactionId: result.transactionId,
      status: PAYMENT_STATUS.PROCESSING,
      providerResponse: result,
    },
  })

  // Update booking status
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: BOOKING_STATUS.PENDING,
      statusHistory: {
        create: {
          status: BOOKING_STATUS.PENDING,
          note: `Payment initiated via ${input.provider}`,
        },
      },
    },
  })

  return {
    paymentId: payment.id,
    paymentUrl: result.url,
    provider: input.provider,
    amount: Number(booking.total),
    currency: booking.currency,
  }
}

export async function processPaymentCallback(
  provider: string,
  callbackBody: unknown,
  callbackHeaders: Record<string, string>
) {
  const paymentProvider = providers[provider]
  if (!paymentProvider) {
    throw new AppError(400, "INVALID_PROVIDER", `Unknown payment provider: ${provider}`)
  }

  // Verify the callback
  const verification = await paymentProvider.verifyCallback(callbackBody, callbackHeaders)

  if (!verification.verified) {
    console.error("Payment verification failed:", { provider, callbackBody })
    throw new AppError(400, "VERIFICATION_FAILED", "Payment verification failed")
  }

  // Find the payment
  const payment = await prisma.payment.findFirst({
    where: {
      provider,
      transactionId: verification.transactionId,
    },
    include: { booking: true },
  })

  if (!payment) {
    console.error("Payment not found:", verification.transactionId)
    throw new AppError(404, "PAYMENT_NOT_FOUND", "Payment not found")
  }

  // Idempotency check - already processed
  if (payment.status === PAYMENT_STATUS.PAID) {
    return { success: true, bookingId: payment.bookingId, alreadyProcessed: true }
  }

  // Verify amount
  if (verification.amount !== Number(payment.amount)) {
    console.error("Amount mismatch:", {
      expected: payment.amount,
      received: verification.amount,
    })
    throw new AppError(400, "AMOUNT_MISMATCH", "Payment amount does not match")
  }

  // Process based on status
  const newPaymentStatus =
    verification.status === "PAID"
      ? PAYMENT_STATUS.PAID
      : verification.status === "FAILED"
      ? PAYMENT_STATUS.FAILED
      : PAYMENT_STATUS.CANCELLED

  await prisma.$transaction(async (tx) => {
    // Update payment
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: newPaymentStatus,
        paidAt: verification.status === "PAID" ? new Date() : null,
        providerResponse: verification,
      },
    })

    // Update booking based on payment result
    const newBookingStatus =
      verification.status === "PAID"
        ? BOOKING_STATUS.PAID
        : verification.status === "FAILED"
        ? BOOKING_STATUS.PAYMENT_FAILED
        : BOOKING_STATUS.CANCELLED

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: newBookingStatus,
        statusHistory: {
          create: {
            status: newBookingStatus,
            note: `Payment ${verification.status.toLowerCase()} via ${provider}`,
          },
        },
      },
    })
  })

  // If payment successful, trigger confirmation flow
  if (verification.status === "PAID") {
    // TODO: Trigger email confirmation (async)
    // await triggerBookingConfirmation(payment.bookingId)
  }

  return {
    success: verification.status === "PAID",
    bookingId: payment.bookingId,
    paymentStatus: newPaymentStatus,
  }
}

export async function getPaymentByBookingId(bookingId: string) {
  return prisma.payment.findMany({
    where: { bookingId },
    orderBy: { createdAt: "desc" },
  })
}
