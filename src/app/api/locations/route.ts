import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        area: true,
      },
    })

    return successResponse(locations)
  } catch (error) {
    return errorResponse(error)
  }
}
