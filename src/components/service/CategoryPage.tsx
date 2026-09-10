"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useServices } from "@/hooks/useServices"
import { ServiceCard } from "@/components/service/ServiceCard"
import { ServiceFilters } from "@/components/service/ServiceFilters"
import { ServiceCardSkeleton } from "@/components/ui/LoadingSkeleton"
import { NoServicesFound } from "@/components/ui/EmptyState"
import { ErrorState } from "@/components/ui/ErrorState"
import { Button } from "@/components/ui/Button"

interface CategoryPageProps {
  /** Category slug used to query /api/services */
  category: string
  /** Human-readable heading (defaults to the slug) */
  title?: string
  /** Intro paragraph under the heading */
  description?: string
}

function CategoryPageContent({
  category,
  title,
  description,
}: CategoryPageProps) {
  const {
    services,
    total,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
  } = useServices({ category, limit: 12 })

  const heading = title ?? category.replace(/-/g, " ")

  return (
    <div className="container-marivo py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-display capitalize">
          {heading}
        </h1>
        {description && <p className="mt-2 text-gray-500">{description}</p>}
        <p className="mt-2 text-sm text-gray-400">
          {total} {total === 1 ? "service" : "services"} available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <ServiceFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
            totalResults={total}
          />
        </aside>

        {/* Service Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={() => setFilters({})} />
          ) : services.length === 0 ? (
            <NoServicesFound onClear={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={filters.page === 1}
                    onClick={() => setFilters({ page: (filters.page || 1) - 1 })}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500 px-4">
                    Page {filters.page || 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(filters.page || 1) >= totalPages}
                    onClick={() => setFilters({ page: (filters.page || 1) + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container-marivo py-8">
          <div className="skeleton h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <CategoryPageContent {...props} />
    </Suspense>
  )
}
