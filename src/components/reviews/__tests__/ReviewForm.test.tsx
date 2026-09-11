import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ReviewForm } from "../ReviewForm"

// ─── Helpers ────────────────────────────────────────────────────────────────

const BASE_PROPS = {
  serviceId: "svc-sedan-1",
  serviceName: "Airport Transfer - Sedan",
}

const VALID_BODY = {
  serviceId: "svc-sedan-1",
  bookingCode: "MRV250910-0001",
  email: "guest@example.com",
  rating: 5,
  comment: "Excellent driver!",
}

/** POST /api/reviews resolves 201 with the created review. */
function mockApiCreated() {
  const fetchMock = vi.fn().mockImplementation((input: string) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { id: "review-1", rating: 5 } }),
    })
  )
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/booking code/i), VALID_BODY.bookingCode)
  await user.type(screen.getByLabelText(/email/i), VALID_BODY.email)
  await user.click(screen.getByRole("radio", { name: /rate 5/i }))
  await user.type(screen.getByLabelText(/comment/i), VALID_BODY.comment)
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("ReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders booking code, email, star rating and comment fields", () => {
    render(<ReviewForm {...BASE_PROPS} />)

    expect(screen.getByLabelText(/booking code/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/comment/i)).toBeInTheDocument()
    expect(screen.getAllByRole("radio", { name: /^rate \d/i })).toHaveLength(5)
  })

  it("submits the review to the API with the expected payload", async () => {
    const fetchMock = mockApiCreated()
    const onCreated = vi.fn()
    const user = userEvent.setup()

    render(<ReviewForm {...BASE_PROPS} onCreated={onCreated} />)
    await fillForm(user)
    await user.click(screen.getByRole("button", { name: /^submit review/i }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    expect(fetchMock).toHaveBeenCalledWith("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VALID_BODY),
    })
    await waitFor(() => expect(onCreated).toHaveBeenCalled())
  })

  it("shows a success message after submit", async () => {
    mockApiCreated()
    const user = userEvent.setup()

    render(<ReviewForm {...BASE_PROPS} />)
    await fillForm(user)
    await user.click(screen.getByRole("button", { name: /^submit review/i }))

    expect(await screen.findByText(/thank you for your review/i)).toBeInTheDocument()
  })

  it("surfaces API errors without crashing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: { code: "FORBIDDEN", message: "This email does not match the booking" } }),
      })
    )
    const user = userEvent.setup()

    render(<ReviewForm {...BASE_PROPS} />)
    await fillForm(user)
    await user.click(screen.getByRole("button", { name: /^submit review/i }))

    expect(
      await screen.findByText(/email does not match/i)
    ).toBeInTheDocument()
  })

  it("blocks submit while rating or booking code is missing (client-side validation)", async () => {
    const fetchMock = mockApiCreated()
    const user = userEvent.setup()

    render(<ReviewForm {...BASE_PROPS} />)
    // Fill only email, no booking code / rating
    await user.type(screen.getByLabelText(/email/i), VALID_BODY.email)
    await user.click(screen.getByRole("button", { name: /^submit review/i }))

    // A visible validation message appears and the API is never called
    expect(
      await screen.findByText(/please complete all required fields/i)
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
