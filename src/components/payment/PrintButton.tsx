"use client"

import { Printer } from "lucide-react"

/**
 * Client island for the voucher print action. The surrounding payment result
 * card is a Server Component and cannot hold event handlers.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full sm:w-auto px-6 py-3 border-2 border-outline text-on-surface rounded-lg text-label-md font-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Print Voucher
    </button>
  )
}
