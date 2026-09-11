/**
 * Shared price formatting for the whole app.
 *
 * VND is the site default: rendered with the Vietnamese locale grouping
 * and the dong symbol (₫). Other currencies append their ISO code.
 */
const VND_CURRENCY = "VND"
const DONG_SYMBOL = "₫"

export function formatPrice(amount: number, currency: string = VND_CURRENCY): string {
  if (currency === VND_CURRENCY) {
    return `${amount.toLocaleString("vi-VN")} ${DONG_SYMBOL}`
  }
  return `${amount.toLocaleString("vi-VN")} ${currency}`
}
