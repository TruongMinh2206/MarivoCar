import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  verifyPassword,
  createSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth"
import { errorResponse } from "@/lib/api-utils"
import { UnauthorizedError, ValidationError, TooManyRequestsError } from "@/lib/errors"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"
import { RATE_LIMIT } from "@/lib/constants"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Throttle brute-force attempts: 5 per IP per 15-minute window.
    const rateLimit = checkRateLimit(
      `login:${getClientIp(request)}`,
      RATE_LIMIT.LOGIN
    )
    if (!rateLimit.allowed) {
      throw new TooManyRequestsError(rateLimit.retryAfterMs)
    }

    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError("Invalid login request")
    }
    const { email, password, rememberMe } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError("Invalid email or password")
    }
    if (!user.isActive) {
      throw new UnauthorizedError("Account is disabled")
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password")
    }

    const session = await createSession(user.id)

    const maxAge = rememberMe ? 7 * 86400 : undefined // session cookie if not remembered
    const response = NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          image: user.image,
        },
      },
    })

    response.cookies.set(SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
    })

    return response
  } catch (error) {
    return errorResponse(error)
  }
}
