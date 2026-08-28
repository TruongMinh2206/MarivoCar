import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { createBooking } from "@/lib/booking-engine"
import { bookingCreateSchema } from "@/schemas/booking"
import { prisma } from "@/lib/prisma"
import { v4 as uuid } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = bookingCreateSchema.safeParse(body)
    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid booking request",
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }

    // For guest bookings: create or find a guest user by email
    const customerEmail = result.data.customer.email
    let userId: string

    // Try to find existing user by email, or create a guest user
    const existingUser = await prisma.user.findUnique({
      where: { email: customerEmail },
    })

    if (existingUser) {
      userId = existingUser.id
    } else {
      // Create a guest user
      const guestUser = await prisma.user.create({
        data: {
          email: customerEmail,
          name: result.data.customer.fullName,
          phone: result.data.customer.phone,
          role: "CUSTOMER",
        },
      })
      userId = guestUser.id
    }

    const booking = await createBooking({
      ...result.data,
      userId,
    })

    return successResponse(booking, { statusCode: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
