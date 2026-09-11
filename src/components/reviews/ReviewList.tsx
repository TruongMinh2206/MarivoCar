"use client"

import { Rating } from "@/components/ui/Rating"
import { cn } from "@/utils/cn"

export interface ReviewItem {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

interface ReviewListProps {
  reviews: ReviewItem[]
  className?: string
}

/** Renders the date part of a review, e.g. "10/9/2026". */
function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN")
}

function ReviewAvatar({ name }: { name: string }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold uppercase text-primary">
      {name.slice(0, 1)}
    </div>
  )
}

function ReviewList({ reviews, className }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-body-md font-body-md text-on-surface-variant">
        No reviews yet — be the first to share your experience.
      </p>
    )
  }

  return (
    <ul className={cn("space-y-6", className)}>
      {reviews.map((review) => {
        const name = review.user?.name || "Anonymous"

        return (
          <li
            key={review.id}
            data-testid="review-item"
            className="border-b border-outline-variant/40 pb-6 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start gap-3">
              <ReviewAvatar name={name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-label-md font-label-md font-semibold text-on-surface">
                    {name}
                  </span>
                  <time
                    dateTime={review.createdAt}
                    className="text-label-sm font-label-sm text-on-surface-variant"
                  >
                    {formatReviewDate(review.createdAt)}
                  </time>
                </div>
                <div className="mt-1">
                  <Rating value={review.rating} size="sm" showValue={false} />
                </div>
                {review.comment && (
                  <p className="mt-2 text-body-md font-body-md text-on-surface-variant">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export { ReviewList }
