import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { getBookingByCode, cancelBooking, markBookingPaid } from "@/lib/booking-engine"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try finding by booking code first, then by ID
    let booking
    if (id.startsWith("MRV")) {
      booking = await getBookingByCode(id)
    } else {
      booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          items: true,
          payments: true,
          statusHistory: {
            orderBy: { createdAt: "asc" },
          },
        },
      })
    }

    if (!booking) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Booking not found" } },
        { status: 404 }
      )
    }

    // Transform booking to match BookingDetail type
    const transformed = {
      ...booking,
      customer: {
        fullName: booking.customerName || "",
        email: booking.customerEmail || "",
        phone: booking.customerPhone || "",
        hotel: booking.customerHotel || undefined,
        specialRequest: booking.specialRequest || undefined,
      },
    }

    return successResponse(transformed)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (body.status === "CANCELLED") {
      await cancelBooking(id)
      return successResponse({ message: "Booking cancelled successfully" })
    }

    if (body.status === "PAID") {
      await markBookingPaid(id)
      return successResponse({ message: "Payment recorded successfully" })
    }

    return Response.json(
      { error: { code: "INVALID_STATUS", message: "Invalid status update" } },
      { status: 400 }
    )
  } catch (error) {
    return errorResponse(error)
  }
}
