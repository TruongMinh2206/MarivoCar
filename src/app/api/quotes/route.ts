import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { createQuote } from "@/lib/quote-engine"
import { quoteSchema } from "@/schemas/booking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = quoteSchema.safeParse(body)
    if (!result.success) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid quote request",
            details: result.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }

    const quote = await createQuote(result.data)

    return successResponse(quote)
  } catch (error) {
    return errorResponse(error)
  }
}
