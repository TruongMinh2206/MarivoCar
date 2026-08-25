import { prisma } from "./prisma"
import { AppError } from "./errors"
import { validateQuote } from "./quote-engine"
import { reserveCapacity } from "./availability-engine"
import { generateBookingCode } from "./booking-code"
import { BOOKING_STATUS } from "@prisma/client"

interface CreateBookingInput {
  quoteId: string
  customer: {
    fullName: string
    email: string
    phone: string
    hotel?: string
    specialRequest?: string
  }
  userId?: string
  notes?: string
}

export async function createBooking(input: CreateBookingInput) {
  // Validate quote
  const quote = validateQuote(input.quoteId)

  // Re-validate availability before creating booking
  const { checkAvailability } = await import("./availability-engine")
  const availability = await checkAvailability({
    serviceId: quote.serviceId,
    vehicleId: quote.vehicleId,
    date: quote.date,
    time: quote.time,
    passengers: quote.passengers,
  })

  if (!availability.available) {
    throw new AppError(
      400,
      "SERVICE_UNAVAILABLE",
      "The selected service is no longer available for this date. Please create a new quote."
    )
  }

  // Recalculate price server-side (never trust client)
  const { calculatePrice } = await import("./price-engine")
  const priceResult = await calculatePrice({
    serviceId: quote.serviceId,
    vehicleId: quote.vehicleId,
    tripType: quote.tripType,
    date: quote.date,
    passengers: quote.passengers,
    luggage: quote.luggage,
  })

  const bookingCode = generateBookingCode()

  // Create booking in a transaction
  const booking = await prisma.$transaction(async (tx) => {
    // Create the booking
    const newBooking = await tx.booking.create({
      data: {
        bookingCode,
        userId: input.userId || null,
        status: BOOKING_STATUS.WAITING_PAYMENT,
        currency: priceResult.currency,
        subtotal: priceResult.subtotal,
        discount: priceResult.discount,
        serviceFee: priceResult.serviceFee,
        total: priceResult.total,
        customerName: input.customer.fullName,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        customerHotel: input.customer.hotel || null,
        specialRequest: input.customer.specialRequest || null,
        notes: input.notes || null,
        items: {
          create: {
            serviceId: quote.serviceId,
            quantity: 1,
            unitPrice: priceResult.subtotal,
            total: priceResult.total,
            serviceSnapshot: {
              name: quote.serviceName,
              vehicleName: quote.vehicleName,
              tripType: quote.tripType,
              date: quote.date,
              time: quote.time,
              passengers: quote.passengers,
              luggage: quote.luggage,
              pickup: quote.pickup,
              dropoff: quote.dropoff,
              flightNumber: quote.flightNumber,
            },
            metadata: {
              quoteId: quote.quoteId,
              originalQuoteTotal: quote.total,
            },
          },
        },
        // Create status history
        statusHistory: {
          create: {
            status: BOOKING_STATUS.WAITING_PAYMENT,
            note: "Booking created, awaiting payment",
          },
        },
      },
      include: {
        items: true,
        statusHistory: true,
      },
    })

    // Reserve capacity
    await reserveCapacity(quote.serviceId, quote.date, 1)

    return newBooking
  })

  return booking
}

export async function confirmBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { items: true },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  if (booking.status !== BOOKING_STATUS.PAID) {
    throw new AppError(
      400,
      "INVALID_STATUS",
      `Cannot confirm booking in status: ${booking.status}`
    )
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BOOKING_STATUS.CONFIRMED,
      statusHistory: {
        create: {
          status: BOOKING_STATUS.CONFIRMED,
          note: "Booking confirmed after payment verification",
        },
      },
    },
  })

  return { success: true }
}

export async function cancelBooking(bookingId: string, reason?: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { items: true },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  // Check if cancellation is allowed based on status
  const cancellableStatuses = [
    BOOKING_STATUS.WAITING_PAYMENT,
    BOOKING_STATUS.PENDING,
    BOOKING_STATUS.CONFIRMED,
  ]

  if (!cancellableStatuses.includes(booking.status)) {
    throw new AppError(
      400,
      "CANCELLATION_NOT_ALLOWED",
      `Booking cannot be cancelled in status: ${booking.status}`
    )
  }

  // Check cancellation policy
  const item = booking.items[0]
  if (item) {
    const serviceSnapshot = item.serviceSnapshot as Record<string, unknown>
    // TODO: Check against actual cancellation policy from service
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BOOKING_STATUS.CANCELLED,
        statusHistory: {
          create: {
            status: BOOKING_STATUS.CANCELLED,
            note: reason || "Booking cancelled by user",
          },
        },
      },
    })

    // Release capacity
    const { releaseCapacity } = await import("./availability-engine")
    const dateStr = (item?.serviceSnapshot as Record<string, unknown>)?.date as string
    if (dateStr) {
      await releaseCapacity(item.serviceId, dateStr, 1)
    }
  })

  return { success: true }
}

export async function getBookingByCode(bookingCode: string) {
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: {
      items: true,
      payments: true,
      statusHistory: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  return booking
}

export async function getUserBookings(
  userId: string,
  status?: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { userId }
  if (status) {
    where.status = status
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        items: {
          include: {
            service: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ])

  return {
    data: bookings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}
