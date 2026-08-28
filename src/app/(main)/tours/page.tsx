"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Star, Clock, Users, MapPin, ArrowRight, SlidersHorizontal, Tag, Compass } from "lucide-react"

const TOURS = [
  {
    id: 20, name: "4 Islands Snorkeling Tour", duration: "Full Day (6h)", group: "Up to 15",
    desc: "Visit 4 stunning islands with snorkeling, swimming, and seafood lunch included.",
    price: 350000, rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    type: "Beach", durationType: "Full Day", tag: "Popular",
  },
  {
    id: 21, name: "Phu Quoc City Tour", duration: "Half Day (4h)", group: "Up to 20",
    desc: "Explore pepper farms, fish sauce factories, temples, and local markets.",
    price: 250000, rating: 4.7, reviews: 156, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    type: "Cultural", durationType: "Half Day", tag: "Best Seller",
  },
  {
    id: 22, name: "Sunset Squid Fishing", duration: "Evening (3h)", group: "Up to 10",
    desc: "Traditional squid fishing experience with dinner on the boat at sunset.",
    price: 200000, rating: 4.8, reviews: 89, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    type: "Food", durationType: "Half Day", tag: "New",
  },
]

const TOUR_TYPES = ["Beach", "Adventure", "Cultural", "Food"]
const DURATIONS = ["Half Day", "Full Day", "Multi-Day"]

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export default function ToursPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Beach", "Adventure"])
  const [selectedDurations, setSelectedDurations] = useState<string[]>(["Full Day"])
  const [priceMin, setPriceMin] = useState("")
  const [priceMax, setPriceMax] = useState("")
  const [sortBy, setSortBy] = useState("Popular")

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const toggleDuration = (d: string) => {
    setSelectedDurations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  const filteredTours = useMemo(() => {
    let result = TOURS.filter((tour) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(tour.type)) return false
      if (selectedDurations.length > 0 && !selectedDurations.includes(tour.durationType)) return false
      const min = priceMin ? parseInt(priceMin.replace(/\D/g, "")) * 1000 : 0
      const max = priceMax ? parseInt(priceMax.replace(/\D/g, "")) * 1000 : Infinity
      if (tour.price < min || tour.price > max) return false
      return true
    })

    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price)
    else if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price)
    else if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating)

    return result
  }, [selectedTypes, selectedDurations, priceMin, priceMax, sortBy])

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Tours</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Tours & Experiences</h1>
        <p className="text-sm md:text-base text-on-surface-variant mt-2 max-w-2xl">
          Discover the best tours and experiences in Phu Quoc. From island hopping to sunset fishing.
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

            {/* Tour Type */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Tour Type</h4>
              <div className="space-y-3">
                {TOUR_TYPES.map((t) => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(t)}
                      onChange={() => toggleType(t)}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="mb-6 pb-6 border-b border-outline-variant">
              <h4 className="text-label-md font-label-md text-primary mb-4">Duration</h4>
              <div className="space-y-3">
                {DURATIONS.map((d) => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedDurations.includes(d)}
                      onChange={() => toggleDuration(d)}
                      className="w-4 h-4 rounded text-travel-blue focus:ring-travel-blue border-outline-variant"
                    />
                    <span className="text-sm text-on-surface group-hover:text-travel-blue transition-colors">
                      {d}
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
          </div>
        </aside>

        {/* Right Content */}
        <div className="w-full lg:w-3/4">
          {/* Sort Bar */}
          <div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-ambient mb-6">
            <span className="text-body-md font-body-md text-on-surface-variant">
              Showing {filteredTours.length} tours & experiences
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

          {/* Tour Cards */}
          <div className="space-y-6">
            {filteredTours.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="text-body-lg font-body-lg">No tours match your filters.</p>
                <button
                  onClick={() => { setSelectedTypes([]); setSelectedDurations([]); setPriceMin(""); setPriceMax("") }}
                  className="mt-4 text-travel-blue underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.id}`}
                  className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-ambient hover:shadow-hover transition-shadow duration-300 group"
                >
                  {/* Image */}
                  <div className="w-full md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1 shadow-ambient">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {tour.rating} ({tour.reviews} reviews)
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-headline-sm font-headline-sm text-primary group-hover:text-travel-blue transition-colors">
                          {tour.name}
                        </h3>
                        <span className="bg-surface-container text-travel-blue px-2 py-1 rounded text-label-sm font-label-sm whitespace-nowrap">
                          {tour.tag}
                        </span>
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant mb-4">{tour.desc}</p>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Clock className="h-4 w-4 text-outline" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Users className="h-4 w-4 text-outline" />
                          {tour.group}
                        </div>
                        <div className="flex items-center gap-2 text-on-surface text-sm font-medium">
                          <Compass className="h-4 w-4 text-outline" />
                          {tour.type}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-outline-variant">
                      <div>
                        <span className="block text-xs text-on-surface-variant">Price from</span>
                        <span className="text-lg font-bold text-primary">{formatPrice(tour.price)}</span>
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
