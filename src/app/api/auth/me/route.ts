import { NextRequest } from "next/server"
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const rawToken = request.cookies.get(SESSION_COOKIE_NAME)?.value
    const { user } = await getSessionUser(rawToken)
    if (!user) {
      return Response.json({ user: null }, { status: 200 })
    }
    return successResponse({ user })
  } catch (error) {
    return errorResponse(error)
  }
}
