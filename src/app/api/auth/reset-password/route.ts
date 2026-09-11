import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { resetPasswordSchema } from "@/schemas/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { RATE_LIMIT } from "@/lib/constants"
import { ValidationError, TooManyRequestsError } from "@/lib/errors"

const INVALID_TOKEN_MESSAGE = "This password reset link is invalid or has expired. Please request a new one."

/**
 * POST /api/auth/reset-password — consume a reset token and set a new
 * password.
 *
 * The token is single-use: it is deleted immediately after the password
 * update. Expired or unknown tokens return the same 400 message so the
 * response leaks nothing.
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      `reset-password:${getClientIp(request)}`,
      RATE_LIMIT.PASSWORD_RESET
    )
    if (!rateLimit.allowed) {
      throw new TooManyRequestsError(rateLimit.retryAfterMs)
    }

    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError("Invalid reset request")
    }
    const { token, password } = parsed.data

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken || verificationToken.expires.getTime() < Date.now()) {
      throw new ValidationError(INVALID_TOKEN_MESSAGE)
    }

    const passwordHash = await hashPassword(password)

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { passwordHash },
    })

    await prisma.verificationToken.delete({ where: { token } })

    return successResponse({
      message: "Your password has been reset successfully. You can now sign in with your new password.",
    })
  } catch (error) {
    return errorResponse(error)
  }
}
