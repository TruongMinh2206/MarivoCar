"use client"
import { SlidersHorizontal, X, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { cn } from "@/utils/cn"
import type { ServiceFilters as FilterType } from "@/types"

interface ServiceFiltersProps {
  filters: FilterType
  onFilterChange: (filters: Partial<FilterType>) => void
  onReset: () => void
  totalResults: number
}

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
]

const RATING_OPTIONS = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5+ Stars" },
  { value: "4", label: "4+ Stars" },
  { value: "3.5", label: "3.5+ Stars" },
  { value: "3", label: "3+ Stars" },
]

const PRICE_RANGES = [
  { value: "", label: "Any Price" },
  { value: "0-500000", label: "Under 500,000₫" },
  { value: "500000-1000000", label: "500,000 - 1,000,000₫" },
  { value: "1000000-2000000", label: "1,000,000 - 2,000,000₫" },
  { value: "2000000-999999999", label: "Over 2,000,000₫" },
]

function ServiceFilters({ filters, onFilterChange, onReset, totalResults }: ServiceFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || "")

  const handleSearch = () => {
    onFilterChange({ search: searchInput || undefined })
  }

  const handlePriceRange = (value: string) => {
    if (!value) {
      onFilterChange({ minPrice: undefined, maxPrice: undefined })
      return
    }
    const [min, max] = value.split("-").map(Number)
    onFilterChange({ minPrice: min, maxPrice: max })
  }

  const currentPriceRange =
    filters.minPrice !== undefined && filters.maxPrice !== undefined
      ? `${filters.minPrice}-${filters.maxPrice}`
      : ""

  const hasActiveFilters =
    filters.search || filters.rating || filters.minPrice || filters.maxPrice

  const filterContent = (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Search</label>
        <div className="flex gap-2">
          <Input
            placeholder="Search services..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Sort */}
      <Select
        label="Sort by"
        options={SORT_OPTIONS}
        value={filters.sort || "popular"}
        onChange={(e) => onFilterChange({ sort: e.target.value as FilterType["sort"] })}
      />

      {/* Price Range */}
      <Select
        label="Price Range"
        options={PRICE_RANGES}
        value={currentPriceRange}
        onChange={(e) => handlePriceRange(e.target.value)}
      />

      {/* Rating */}
      <Select
        label="Minimum Rating"
        options={RATING_OPTIONS}
        value={filters.rating?.toString() || ""}
        onChange={(e) =>
          onFilterChange({ rating: e.target.value ? Number(e.target.value) : undefined })
        }
      />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" className="w-full" onClick={onReset}>
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {totalResults} {totalResults === 1 ? "service" : "services"} found
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Mobile filter sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[var(--z-modal)] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-6">
              <Button className="w-full" onClick={() => setMobileOpen(false)}>
                Show {totalResults} Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          {filterContent}
        </div>
      </div>
    </>
  )
}

export { ServiceFilters }
