"use client"
import { useState } from "react"
import type { BookingDetail } from "@/types"
import type { BookingCreateInput } from "@/schemas/booking"

interface UseBookingResult {
  booking: BookingDetail | null
  loading: boolean
  error: string | null
  createBooking: (data: BookingCreateInput) => Promise<BookingDetail | null>
  getBooking: (id: string) => Promise<BookingDetail | null>
}

export function useBooking(): UseBookingResult {
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (data: BookingCreateInput): Promise<BookingDetail | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to create booking")
      }

      setBooking(json.data)
      return json.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getBooking = async (id: string): Promise<BookingDetail | null> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${id}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Booking not found")
      }

      setBooking(json.data)
      return json.data
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { booking, loading, error, createBooking, getBooking }
}
