import { NextRequest, NextResponse } from "next/server"
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth"
import { errorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    if (rawToken) {
      try {
        await destroySession(rawToken)
      } catch {
        // session already gone — ignore
      }
    }
    const response = NextResponse.json({ data: { success: true } })
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
    return response
  } catch (error) {
    return errorResponse(error)
  }
}
