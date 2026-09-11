import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ReviewList } from "../ReviewList"

// ─── Fixtures ────────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    id: "r1",
    rating: 5,
    comment: "Great service, driver was on time!",
    createdAt: "2026-09-10T12:00:00.000Z",
    user: { name: "John Tourist", image: null },
  },
  {
    id: "r2",
    rating: 4,
    comment: null,
    createdAt: "2026-09-09T12:00:00.000Z",
    user: { name: null, image: null },
  },
]

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("ReviewList", () => {
  it("shows reviewer name, stars, comment and date for each review", () => {
    render(<ReviewList reviews={REVIEWS} />)

    expect(screen.getByText("John Tourist")).toBeInTheDocument()
    expect(
      screen.getByText("Great service, driver was on time!")
    ).toBeInTheDocument()
    // Two reviews rendered
    expect(screen.getByText("10/9/2026")).toBeInTheDocument()
    expect(screen.getByText("9/9/2026")).toBeInTheDocument()
  })

  it("falls back to Anonymous when the reviewer has no name", () => {
    render(<ReviewList reviews={REVIEWS} />)

    expect(screen.getByText("Anonymous")).toBeInTheDocument()
  })

  it("shows an empty state when there are no reviews", () => {
    render(<ReviewList reviews={[]} />)

    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument()
  })
})
