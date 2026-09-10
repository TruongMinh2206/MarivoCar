import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MockPaymentForm } from "../MockPaymentForm"

// ─── Mocks ──────────────────────────────────────────────────────────────────

const pushMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}))

// ─── Helpers ────────────────────────────────────────────────────────────────

const BASE_PROPS = {
  txn: "txn_abc12345",
  amount: 375000,
  currency: "VND",
  bookingCode: "MRV250910-0001",
}

/** The pay action button ("Pay 375,000 ₫") — excludes "Cancel payment". */
function payButton() {
  return screen.getByRole("button", { name: /^pay/i })
}

function renderForm(overrides: Partial<typeof BASE_PROPS> = {}) {
  return render(<MockPaymentForm {...BASE_PROPS} {...overrides} />)
}

function mockFetchOk() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ success: true }),
  })
  vi.stubGlobal("fetch", fetchMock)
  return fetchMock
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe("MockPaymentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe("rendering", () => {
    it("shows the booking code and formatted amount", () => {
      renderForm()

      expect(screen.getByText(BASE_PROPS.bookingCode)).toBeInTheDocument()
      // Amount is grouped with a locale separator (, or . depending on ICU)
      expect(
        screen.getByText((_, element) =>
          element?.classList.contains("text-headline-sm") === true &&
          /^375[.,]000/.test(element.textContent?.trim() || "") === true
        )
      ).toBeInTheDocument()
    })

    it("shows currency code when not VND", () => {
      renderForm({ currency: "USD" })

      // The "Amount due" row shows the currency, not the button label
      expect(
        screen.getByText((_, element) =>
          element?.classList.contains("text-headline-sm") === true &&
          element.textContent?.includes("USD") === true
        )
      ).toBeInTheDocument()
    })

    it("renders Pay and Cancel actions", () => {
      renderForm()

      expect(payButton()).toBeInTheDocument()
      expect(
        screen.getByRole("button", { name: /^cancel/i })
      ).toBeInTheDocument()
    })

    it("shows an error state when the transaction id is missing", () => {
      renderForm({ txn: "" })

      expect(
        screen.getByText(/invalid payment session/i)
      ).toBeInTheDocument()
      // No pay/cancel actions in the invalid state
      expect(screen.queryByRole("button", { name: /^pay/i })).not.toBeInTheDocument()
    })
  })

  describe("successful payment", () => {
    it("sends PAID callback to the webhook and redirects to success", async () => {
      const fetchMock = mockFetchOk()
      const user = userEvent.setup()

      renderForm()
      await user.click(payButton())

      // Webhook called with the exact session data
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/payments/webhook?provider=mock",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionId: BASE_PROPS.txn,
            amount: BASE_PROPS.amount,
            currency: BASE_PROPS.currency,
            status: "PAID",
          }),
        }
      )
      expect(fetchMock).toHaveBeenCalledTimes(1)

      // Redirects to the success page with the booking reference
      expect(pushMock).toHaveBeenCalledWith(
        `/payment/success?booking=${BASE_PROPS.bookingCode}`
      )
    })

    it("does not send the callback twice while processing", async () => {
      const fetchMock = vi.fn().mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: () => Promise.resolve({ success: true }) }), 50))
      )
      vi.stubGlobal("fetch", fetchMock)
      const user = userEvent.setup()

      renderForm()
      const button = payButton()

      // Double click before the first request resolves
      await user.click(button)
      await user.click(button)

      expect(fetchMock).toHaveBeenCalledTimes(1)
    })
  })

  describe("cancelled payment", () => {
    it("sends CANCELLED callback and redirects to the failed page", async () => {
      const fetchMock = mockFetchOk()
      const user = userEvent.setup()

      renderForm()
      await user.click(screen.getByRole("button", { name: /^cancel/i }))

      const call = fetchMock.mock.calls[0]
      const body = JSON.parse(call[1].body)
      expect(body.status).toBe("CANCELLED")

      expect(pushMock).toHaveBeenCalledWith(
        `/payment/failed?booking=${BASE_PROPS.bookingCode}`
      )
    })
  })

  describe("webhook failure", () => {
    it("shows an error and allows retrying", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({ error: { message: "boom" } }),
        })
      )
      const user = userEvent.setup()

      renderForm()
      const button = payButton()

      await user.click(button)

      // Error surfaced, no redirect
      expect(screen.getByText(/could not complete/i)).toBeInTheDocument()
      expect(pushMock).not.toHaveBeenCalled()

      // Buttons are enabled again for retry
      expect(button).toBeEnabled()
    })
  })
})
