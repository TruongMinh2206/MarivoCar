"use client"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./Button"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-red-50 p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}

export { ErrorState }
