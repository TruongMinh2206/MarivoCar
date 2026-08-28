"use client"
import { useState, useEffect, useCallback } from "react"

interface BookingSummary {
  id: string
  bookingCode: string
  status: string
  total: number
  currency: string
  createdAt: string
  items: Array<{
    id: string
    serviceName: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

interface UseMyBookingsResult {
  bookings: BookingSummary[]
  loading: boolean
  error: string | null
  activeTab: string
  setActiveTab: (tab: string) => void
  refetch: () => void
}

export function useMyBookings(email: string | null): UseMyBookingsResult {
  const [bookings, setBookings] = useState<BookingSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("ALL")

  const fetchBookings = useCallback(async () => {
    if (!email) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ email })
      if (activeTab !== "ALL") params.set("status", activeTab)

      const res = await fetch(`/api/my-bookings?${params}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to fetch bookings")
      }

      setBookings(json.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [email, activeTab])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return { bookings, loading, error, activeTab, setActiveTab, refetch: fetchBookings }
}
