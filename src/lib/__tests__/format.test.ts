import { describe, it, expect } from "vitest"
import { formatPrice } from "../format"

describe("formatPrice", () => {
  it("formats VND with the dong symbol by default", () => {
    expect(formatPrice(375000)).toMatch(/^375[.,]000 ₫$/)
  })

  it("formats an explicit VND currency the same as the default", () => {
    expect(formatPrice(375000, "VND")).toMatch(/^375[.,]000 ₫$/)
  })

  it("appends the currency code for non-VND currencies", () => {
    expect(formatPrice(375, "USD")).toBe("375 USD")
  })

  it("groups thousands with the vi-VN separator (ICU quirk safe)", () => {
    // Node full-ICU renders vi-VN with "." groups, small-ICU with "," — see HANDOFF.md #7
    expect(formatPrice(1250000)).toMatch(/^1[.,]250[.,]000 ₫$/)
  })

  it("does not group numbers under 1000", () => {
    expect(formatPrice(0)).toBe("0 ₫")
    expect(formatPrice(999)).toBe("999 ₫")
  })
})
