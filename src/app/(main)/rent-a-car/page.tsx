"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  SlidersHorizontal, Star, Users, Fuel, Settings, ArrowRight
} from "lucide-react"

const VEHICLES = [
  {
    id: 70, name: "Toyota Vios", type: "Sedan", seats: 4, transmission: "Automatic",
    fuel: "Gasoline", price: 500000, unit: "/day", rating: 4.7, reviews: 89,
    desc: "Compact sedan perfect for city driving and exploring Phu Quoc's coastal roads.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=400&fit=crop",
  },
  {
    id: 71, name: "Toyota Innova", type: "MPV", seats: 7, transmission: "Automatic",
    fuel: "Gasoline", price: 800000, unit: "/day", rating: 4.8, reviews: 67,
    desc: "Spacious MPV ideal for families and groups with ample luggage space.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  },
  {
    id: 72, name: "Honda CR-V", type: "SUV", seats: 5, transmission: "Automatic",
    fuel: "Gasoline", price: 900000, unit: "/day", rating: 4.9, reviews: 54,
    desc: "Versatile SUV for both city and off-road adventures on the island.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
  },
]

const TYPE_OPTIONS = ["Sedan", "SUV", "MPV", "Van"]
const TRANSMISSION_OPTIONS = ["Automatic", "Manual"]

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function RentACarPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedTrans, setSelectedTrans] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sortBy, setSortBy] = useState("Popular")

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const filtered = useMemo(() => {
    let result = VEHICLES.filter((v) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(v.type)) return false
      if (selectedTrans.length > 0 && !selectedTrans.includes(v.transmission)) return false
      const min = priceMin ? parseInt(priceMin.replace(/\D/g, "")) * 1000 || 0 : 0
      const max = priceMax ? parseInt(priceMax.replace(/\D/g, "")) * 1000 || Infinity : Infinity
      if (v.price < min || v.price > max) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedTypes, selectedTrans, priceMin, priceMax, sortBy])

  const clearAll = () => { setSelectedTypes([]); setSelectedTrans([]); setPriceMin(""); setPriceMax("") }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue cursor-pointer">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Rent a Car</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">
          Rent a Car in Phu Quoc
        </h1>
        <p className="text-body-md md:text-base font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Self-drive car rental for flexible island exploration.
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

            {/* Vehicle Type */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Vehicle Type</h4>
              <div className="space-y-3">
                {TYPE_OPTIONS.map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(label)}
                      onChange={() => setSelectedTypes((prev) => toggle(prev, label))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Transmission</h4>
              <div className="space-y-3">
                {TRANSMISSION_OPTIONS.map((label) => (
                  <label key={label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTrans.includes(label)}
                      onChange={() => setSelectedTrans((prev) => toggle(prev, label))}
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
            <div>
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
                  placeholder="Max (M)"
                  className="flex-1 bg-surface-container border border-outline-variant rounded py-2 px-3 text-sm text-center focus:ring-2 focus:ring-travel-blue focus:border-travel-blue outline-none"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="w-full lg:w-3/4">
          {/* Sort Bar */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-ambient mb-6">
            <span className="text-body-md font-body-md text-on-surface-variant">
              Showing {filtered.length} available vehicles
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

          {/* Vehicle Cards */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No vehicles match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-travel-blue underline text-sm">Clear all filters</button>
              </div>
            ) : (
              filtered.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-primary-container text-white px-2 py-1 rounded text-label-sm font-label-sm shadow-ambient">
                      {v.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">
                          {v.name}
                        </h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {v.rating} ({v.reviews})
                        </span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant mb-4">{v.desc}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Users className="h-4 w-4 text-outline" />
                          {v.seats} Seats
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Settings className="h-4 w-4 text-outline" />
                          {v.transmission}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Fuel className="h-4 w-4 text-outline" />
                          {v.fuel}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-headline-sm font-headline-sm font-bold text-primary">{formatPrice(v.price)}</span>
                        <span className="text-label-sm font-label-sm text-on-surface-variant">{v.unit}</span>
                      </div>
                      <Link
                        href={`/rent-a-car/${v.id}`}
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
