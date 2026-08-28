import { prisma } from "./prisma"
import { AppError, ForbiddenError } from "./errors"
import { validateQuote, markQuoteUsed } from "./quote-engine"
import { reserveCapacity } from "./availability-engine"
import { generateBookingCode } from "./booking-code"
import { audit } from "./audit"
import { BookingStatus, UserRole } from "@prisma/client"

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
  // Validate quote (from DB, survives restarts)
  const quote = await validateQuote(input.quoteId)

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
    const newBooking = await tx.booking.create({
      data: {
        bookingCode,
        userId: input.userId || "",
        status: BookingStatus.WAITING_PAYMENT,
        currency: priceResult.currency,
        subtotal: priceResult.subtotal,
        discount: priceResult.discount,
        serviceFee: priceResult.serviceFee,
        total: priceResult.total,
        customerName: input.customer.fullName,
        customerEmail: input.customer.email,
        customerPhone: input.customer.phone,
        customerHotel: input.customer.hotel,
        specialRequest: input.customer.specialRequest,
        notes: input.notes,
        items: {
          create: {
            serviceId: quote.serviceId,
            serviceName: quote.serviceName,
            quantity: 1,
            unitPrice: priceResult.subtotal,
            total: priceResult.total,
            serviceSnapshot: JSON.parse(JSON.stringify({
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
            })),
            metadata: JSON.parse(JSON.stringify({
              quoteId: quote.quoteId,
              originalQuoteTotal: quote.total,
            })),
          },
        },
      },
      include: {
        items: true,
      },
    })

    // Reserve capacity
    await reserveCapacity(quote.serviceId, quote.date, 1)

    return newBooking
  })

  // Mark the quote as used so it cannot create another booking
  await markQuoteUsed(quote.quoteId)

  return booking
}

export async function markBookingPaid(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  const payableStatuses: BookingStatus[] = [
    BookingStatus.WAITING_PAYMENT,
    BookingStatus.PENDING,
  ]

  if (!payableStatuses.includes(booking.status as BookingStatus)) {
    throw new AppError(
      400,
      "INVALID_STATUS",
      `Cannot mark booking as paid in status: ${booking.status}`
    )
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.PAID,
    },
  })

  return { success: true }
}

export async function confirmBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { items: true },
  })

  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  if (booking.status !== BookingStatus.PAID) {
    throw new AppError(
      400,
      "INVALID_STATUS",
      `Cannot confirm booking in status: ${booking.status}`
    )
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CONFIRMED,
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

  const cancellableStatuses: BookingStatus[] = [
    BookingStatus.WAITING_PAYMENT,
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
  ] as BookingStatus[]

  if (!cancellableStatuses.includes(booking.status as BookingStatus)) {
    throw new AppError(
      400,
      "CANCELLATION_NOT_ALLOWED",
      `Booking cannot be cancelled in status: ${booking.status}`
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    })

    // Release capacity
    const item = booking.items[0]
    if (item) {
      const { releaseCapacity } = await import("./availability-engine")
      const serviceSnapshot = item.serviceSnapshot as Record<string, unknown>
      const dateStr = serviceSnapshot?.date as string
      if (dateStr) {
        await releaseCapacity(item.serviceId, dateStr, 1)
      }
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

// ---------------------------------------------------------------------------
// Admin booking operations (Phase 2 + 3): controlled state transitions.
// ---------------------------------------------------------------------------

export interface TransitionActor {
  actorId?: string | null
  actorRole: UserRole
}

/** Which roles may drive any given target status. */
const TRANSITION_ALLOWED_ROLES: Record<BookingStatus, UserRole[]> = {
  [BookingStatus.CONFIRMED]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF],
  [BookingStatus.IN_PROGRESS]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF],
  [BookingStatus.COMPLETED]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF],
  [BookingStatus.CANCELLED]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER],
  [BookingStatus.REFUND_REQUESTED]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.STAFF, UserRole.CUSTOMER],
  [BookingStatus.REFUNDED]: [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER],
  // Transitions to the following are handled by payment engine, not admin UI:
  [BookingStatus.DRAFT]: [],
  [BookingStatus.PENDING]: [],
  [BookingStatus.WAITING_PAYMENT]: [],
  [BookingStatus.PAID]: [],
  [BookingStatus.PAYMENT_FAILED]: [],
}

/** Allowed (from -> to) transitions for the admin/customer lifecycle. */
const TRANSITION_MATRIX: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.DRAFT]: [BookingStatus.PENDING, BookingStatus.WAITING_PAYMENT, BookingStatus.CANCELLED],
  [BookingStatus.PENDING]: [BookingStatus.WAITING_PAYMENT, BookingStatus.PAID, BookingStatus.PAYMENT_FAILED, BookingStatus.CANCELLED],
  [BookingStatus.WAITING_PAYMENT]: [BookingStatus.PAID, BookingStatus.PENDING, BookingStatus.CANCELLED, BookingStatus.PAYMENT_FAILED],
  [BookingStatus.PAID]: [BookingStatus.CONFIRMED, BookingStatus.REFUND_REQUESTED, BookingStatus.CANCELLED],
  [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
  [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.PAYMENT_FAILED]: [BookingStatus.WAITING_PAYMENT, BookingStatus.CANCELLED],
  [BookingStatus.REFUND_REQUESTED]: [BookingStatus.REFUNDED, BookingStatus.CANCELLED],
  [BookingStatus.REFUNDED]: [],
}

/**
 * The single, authorized entry point for changing a booking's status.
 * Validates the transition matrix + actor role, records a status-history row,
 * and writes an audit log. Side effects (capacity release, notifications) are
 * dispatched from here.
 */
export async function transitionBookingStatus(
  bookingId: string,
  to: BookingStatus,
  actor: TransitionActor
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { items: true },
  })
  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }

  const from = booking.status as BookingStatus

  // Permission check first (spec: authorization enforced server-side).
  const allowedRoles = TRANSITION_ALLOWED_ROLES[to] ?? []
  if (!allowedRoles.includes(actor.actorRole)) {
    throw new ForbiddenError("Insufficient permissions for this status change")
  }

  // Transition legality.
  const next = TRANSITION_MATRIX[from] ?? []
  if (!next.includes(to)) {
    throw new AppError(
      400,
      "INVALID_TRANSITION",
      `Cannot change booking from ${from} to ${to}`
    )
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: to },
    })

    await tx.bookingStatusHistory.create({
      data: {
        bookingId,
        status: to,
        note: actor.actorRole === UserRole.CUSTOMER ? "updated by customer" : "updated by staff",
      },
    })

    // Side effects based on the NEW status.
    if (to === BookingStatus.CANCELLED) {
      const item = booking.items[0]
      if (item) {
        const { releaseCapacity } = await import("./availability-engine")
        const snapshot = item.serviceSnapshot as Record<string, unknown> | null
        const dateStr = snapshot?.date as string | undefined
        if (item.serviceId && dateStr) {
          await releaseCapacity(item.serviceId, dateStr, 1)
        }
      }
    }
  })

  await audit({
    actorId: actor.actorId ?? null,
    action: "CHANGE_STATUS",
    entity: "Booking",
    entityId: bookingId,
    metadata: { from, to, actorRole: actor.actorRole },
  })

  return { success: true, from, to }
}

/** CONFIRMED -> IN_PROGRESS (admin). */
export function startTrip(bookingId: string, actor: TransitionActor) {
  return transitionBookingStatus(bookingId, BookingStatus.IN_PROGRESS, actor)
}

/** IN_PROGRESS -> COMPLETED (admin). */
export function completeBooking(bookingId: string, actor: TransitionActor) {
  return transitionBookingStatus(bookingId, BookingStatus.COMPLETED, actor)
}

// ---------------------------------------------------------------------------
// Admin queries.
// ---------------------------------------------------------------------------

export interface AdminBookingsQuery {
  page?: number
  limit?: number
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export async function getAdminBookings(query: AdminBookingsQuery = {}) {
  const page = Math.max(1, query.page || 1)
  const limit = Math.min(100, Math.max(1, query.limit || 20))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (query.status) {
    where.status = query.status
  }
  if (query.search) {
    where.OR = [
      { bookingCode: { contains: query.search } },
      { customerName: { contains: query.search } },
      { customerEmail: { contains: query.search } },
    ]
  }
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {
      ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
      ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
    }
  }

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ])

  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
}

export async function getBookingDetailAdmin(idOrCode: string) {
  const booking = await prisma.booking.findUnique({
    where: idOrCode.startsWith("MRV") ? { bookingCode: idOrCode } : { id: idOrCode },
    include: {
      items: true,
      payments: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      review: true,
      voucher: true,
    },
  })
  if (!booking) {
    throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found")
  }
  return booking
}
