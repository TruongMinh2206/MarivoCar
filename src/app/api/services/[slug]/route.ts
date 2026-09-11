import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { CUID_PATTERN } from "@/lib/service-resolver"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // The booking wizard passes either a slug (canonical) or a legacy Prisma
    // cuid deep link — resolve both against the same rich detail payload.
    const service = await prisma.service.findFirst({
      where: {
        isActive: true,
        ...(CUID_PATTERN.test(slug) ? { id: slug } : { slug }),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        location: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
            address: true,
            latitude: true,
            longitude: true,
            area: true,
          },
        },
        images: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true,
            sortOrder: true,
          },
        },
        prices: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            priceType: true,
            basePrice: true,
            currency: true,
            minQuantity: true,
            maxQuantity: true,
            dayOfWeek: true,
            validFrom: true,
            validUntil: true,
          },
        },
        vehicles: {
          where: { isActive: true },
          include: {
            vehicleType: {
              select: { name: true, slug: true, icon: true },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true, alt: true, isPrimary: true },
            },
          },
        },
        tour: true,
        ticket: true,
        hotel: {
          include: {
            rooms: {
              where: { isActive: true },
              orderBy: { price: "asc" },
            },
          },
        },
        restaurant: true,
        spa: true,
        reviews: {
          where: { isVisible: true },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { reviews: true },
        },
      },
    })

    if (!service) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Service not found" } },
        { status: 404 }
      )
    }

    return successResponse(service)
  } catch (error) {
    return errorResponse(error)
  }
}
