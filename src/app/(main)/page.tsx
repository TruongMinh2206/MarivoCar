import Link from "next/link"
import { Metadata } from "next"
import {
  Search, Calendar, Plane, Car,
  KeyRound, Compass, Ticket, Building2, UtensilsCrossed,
  Flower2, CarFront, Handshake, CircleDollarSign, Zap, Headphones,
  Star, ChevronRight
} from "lucide-react"
import { HomeServiceList } from "@/components/home/HomeServiceList"

export const metadata: Metadata = {
  title: "MARIVO.vn - Your Phu Quoc Travel Companion",
  description:
    "Everything you need for your Phu Quoc trip — in one place. Book airport transfers, private cars, tours, hotels, tickets and more.",
}

const CATEGORIES = [
  { name: "Airport Transfer", slug: "airport-transfer", icon: Plane },
  { name: "Private Car", slug: "private-car", icon: Car },
  { name: "Rent a Car", slug: "rent-a-car", icon: KeyRound },
  { name: "Tours", slug: "tours", icon: Compass },
  { name: "Tickets", slug: "tickets", icon: Ticket },
  { name: "Hotels", slug: "hotels", icon: Building2 },
  { name: "Restaurants", slug: "restaurants", icon: UtensilsCrossed },
  { name: "Spa", slug: "spa", icon: Flower2 },
  { name: "Taxi", slug: "taxi", icon: CarFront },
]

const WHY_US = [
  {
    icon: Handshake,
    title: "Trusted Local Partner",
    desc: "Deep local knowledge and verified partners ensure a safe, authentic experience.",
  },
  {
    icon: CircleDollarSign,
    title: "Best Price Guarantee",
    desc: "Transparent pricing with no hidden fees. We match the best local rates.",
  },
  {
    icon: Zap,
    title: "Easy Booking",
    desc: "Seamless digital experience from discovery to payment to confirmation.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our concierge team is available around the clock to assist your journey.",
  },
]

// Prices are VND, aligned with the seeded services in prisma/seed.ts:
// airport-transfer-sedan (350,000₫), four-islands-tour (1,200,000₫),
// vinwonders-ticket (950,000₫), phu-quoc-spa-retreat (400,000₫).
const POPULAR_SERVICES = [
  {
    id: 1,
    category: "Transfer",
    title: "Private Airport Transfer",
    rating: 4.9,
    price: 350000,
    unit: "/trip",
    href: "/airport-transfer",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    category: "Tour",
    title: "4 Islands Snorkeling Tour",
    rating: 4.8,
    price: 1200000,
    unit: "/person",
    href: "/tours",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    category: "Ticket",
    title: "VinWonders Full Day Pass",
    rating: 4.7,
    price: 950000,
    unit: "/person",
    href: "/tickets",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    category: "Spa",
    title: "Premium Spa Package",
    rating: 4.9,
    price: 400000,
    unit: "/session",
    href: "/spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop",
  },
]

// Slugs are real seeded guide articles (prisma/seed.ts — Guide section).
const EXPLORE_GUIDES = [
  {
    title: "Top 10 Things to Do in Phu Quoc",
    desc: "Discover the best activities and attractions in Phu Quoc.",
    slug: "top-10-things-to-do",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  },
  {
    title: "Phu Quoc Food Guide: What to Eat",
    desc: "A complete guide to the best food in Phu Quoc.",
    slug: "phu-quoc-food-guide",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  },
  {
    title: "Getting Around Phu Quoc: Transportation Guide",
    desc: "Everything you need to know about getting around Phu Quoc.",
    slug: "phu-quoc-transportation-guide",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  },
]

export default function HomePage() {
  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center mb-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-5 md:px-16 max-w-[1280px] mx-auto text-white">
          <h1 className="font-display-lg text-display-lg mb-4 text-white drop-shadow-md">
            Your Phu Quoc Travel Companion
          </h1>
          <p className="text-body-lg font-body-lg text-white/90 drop-shadow max-w-2xl mx-auto">
            Everything you need for your Phu Quoc trip — in one place.
          </p>
        </div>

        {/* Search Module - positioned at bottom of hero */}
        <div className="absolute -bottom-16 left-0 right-0 px-5 md:px-16 z-50">
          <div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-xl shadow-ambient p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Service Type */}
            <div className="flex flex-col gap-2 col-span-1">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Service Type
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline" />
                <select className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none cursor-pointer">
                  <option>All Services</option>
                  <option>Airport Transfer</option>
                  <option>Private Car</option>
                  <option>Rent a Car</option>
                  <option>Tours</option>
                  <option>Tickets</option>
                  <option>Hotels</option>
                  <option>Restaurants</option>
                  <option>Spa</option>
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
              <label className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
                Date & Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline pointer-events-none" />
                <input
                  type="date"
                  placeholder="Select dates"
                  className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm text-on-surface focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <Link
              href="/airport-transfer"
              className="bg-secondary-container text-on-secondary-fixed-variant font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-secondary-fixed-dim transition-colors h-[48px] col-span-1 flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICE CATEGORY GRID ===== */}
      <section className="pt-32 pb-16 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-9 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary group-hover:bg-travel-blue group-hover:text-white transition-all shadow-ambient">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-label-sm font-label-sm text-on-surface text-center">
                  {cat.name}
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== WHY CHOOSE MARIVO ===== */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <h2 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md font-semibold text-primary mb-12 text-center">
            Why choose MARIVO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {WHY_US.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-surface-container-lowest p-8 rounded-xl shadow-ambient hover:shadow-hover transition-shadow text-center flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-[20px] font-headline-sm text-on-surface mb-3">
                    {item.title}
                  </h3>
                  <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== POPULAR SERVICES ===== */}
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md font-semibold text-on-surface">
              Popular Services
            </h2>
            <Link
              href="/airport-transfer"
              className="text-label-md font-label-md text-travel-blue hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_SERVICES.map((service) => (
              <Link
                key={service.id}
                href={service.href}
                className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant overflow-hidden hover:shadow-hover transition-shadow group"
              >
                {/* Image */}
                <div className="h-48 w-full relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url('${service.image}')` }}
                  />
                  <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {service.rating}
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <div className="text-label-sm font-label-sm text-travel-blue mb-1 uppercase tracking-wider">
                    {service.category}
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface mb-2 line-clamp-1">
                    {service.title}
                  </h3>
                  <div className="flex justify-between items-end mt-4">
                    <span className="text-xs text-on-surface-variant">From</span>
                    <span className="text-body-xl font-body-xl font-bold text-primary">
                      {service.price.toLocaleString("vi-VN")} ₫
                      <span className="text-xs text-on-surface-variant font-normal">
                        {service.unit}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECOMMENDED SERVICES (Dynamic) ===== */}
      <HomeServiceList />

      {/* ===== EXPLORE PHU QUOC ===== */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md font-semibold text-on-surface">
              Explore Phu Quoc
            </h2>
            <Link
              href="/guide"
              className="text-sm font-semibold text-travel-blue hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXPLORE_GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden hover:shadow-hover transition-shadow group"
              >
                <div className="h-48 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundImage: `url('${guide.image}')` }}
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-headline-sm font-headline-sm text-on-surface mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-body-md font-body-md text-on-surface-variant">
                    {guide.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
          <h2 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md font-bold mb-3">
            Ready to Explore Phu Quoc?
          </h2>
          <p className="text-on-primary-container max-w-lg mx-auto mb-8">
            Book your next adventure today and enjoy the best of Phu Quoc with MARIVO.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/airport-transfer"
              className="bg-secondary-container text-on-secondary-fixed-variant font-semibold py-3 px-8 rounded-lg hover:bg-secondary-fixed-dim transition-colors flex items-center gap-2"
            >
              Book Airport Transfer
            </Link>
            <Link
              href="/tours"
              className="border border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors"
            >
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
