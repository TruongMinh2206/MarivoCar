"use client"
import { useState } from "react"
import type { Quote } from "@/types"
import type { QuoteInput } from "@/schemas/booking"

interface UseQuoteResult {
  quote: Quote | null
  loading: boolean
  error: string | null
  createQuote: (data: QuoteInput) => Promise<Quote | null>
  reset: () => void
}

export function useQuote(): UseQuoteResult {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createQuote = async (data: QuoteInput): Promise<Quote | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to create quote")
      }

      setQuote(json.data)
      return json.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setQuote(null)
    setError(null)
  }

  return { quote, loading, error, createQuote, reset }
}
