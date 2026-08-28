"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Star, MapPin, ArrowRight, SlidersHorizontal, Waves, Sparkles, Wifi, UtensilsCrossed } from "lucide-react"

const HOTELS = [
  {
    id: 40, name: "Premier Village Phu Quoc", location: "Ong Lang Beach",
    amenities: ["Pool", "Spa", "Restaurant", "Beach Access"], price: 150,
    unit: "/night", rating: 4.9, reviews: 245, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    stars: 5, tag: "Top Rated",
  },
  {
    id: 41, name: "The Shells Resort", location: "Ganh Dau",
    amenities: ["Pool", "Restaurant", "Ocean View"], price: 95,
    unit: "/night", rating: 4.7, reviews: 178, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
    stars: 4, tag: "Best Value",
  },
  {
    id: 42, name: "Nam Nghi Phu Quoc", location: "Long Beach",
    amenities: ["Pool", "Spa", "Restaurant", "Gym"], price: 120,
    unit: "/night", rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    stars: 4, tag: "Popular",
  },
]

const STAR_FILTERS = [5, 4, 3]
const LOCATION_FILTERS = ["Ong Lang Beach", "Long Beach", "Ganh Dau", "Duong Dong"]
const AMENITY_OPTIONS = ["Pool", "Beach", "Spa", "WiFi", "Restaurant"]

function formatPrice(p: number) {
  return "$" + p
}

export default function HotelsPage() {
  const [selectedStars, setSelectedStars] = useState<number[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Popular")

  const toggle = <T,>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]

  const filteredHotels = useMemo(() => {
    let result = HOTELS.filter((h) => {
      if (selectedStars.length > 0 && !selectedStars.includes(h.stars)) return false
      if (selectedLocations.length > 0 && !selectedLocations.includes(h.location)) return false
      if (selectedAmenities.length > 0 && !selectedAmenities.some((a) => h.amenities.includes(a))) return false
      const min = priceMin ? parseInt(priceMin.replace(/\D/g, "")) || 0 : 0
      const max = priceMax ? parseInt(priceMax.replace(/\D/g, "")) || Infinity : Infinity
      if (h.price < min || h.price > max) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedStars, selectedLocations, priceMin, priceMax, selectedAmenities, sortBy])

  const clearAll = () => {
    setSelectedStars([]); setSelectedLocations([]); setPriceMin(""); setPriceMax(""); setSelectedAmenities([])
  }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Hotels</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Hotels in Phu Quoc</h1>
        <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl">Find the best hotels and resorts for your Phu Quoc stay.</p>
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

            {/* Star Rating */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Star Rating</h4>
              <div className="space-y-3">
                {STAR_FILTERS.map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(s)}
                      onChange={() => setSelectedStars((prev) => toggle(prev, s))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="flex items-center gap-1 text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {Array.from({ length: s }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-secondary-container text-secondary-container" />
                      ))}
                      <span className="ml-1">{s} Stars</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Location</h4>
              <div className="space-y-3">
                {LOCATION_FILTERS.map((loc) => (
                  <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(loc)}
                      onChange={() => setSelectedLocations((prev) => toggle(prev, loc))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {loc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Price Range (USD)</h4>
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

            {/* Amenities */}
            <div>
              <h4 className="text-label-md font-label-md text-primary mb-4">Amenities</h4>
              <div className="space-y-3">
                {AMENITY_OPTIONS.map((a) => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a)}
                      onChange={() => setSelectedAmenities((prev) => toggle(prev, a))}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="flex items-center gap-2 text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {a === "Pool" && <Waves className="h-4 w-4 text-outline" />}
                      {a === "Beach" && <Waves className="h-4 w-4 text-outline" />}
                      {a === "Spa" && <Sparkles className="h-4 w-4 text-outline" />}
                      {a === "WiFi" && <Wifi className="h-4 w-4 text-outline" />}
                      {a === "Restaurant" && <UtensilsCrossed className="h-4 w-4 text-outline" />}
                      {a}
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
              Showing {filteredHotels.length} hotels
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

          {/* Hotel Cards */}
          <div className="space-y-6">
            {filteredHotels.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No hotels match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-travel-blue underline text-sm">
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredHotels.map((h) => (
                <Link
                  key={h.id}
                  href={`/hotels/${h.id}`}
                  className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                      src={h.image}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-ambient">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {h.rating} ({h.reviews} reviews)
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">
                          {h.name}
                        </h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap">
                          {h.tag}
                        </span>
                      </div>
                      <p className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1 mb-3">
                        <MapPin className="h-3.5 w-3.5" /> {h.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {h.amenities.map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-surface-container rounded text-xs text-on-surface-variant">{a}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(h.price)}</span>
                        <span className="text-xs text-on-surface-variant">{h.unit}</span>
                      </div>
                      <span className="bg-secondary-container text-on-secondary-fixed-variant px-6 py-3 rounded text-sm font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient flex items-center gap-2">
                        Book Now <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
