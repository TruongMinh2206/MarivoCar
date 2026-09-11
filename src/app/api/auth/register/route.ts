import { NextRequest } from "next/server"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { registerSchema } from "@/schemas/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { RATE_LIMIT } from "@/lib/constants"
import { ValidationError, ConflictError, TooManyRequestsError } from "@/lib/errors"

/**
 * POST /api/auth/register — create a new CUSTOMER account.
 *
 * Returns 201 with the public user payload (never the password hash).
 * Email collisions return 409; payload validation 400; rate-limit 429.
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      `register:${getClientIp(request)}`,
      RATE_LIMIT.REGISTER
    )
    if (!rateLimit.allowed) {
      throw new TooManyRequestsError(rateLimit.retryAfterMs)
    }

    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError("Invalid registration data", parsed.data)
    }
    const { name, email, phone, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new ConflictError("An account with this email already exists")
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: UserRole.CUSTOMER,
      },
      select: { id: true, email: true, name: true, phone: true, role: true },
    })

    return successResponse({ user }, { statusCode: 201 })
  } catch (error) {
    return errorResponse(error)
  }
}
