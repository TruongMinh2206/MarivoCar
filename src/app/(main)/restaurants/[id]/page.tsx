import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, Clock, Phone, Wifi, Car, Utensils, DollarSign, CalendarDays, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Restaurant Detail - MARIVO.vn",
}

const RESTAURANT = {
  name: "Crab House",
  cuisine: "Seafood",
  location: "Duong Dong, Phu Quoc",
  hours: "10:00 AM - 10:00 PM",
  phone: "+84 297 368 8888",
  rating: 4.8,
  reviews: 189,
  priceRange: "$$ - $$$",
  photos: [
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1615141982690-7f72bb1d95f6?w=600&h=600&fit=crop",
  ],
  attributes: [
    { label: "Cuisine Type", sub: "Seafood", icon: Utensils },
    { label: "Price Range", sub: "$$ - $$$", icon: DollarSign },
    { label: "Opening Hours", sub: "10:00 AM - 10:00 PM", icon: Clock },
    { label: "Location", sub: "Duong Dong, Phu Quoc", icon: MapPin },
  ],
  desc: "Crab House is a renowned seafood restaurant in Phu Quoc, famous for its fresh-from-the-ocean crab, lobster, and prawn dishes. Enjoy stunning ocean views while savoring the best seafood on the island.",
  menuHighlights: [
    { name: "Grilled Tiger Crab", price: "450,000đ", desc: "Fresh tiger crab grilled with garlic butter" },
    { name: "Lobster Sashimi", price: "380,000đ", desc: "Premium lobster served sashimi style" },
    { name: "Seafood Hotpot", price: "350,000đ", desc: "Mixed seafood in spicy lemongrass broth" },
    { name: "Grilled Prawns", price: "280,000đ", desc: "Jumbo prawns grilled with chili lime" },
  ],
}

export default function RestaurantDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/restaurants" className="hover:text-travel-blue">Restaurants</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{RESTAURANT.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Bento Image Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={RESTAURANT.photos[0]} alt={`${RESTAURANT.name} main`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={RESTAURANT.photos[1]} alt={`${RESTAURANT.name} interior`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={RESTAURANT.photos[2]} alt={`${RESTAURANT.name} dish`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all 3 photos
              </div>
            </div>
          </div>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40 mb-8">
            {RESTAURANT.attributes.map((attr) => (
              <div key={attr.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary-container">
                  <attr.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-label-md font-label-md text-on-surface">{attr.label}</div>
                  <div className="text-label-sm font-label-sm text-on-surface-variant">{attr.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-2">{RESTAURANT.name}</h1>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {RESTAURANT.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {RESTAURANT.hours}</span>
            <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {RESTAURANT.phone}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current" /> {RESTAURANT.rating} ({RESTAURANT.reviews} reviews)</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-8">{RESTAURANT.desc}</p>

          {/* Menu Highlights */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden mb-8">
            <h3 className="font-headline-sm font-headline-sm text-primary p-6 border-b border-outline-variant">Menu Highlights</h3>
            <div className="divide-y divide-outline-variant">
              {RESTAURANT.menuHighlights.map((item) => (
                <div key={item.name} className="p-6 flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-primary">{item.name}</h4>
                    <p className="text-body-md font-body-md text-on-surface-variant mt-1">{item.desc}</p>
                  </div>
                  <span className="text-sm font-bold text-primary whitespace-nowrap">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <div className="text-center mb-6">
              <span className="text-sm font-semibold text-primary">{RESTAURANT.priceRange}</span>
              <div className="text-sm text-on-surface-variant mt-1">{RESTAURANT.cuisine} • {RESTAURANT.location}</div>
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Hours</span><span className="font-medium">{RESTAURANT.hours}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Phone</span><span className="font-medium">{RESTAURANT.phone}</span></div>
              <div className="flex items-center gap-2"><Wifi className="h-4 w-4 text-travel-blue" /> <span>Free WiFi</span></div>
              <div className="flex items-center gap-2"><Car className="h-4 w-4 text-travel-blue" /> <span>Free Parking</span></div>
            </div>

            {/* Reserve a Table Form */}
            <div className="bg-surface-container rounded-xl p-5 mb-6">
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Reserve a Table</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Date</label>
                  <div className="relative">
                    <input type="date" className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Time</label>
                  <select className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select time</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Party Size</label>
                  <select className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select guests</option>
                    <option>1 person</option>
                    <option>2 people</option>
                    <option>3 people</option>
                    <option>4 people</option>
                    <option>5 people</option>
                    <option>6+ people</option>
                  </select>
                </div>
                <button type="submit" className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
                  Reserve a Table
                </button>
              </form>
            </div>

            <a href={`tel:${RESTAURANT.phone}`} className="block w-full bg-primary text-on-primary text-center py-3 rounded-lg font-bold hover:opacity-90 transition-colors shadow-ambient">
              Call to Reserve
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
