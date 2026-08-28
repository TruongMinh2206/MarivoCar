import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { reviewSchema } from "@/schemas/booking"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    // Check if already reviewed
    const existing = await prisma.review.findUnique({
      where: { bookingId: data.bookingId },
    })

    if (existing) {
      return Response.json(
        { error: { code: "CONFLICT", message: "You have already reviewed this booking" } },
        { status: 409 }
      )
    }

    const review = await prisma.review.create({
      data: {
        userId: "anonymous", // Will be replaced with real auth
        serviceId: data.serviceId,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
    })

    // Update service rating
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
