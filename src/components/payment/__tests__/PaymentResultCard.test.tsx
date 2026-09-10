import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PaymentResultCard } from "../PaymentResultCard"

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BOOKING = {
  bookingCode: "MRV250910-0001",
  customerName: "John Tourist",
  status: "PAID",
  total: 375000,
  currency: "VND",
  tripDate: "2026-09-15",
  tripTime: "14:30",
  pickupLocation: "Phu Quoc Airport (PQC)",
  dropoffLocation: "JW Marriott Phu Quoc",
  serviceName: "Airport Transfer - Sedan",
  serviceCategory: "airport transfer",
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("PaymentResultCard (success)", () => {
  it("shows the booking reference from the loaded booking", () => {
    render(<PaymentResultCard result="success" booking={BOOKING} />)

    expect(screen.getByText(BOOKING.bookingCode)).toBeInTheDocument()
    expect(
      screen.getByText(/your booking is confirmed/i)
    ).toBeInTheDocument()
  })

  it("shows the service name, date, and locations", () => {
    render(<PaymentResultCard result="success" booking={BOOKING} />)

    expect(screen.getByText(BOOKING.serviceName)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(BOOKING.tripDate))).toBeInTheDocument()
    // Substring match — pickup text also contains the icon's svg parent node
    expect(
      screen.getByText((content, element) =>
        element?.tagName === "P" && content.includes(BOOKING.pickupLocation)
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText((content, element) =>
        element?.tagName === "P" && content.includes(BOOKING.dropoffLocation)
      )
    ).toBeInTheDocument()
  })

  it("shows a link to the booking detail and home", () => {
    render(<PaymentResultCard result="success" booking={BOOKING} />)

    const detailLink = screen.getByRole("link", { name: /view my booking/i })
    expect(detailLink).toHaveAttribute(
      "href",
      `/my-bookings/${BOOKING.bookingCode}`
    )
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute(
      "href",
      "/"
    )
  })
})

describe("PaymentResultCard (failed)", () => {
  it("shows a failure headline and pending status", () => {
    render(
      <PaymentResultCard
        result="failed"
        booking={{ ...BOOKING, status: "WAITING_PAYMENT" }}
      />
    )

    expect(
      screen.getByText(/payment was not completed/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/pending payment/i)).toBeInTheDocument()
  })

  it("links to retry payment and support", () => {
    render(
      <PaymentResultCard
        result="failed"
        booking={{ ...BOOKING, status: "WAITING_PAYMENT" }}
      />
    )

    const retryLink = screen.getByRole("link", { name: /retry payment/i })
    expect(retryLink).toHaveAttribute(
      "href",
      `/my-bookings/${BOOKING.bookingCode}/payment`
    )
    expect(screen.getByRole("link", { name: /contact support/i })).toHaveAttribute(
      "href",
      "/contact"
    )
  })
})

describe("PaymentResultCard (missing booking)", () => {
  it("shows a not-found state instead of crashing", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    render(<PaymentResultCard result="success" booking={null} />)

    expect(screen.getByText(/booking not found/i)).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /back to home/i })
    ).toBeInTheDocument()
  })
})
