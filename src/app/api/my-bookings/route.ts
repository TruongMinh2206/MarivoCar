import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const status = searchParams.get("status")

    if (!email) {
      return Response.json(
        { error: { code: "VALIDATION_ERROR", message: "Email is required" } },
        { status: 400 }
      )
    }

    const where: Record<string, unknown> = {
      customerEmail: email,
    }

    if (status && status !== "ALL") {
      if (status === "UPCOMING") {
        where.status = { in: ["PENDING", "WAITING_PAYMENT", "PAID", "CONFIRMED"] }
      } else if (status === "COMPLETED") {
        where.status = "COMPLETED"
      } else if (status === "CANCELLED") {
        where.status = { in: ["CANCELLED", "PAYMENT_FAILED", "REFUNDED"] }
      } else {
        where.status = status
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            serviceName: true,
            quantity: true,
            unitPrice: true,
            total: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(bookings)
  } catch (error) {
    return errorResponse(error)
  }
}
