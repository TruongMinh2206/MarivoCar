import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { getBookingByCode } from "@/lib/booking-engine"

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
      const { prisma } = await import("@/lib/prisma")
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

    // TODO: Check authorization - user can only see their own bookings

    return successResponse(booking)
  } catch (error) {
    return errorResponse(error)
  }
}
