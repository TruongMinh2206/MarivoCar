import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const voucher = await prisma.voucher.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!voucher) {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "Voucher not found" } },
        { status: 404 }
      )
    }

    return successResponse(voucher)
  } catch (error) {
    return errorResponse(error)
  }
}
