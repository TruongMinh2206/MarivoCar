"use client"

import { Fragment, useState } from "react"
import { Star, MessageSquare, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/utils/cn"

interface ReviewFormProps {
  serviceId: string
  serviceName: string
  /** Called after the API accepts the review (parent refreshes the list). */
  onCreated?: () => void
}

const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"] as const
const MAX_COMMENT_LENGTH = 1000

const inputClass =
  "w-full rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"

export function ReviewForm({ serviceId, serviceName, onCreated }: ReviewFormProps) {
  const [bookingCode, setBookingCode] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleRatingSelect = (value: number): void => {
    setRating(value)
    setValidationError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    setValidationError(null)
    setError(null)

    if (!bookingCode.trim() || !email.trim() || rating === 0) {
      setValidationError("Please complete all required fields.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          bookingCode: bookingCode.trim(),
          email: email.trim(),
          rating,
          comment: comment.trim() || undefined,
        }),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Could not submit your review")
      }

      setSuccess(true)
      setBookingCode("")
      setEmail("")
      setRating(0)
      setComment("")
      onCreated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your review")
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-lg border border-success/40 bg-success/5 p-4 text-body-md font-body-md text-on-surface"
      >
        <BadgeCheck className="h-5 w-5 shrink-0 text-success" />
        <p>Thank you for your review! It is now visible on this service.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-body-md font-body-md text-on-surface-variant">
        Booked <span className="font-semibold text-on-surface">{serviceName}</span>{" "}
        with us? Share your experience using your booking reference.
      </p>

      {validationError && (
        <p role="alert" className="text-label-md font-label-md text-error">
          {validationError}
        </p>
      )}
      {error && (
        <p role="alert" className="text-label-md font-label-md text-error">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="review-booking-code"
            className="mb-1.5 block text-label-md font-label-md font-medium text-on-surface"
          >
            Booking code <span className="text-error">*</span>
          </label>
          <input
            id="review-booking-code"
            type="text"
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            placeholder="e.g. MRV250910-0001"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label
            htmlFor="review-email"
            className="mb-1.5 block text-label-md font-label-md font-medium text-on-surface"
          >
            Email used for booking <span className="text-error">*</span>
          </label>
          <input
            id="review-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            required
          />
        </div>
      </div>

      <div>
        <span className="mb-1.5 block text-label-md font-label-md font-medium text-on-surface">
          Your rating <span className="text-error">*</span>
        </span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
          {RATING_LABELS.map((label, index) => {
            const value = index + 1
            const isFilled = value <= rating

            return (
              <Fragment key={value}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`Rate ${value}: ${label}`}
                  onClick={() => handleRatingSelect(value)}
                  className={cn(
                    "rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    "disabled:opacity-50"
                  )}
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      isFilled
                        ? "fill-gold-400 text-gold-400"
                        : "fill-transparent text-outline-variant"
                    )}
                  />
                </button>
                {value === rating && (
                  <span className="ml-1 text-label-md font-label-md font-medium text-on-surface-variant">
                    {label}
                  </span>
                )}
              </Fragment>
            )
          })}
        </div>
      </div>

      <div>
        <label
          htmlFor="review-comment"
          className="mb-1.5 block text-label-md font-label-md font-medium text-on-surface"
        >
          Your comment <span className="text-on-surface-variant">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          rows={4}
          placeholder="Tell other travelers about your experience..."
          className={cn(inputClass, "resize-y")}
        />
        <p className="mt-1 text-right text-label-sm font-label-sm text-on-surface-variant">
          {comment.length}/{MAX_COMMENT_LENGTH}
        </p>
      </div>

      <Button type="submit" disabled={submitting} loading={submitting}>
        <MessageSquare className="h-4 w-4" />
        Submit review
      </Button>
    </form>
  )
}
