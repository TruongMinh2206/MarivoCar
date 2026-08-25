import { NextRequest } from "next/server"
import { handleApiError } from "./errors"

export function getSearchParams(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const params: Record<string, string> = {}
  searchParams.forEach((value, key) => { params[key] = value })
  return params
}

export function getPaginationParams(request: NextRequest) {
  const params = getSearchParams(request)
  const page = Math.max(1, parseInt(params.page || "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(params.limit || "20", 10)))
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function successResponse(data: unknown, meta?: Record<string, unknown>) {
  return Response.json({ data, meta })
}

export function errorResponse(error: unknown) {
  return handleApiError(error)
}
