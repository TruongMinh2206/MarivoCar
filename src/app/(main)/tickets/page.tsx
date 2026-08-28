"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  SlidersHorizontal, Star, Clock, MapPin, ArrowRight
} from "lucide-react"

const TICKETS = [
  {
    id: 30, name: "VinWonders Full Day Pass", validity: "Valid for 1 day", category: "Theme Park", duration: "Full Day",
    hours: "8:00 AM - 6:00 PM", desc: "Full access to VinWonders theme park with rides, shows, and attractions.",
    price: 300000, rating: 4.7, reviews: 320, image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop",
  },
  {
    id: 31, name: "VinWonders + Safari Combo", validity: "Valid for 2 days", category: "Theme Park", duration: "Multi-Day",
    hours: "8:00 AM - 5:00 PM", desc: "Combo ticket for VinWonders and VinSafari. Best value for families.",
    price: 450000, rating: 4.8, reviews: 198, image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop",
  },
  {
    id: 32, name: "Cable Car Round Trip", validity: "Valid for 1 day", category: "Nature", duration: "Half Day",
    hours: "7:30 AM - 5:00 PM", desc: "Scenic cable car ride to Hon Thom island with stunning ocean views.",
    price: 200000, rating: 4.6, reviews: 145, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  },
]

const CATEGORY_OPTIONS = ["Theme Park", "Show", "Nature", "Activity"]
const DURATION_OPTIONS = ["Half Day", "Full Day", "Multi-Day"]

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function TicketsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Popular")

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const filtered = useMemo(() => {
    let result = TICKETS.filter((t) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false
      if (selectedDurations.length > 0 && !selectedDurations.includes(t.duration)) return false
      const min = priceMin ? parseInt(priceMin.replace(/\D/g, "")) * 1000 || 0 : 0
      const max = priceMax ? parseInt(priceMax.replace(/\D/g, "")) * 1000 || Infinity : Infinity
      if (t.price < min || t.price > max) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedCategories, priceMin, priceMax, selectedDurations, sortBy])

  const clearAll = () => { setSelectedCategories([]); setPriceMin(""); setPriceMax(""); setSelectedDurations([]) }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue cursor-pointer">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Tickets</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">
          Sightseeing Tickets
        </h1>
        <p className="text-body-md md:text-base font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Buy tickets for attractions, theme parks, and shows in Phu Quoc.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar (Filters) */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-ambient sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm font-headline-sm text-primary flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h3>
              <button onClick={clearAll} className="text-xs text-travel-blue hover:underline">Clear all</button>
            </div>

            {/* Category */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Category</h4>
              <div className="space-y-3">
                {CATEGORY_OPTIONS.map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(label)}
                      onChange={() => setSelectedCategories((prev) => toggle(prev, label))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Price Range (VND)</h4>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min (k)"
                  className="flex-1 bg-surface-container border border-outline-variant rounded py-2 px-3 text-sm text-center focus:ring-2 focus:ring-travel-blue focus:border-travel-blue outline-none"
                />
                <span className="text-outline-variant">-</span>
                <input
                  type="text"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max (k)"
                  className="flex-1 bg-surface-container border border-outline-variant rounded py-2 px-3 text-sm text-center focus:ring-2 focus:ring-travel-blue focus:border-travel-blue outline-none"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <h4 className="text-label-md font-label-md text-primary mb-4">Duration</h4>
              <div className="space-y-3">
                {DURATION_OPTIONS.map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(label)}
                      onChange={() => setSelectedDurations((prev) => toggle(prev, label))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="w-full lg:w-3/4">
          {/* Sort Bar */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-ambient mb-6">
            <span className="text-body-md font-body-md text-on-surface-variant">
              Showing {filtered.length} available tickets
            </span>
            <div className="flex items-center gap-4">
              <span className="text-label-md font-label-md text-primary hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-container border-none text-sm rounded py-2 pl-3 pr-8 focus:ring-2 focus:ring-travel-blue cursor-pointer outline-none"
              >
                <option>Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Top Rated</option>
              </select>
            </div>
          </div>

          {/* Ticket Cards */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No tickets match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-travel-blue underline text-sm">Clear all filters</button>
              </div>
            ) : (
              filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-ambient">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {t.rating} ({t.reviews})
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">
                          {t.name}
                        </h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap">
                          {t.validity}
                        </span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant mb-4">{t.desc}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Clock className="h-4 w-4 text-outline" />
                          {t.hours}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <MapPin className="h-4 w-4 text-outline" />
                          Phu Quoc
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-headline-sm font-headline-sm font-bold text-primary">{formatPrice(t.price)}</span>
                        <span className="text-label-sm font-label-sm text-on-surface-variant">/person</span>
                      </div>
                      <Link
                        href={`/tickets/${t.id}`}
                        className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded text-label-md font-label-md font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient flex items-center gap-2"
                      >
                        Book <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
