"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Star, Users, Luggage, Airplay, ArrowRight, SlidersHorizontal } from "lucide-react"

const SERVICES = [
  {
    id: 10,
    name: "Private Car 4 Seats - City Tour",
    desc: "Explore Phu Quoc at your own pace with a private sedan and experienced local driver.",
    seats: 4, luggage: 3, price: 250000, rating: 4.9, reviews: 98, vehicleType: "4 Seats (Sedan)",
    badge: "Most Popular",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=400&fit=crop",
  },
  {
    id: 11,
    name: "Private Car 7 Seats - Full Day",
    desc: "Full-day private SUV rental with driver. Perfect for families exploring multiple attractions.",
    seats: 7, luggage: 5, price: 350000, rating: 4.8, reviews: 76, vehicleType: "7 Seats (SUV/MPV)",
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  },
  {
    id: 12,
    name: "Private Car 16 Seats - Group",
    desc: "Spacious van for large groups with dedicated driver. Ideal for team outings and family reunions.",
    seats: 16, luggage: 10, price: 650000, rating: 4.7, reviews: 34, vehicleType: "16 Seats (Van)",
    badge: "Group Friendly",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
  },
]

const VEHICLE_TYPES = ["4 Seats (Sedan)", "7 Seats (SUV/MPV)", "16 Seats (Van)"]
const RATING_OPTIONS = [4.5, 4.0]

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function PrivateCarPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [minRating, setMinRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("Popular")

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const filtered = useMemo(() => {
    let result = SERVICES.filter((s) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(s.vehicleType)) return false
      if (minRating !== null && s.rating < minRating) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedTypes, minRating, sortBy])

  const clearAll = () => { setSelectedTypes([]); setMinRating(null) }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Private Car</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Private Car in Phu Quoc</h1>
        <p className="text-body-md md:text-base font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Hire a private car with an experienced local driver. Flexible itineraries and comfortable vehicles for your Phu Quoc adventure.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-ambient sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline-sm font-headline-sm text-primary flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" /> Filters
              </h3>
              <button onClick={clearAll} className="text-xs text-travel-blue hover:underline">Clear all</button>
            </div>
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Vehicle Type</h4>
              <div className="space-y-3">
                {VEHICLE_TYPES.map((f) => (
                  <label key={f} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(f)}
                      onChange={() => setSelectedTypes((prev) => toggle(prev, f))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-label-md font-label-md text-primary mb-4">Rating</h4>
              <div className="space-y-3">
                {RATING_OPTIONS.map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="w-4 h-4 text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="flex items-center gap-1 text-sm">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className={`h-4 w-4 ${si < Math.floor(r) ? "fill-secondary-container text-secondary-container" : "text-outline-variant"}`} />
                      ))}
                      <span className="ml-1">{r}+</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Listings */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-ambient mb-6">
            <span className="text-body-md font-body-md text-on-surface-variant">Showing {filtered.length} services</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container border-none text-sm rounded py-2 pl-3 pr-8 focus:ring-2 focus:ring-travel-blue outline-none cursor-pointer"
            >
              <option>Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>
          </div>

          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No services match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-travel-blue underline text-sm">Clear all filters</button>
              </div>
            ) : (
              filtered.map((s) => (
                <div key={s.id} className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow group">
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-ambient">
                      <Star className="h-3.5 w-3.5 fill-current" /> {s.rating} ({s.reviews})
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">{s.name}</h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap">{s.badge}</span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant mb-4">{s.desc}</p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-outline" /> {s.seats} Seats</div>
                        <div className="flex items-center gap-2 text-sm font-medium"><Luggage className="h-4 w-4 text-outline" /> {s.luggage} Bags</div>
                        <div className="flex items-center gap-2 text-sm font-medium"><Airplay className="h-4 w-4 text-outline" /> Air Conditioned</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(s.price)}</span>
                      </div>
                      <Link href={`/booking/${s.id}`} className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded text-sm font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient flex items-center gap-2">
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
