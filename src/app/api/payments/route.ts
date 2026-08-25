import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { initializePayment } from "@/lib/payment-engine"
import { paymentInitSchema } from "@/schemas/booking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = paymentInitSchema.safeParse(body)
    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid payment request",
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }

    const payment = await initializePayment({
      bookingId: result.data.bookingId,
      provider: result.data.provider,
      paymentMethod: result.data.paymentMethod,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
    })

    return successResponse(payment)
  } catch (error) {
    return errorResponse(error)
  }
}
