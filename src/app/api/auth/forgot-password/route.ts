import { NextRequest } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { forgotPasswordSchema } from "@/schemas/auth"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { RATE_LIMIT } from "@/lib/constants"
import { ValidationError, TooManyRequestsError } from "@/lib/errors"

/** How long a password-reset token stays valid. */
const RESET_TOKEN_TTL_MINUTES = 30

/** Generic reply used whether or not the email exists (anti-enumeration). */
const GENERIC_SUCCESS_MESSAGE =
  "If an account with this email exists, we have sent a password reset link. Please check your inbox."

function buildResetEmail(resetUrl: string) {
  return {
    subject: "Reset your MARIVO password",
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your MARIVO.vn password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in ${RESET_TOKEN_TTL_MINUTES} minutes. If you did not request this, you can safely ignore this email.</p>
    `,
    text: `Reset your MARIVO password: ${resetUrl} (expires in ${RESET_TOKEN_TTL_MINUTES} minutes)`,
  }
}

/**
 * POST /api/auth/forgot-password — issue a single-use reset token.
 *
 * Always returns 200 with the same generic message so callers cannot
 * probe which emails have accounts. The token is emailed via
 * `sendEmail` (console fallback in development); it is never returned
 * in the HTTP response.
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(
      `forgot-password:${getClientIp(request)}`,
      RATE_LIMIT.PASSWORD_RESET
    )
    if (!rateLimit.allowed) {
      throw new TooManyRequestsError(rateLimit.retryAfterMs)
    }

    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError("Invalid email address")
    }
    const { email } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      const rawToken = randomBytes(32).toString("base64url")
      const expires = new Date(
        Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000
      )

      await prisma.verificationToken.create({
        data: { identifier: email, token: rawToken, expires },
      })

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const resetUrl = `${appUrl}/reset-password?token=${rawToken}`

      await sendEmail({ to: email, ...buildResetEmail(resetUrl) })
    }

    return successResponse({ message: GENERIC_SUCCESS_MESSAGE })
  } catch (error) {
    return errorResponse(error)
  }
}
