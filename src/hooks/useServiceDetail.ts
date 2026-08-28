"use client"
import { useState, useEffect } from "react"
import type { ServiceDetail } from "@/types"

interface UseServiceDetailResult {
  service: ServiceDetail | null
  loading: boolean
  error: string | null
}

export function useServiceDetail(slug: string): UseServiceDetailResult {
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    async function fetchService() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/services/${slug}`)
        const json = await res.json()

        if (!res.ok) {
          throw new Error(json.error?.message || "Service not found")
        }

        setService(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [slug])

  return { service, loading, error }
}
