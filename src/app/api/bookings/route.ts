import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { createBooking } from "@/lib/booking-engine"
import { bookingCreateSchema } from "@/schemas/booking"

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

    // TODO: Get userId from session
    const userId = undefined

    const booking = await createBooking({
      ...result.data,
      userId,
    })

    return successResponse(booking, { statusCode: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
