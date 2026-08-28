"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search, SlidersHorizontal, Star, Users, Luggage, Airplay,
  Wifi, ArrowRight, ChevronRight
} from "lucide-react"

const SERVICES = [
  {
    id: 1,
    name: "Private Airport Transfer 7 Seats",
    desc: "Comfortable SUV transfer for small groups or families with moderate luggage. Professional driver included.",
    seats: 7,
    luggage: 5,
    features: ["Air Conditioned", "Professional Driver"],
    price: 350000,
    rating: 4.9,
    reviews: 120,
    badge: "Instant Confirmation",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
    vehicleType: "7 Seats",
  },
  {
    id: 2,
    name: "Standard Airport Transfer 4 Seats",
    desc: "Economical and private ride perfect for couples or solo travelers arriving in Phu Quoc.",
    seats: 4,
    luggage: 3,
    features: ["Free WiFi", "Air Conditioned"],
    price: 250000,
    rating: 4.8,
    reviews: 85,
    badge: "Free Cancellation",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=400&fit=crop",
    vehicleType: "4 Seats",
  },
  {
    id: 3,
    name: "Group Airport Transfer 16 Seats",
    desc: "Spacious van perfect for large groups, families, or travelers with heavy luggage.",
    seats: 16,
    luggage: 10,
    features: ["Air Conditioned", "Large Luggage Space"],
    price: 650000,
    rating: 4.7,
    reviews: 42,
    badge: "Best for Groups",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
    vehicleType: "16 Seats",
  },
]

const VEHICLE_TYPES = ["4 Seats", "7 Seats", "16 Seats"]
const RATING_OPTIONS = [
  { label: "4.5+", min: 4.5 },
  { label: "4.0+", min: 4.0 },
]

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function AirportTransferPage() {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(["4 Seats", "7 Seats"])
  const [selectedRating, setSelectedRating] = useState<number | null>(4.5)
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sortBy, setSortBy] = useState("Popular")

  const toggleVehicle = (v: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  const filteredServices = useMemo(() => {
    let result = SERVICES.filter((s) => {
      if (selectedVehicles.length > 0 && !selectedVehicles.includes(s.vehicleType)) return false
      if (selectedRating !== null && s.rating < selectedRating) return false
      const min = priceMin ? parseInt(priceMin.replace(/\D/g, "")) * 1000 : 0
      const max = priceMax ? parseInt(priceMax.replace(/\D/g, "")) * 1000 : Infinity
      if (s.price < min || s.price > max) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedVehicles, selectedRating, priceMin, priceMax, sortBy])

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue cursor-pointer">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Airport Transfer</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">
          Airport Transfer in Phu Quoc
        </h1>
        <p className="text-body-md md:text-base font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Seamless, comfortable, and reliable private transfers from Phu Quoc International Airport to your destination.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar (Filters) */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-ambient sticky top-28">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-6 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </h3>

            {/* Vehicle Type */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Vehicle Type</h4>
              <div className="space-y-3">
                {VEHICLE_TYPES.map((v) => (
                  <label key={v} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(v)}
                      onChange={() => toggleVehicle(v)}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {v}
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
                  placeholder="Min"
                  className="flex-1 bg-surface-container border border-outline-variant rounded py-2 px-3 text-sm text-center focus:ring-2 focus:ring-travel-blue focus:border-travel-blue outline-none"
                />
                <span className="text-outline-variant">-</span>
                <input
                  type="text"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="flex-1 bg-surface-container border border-outline-variant rounded py-2 px-3 text-sm text-center focus:ring-2 focus:ring-travel-blue focus:border-travel-blue outline-none"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="text-label-md font-label-md text-primary mb-4">Rating</h4>
              <div className="space-y-3">
                {RATING_OPTIONS.map((r) => (
                  <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === r.min}
                      onChange={() => setSelectedRating(r.min)}
                      className="w-4 h-4 text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="flex items-center gap-1 text-sm text-on-surface">
                      {Array.from({ length: Math.floor(r.min) }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-secondary-container text-secondary-container" />
                      ))}
                      {r.min % 1 !== 0 && (
                        <Star className="h-4 w-4 fill-secondary-container text-secondary-container" />
                      )}
                      <span className="ml-1">{r.label}</span>
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
              Showing {filteredServices.length} available transfers
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

          {/* Service Cards */}
          <div className="space-y-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No transfers match your filters.</p>
                <button
                  onClick={() => { setSelectedVehicles([]); setSelectedRating(null); setPriceMin(""); setPriceMax("") }}
                  className="mt-4 text-travel-blue underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-ambient">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {service.rating} ({service.reviews} reviews)
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">
                          {service.name}
                        </h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap">
                          {service.badge}
                        </span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant mb-4">{service.desc}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Users className="h-4 w-4 text-outline" />
                          {service.seats} Seats Max
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Luggage className="h-4 w-4 text-outline" />
                          {service.luggage} Standard Bags
                        </div>
                        {service.features.includes("Air Conditioned") && (
                          <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                            <Airplay className="h-4 w-4 text-outline" />
                            Air Conditioned
                          </div>
                        )}
                        {service.features.includes("Free WiFi") && (
                          <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                            <Wifi className="h-4 w-4 text-outline" />
                            Free WiFi
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(service.price)}</span>
                      </div>
                      <Link
                        href={`/booking/${service.id}`}
                        className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded text-sm font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient flex items-center gap-2"
                      >
                        Book Now <ArrowRight className="h-4 w-4" />
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
