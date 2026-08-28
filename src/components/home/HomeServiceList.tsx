"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ServiceCard } from "@/components/service/ServiceCard"
import { ServiceCardSkeleton } from "@/components/ui/LoadingSkeleton"
import type { ServiceListItem } from "@/types"

export function HomeServiceList() {
  const [services, setServices] = useState<ServiceListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/services?featured=true&limit=8&sort=popular")
        const json = await res.json()
        setServices(json.data || [])
      } catch {
        // Silently fail — section just won't show
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container-marivo">
          <h2 className="text-3xl font-bold text-gray-900 font-display mb-8">
            Popular Services
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-marivo">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-display">
              Popular Services
            </h2>
            <p className="mt-1 text-gray-500">
              Top-rated services loved by travelers
            </p>
          </div>
          <Link
            href="/airport-transfer"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-marivo-600 hover:text-marivo-700"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/airport-transfer"
            className="inline-flex items-center gap-1 text-sm font-medium text-marivo-600"
          >
            View All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
