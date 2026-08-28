import { NextRequest } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { contactSchema } from "@/schemas/booking"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      },
    })

    // TODO: Send email notification via Resend
    // await resend.emails.send({ ... })

    return successResponse(
      { message: "Your message has been sent. We'll get back to you within 24 hours.", id: contactMessage.id },
      { statusCode: 201 }
    )
  } catch (error) {
    return errorResponse(error)
  }
}
