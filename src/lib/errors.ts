export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public requestId?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(404, "NOT_FOUND", id ? resource + " " + id + " not found" : resource + " not found")
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(401, "UNAUTHORIZED", message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(403, "FORBIDDEN", message)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(400, "VALIDATION_ERROR", message)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "CONFLICT", message)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return Response.json(
      { error: { code: error.code, message: error.message, requestId: error.requestId } },
      { status: error.statusCode },
    )
  }
  // Handle Zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as { issues: Array<{ path: string[]; message: string }> }
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of zodError.issues) {
      const key = issue.path.join(".") || "_root"
      if (!fieldErrors[key]) fieldErrors[key] = []
      fieldErrors[key].push(issue.message)
    }
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: "Validation failed", details: fieldErrors } },
      { status: 400 },
    )
  }
  console.error("Unhandled error:", error)
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
    { status: 500 },
  )
}
