import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const categories = await prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        image: true,
        description: true,
        _count: {
          select: { services: { where: { isActive: true } } },
        },
      },
    })

    return successResponse(categories)
  } catch (error) {
    return errorResponse(error)
  }
}
