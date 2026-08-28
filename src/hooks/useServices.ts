"use client"
import { useState, useEffect, useCallback } from "react"
import type { ServiceListItem, ServiceFilters } from "@/types"

interface UseServicesResult {
  services: ServiceListItem[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
  filters: ServiceFilters
  setFilters: (filters: Partial<ServiceFilters>) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: ServiceFilters = {
  page: 1,
  limit: 12,
  sort: "popular",
}

export function useServices(initialFilters?: Partial<ServiceFilters>): UseServicesResult {
  const [services, setServices] = useState<ServiceListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFiltersState] = useState<ServiceFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters.category) params.set("category", filters.category)
      if (filters.search) params.set("search", filters.search)
      if (filters.minPrice) params.set("minPrice", String(filters.minPrice))
      if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice))
      if (filters.rating) params.set("rating", String(filters.rating))
      if (filters.sort) params.set("sort", filters.sort)
      if (filters.page) params.set("page", String(filters.page))
      if (filters.limit) params.set("limit", String(filters.limit))

      const res = await fetch(`/api/services?${params}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to fetch services")
      }

      setServices(json.data)
      setTotal(json.meta?.total || 0)
      setTotalPages(json.meta?.totalPages || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const setFilters = useCallback((newFilters: Partial<ServiceFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters, page: newFilters.page || 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
  }, [])

  return { services, total, totalPages, loading, error, filters, setFilters, resetFilters }
}
