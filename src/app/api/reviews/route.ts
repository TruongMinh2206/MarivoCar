import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { reviewSchema } from "@/schemas/booking"
import { NotFoundError, ForbiddenError, ConflictError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    // ── Verify the booking exists (guest reviews are anchored to a booking) ──
    const booking = await prisma.booking.findUnique({
      where: { bookingCode: data.bookingCode },
      include: { items: { select: { serviceId: true } } },
    })

    if (!booking) {
      throw new NotFoundError("Booking", data.bookingCode)
    }

    // ── Verify the reviewer owns the booking (email must match) ───────────────
    if (booking.customerEmail?.toLowerCase() !== data.email.toLowerCase()) {
      throw new ForbiddenError("This email does not match the booking")
    }

    // ── Verify the review is for a service on that booking ───────────────────
    const isServiceOnBooking = booking.items.some(
      (item) => item.serviceId === data.serviceId
    )

    if (!isServiceOnBooking) {
      throw new ForbiddenError("This booking does not include the reviewed service")
    }

    // ── One review per booking ──────────────────────────────────────────────
    const existing = await prisma.review.findUnique({
      where: { bookingId: booking.id },
    })

    if (existing) {
      throw new ConflictError("You have already reviewed this booking")
    }

    // ── Create with the booking's real userId (FK integrity) ─────────────────
    const review = await prisma.review.create({
      data: {
        userId: booking.userId,
        serviceId: data.serviceId,
        bookingId: booking.id,
        rating: data.rating,
        comment: data.comment,
      },
    })

    // ── Refresh the service's rating aggregate ───────────────────────────────
    const stats = await prisma.review.aggregate({
      where: { serviceId: data.serviceId, isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    })

    await prisma.service.update({
      where: { id: data.serviceId },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count.rating,
      },
    })

    return successResponse(review, { statusCode: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceId = searchParams.get("serviceId")

    if (!serviceId) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: "serviceId is required" } },
        { status: 400 }
      )
    }

    const reviews = await prisma.review.findMany({
      where: { serviceId, isVisible: true },
      include: {
        user: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return successResponse(reviews)
  } catch (error) {
    return errorResponse(error)
  }
}
