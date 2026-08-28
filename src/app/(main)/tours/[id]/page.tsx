import { Metadata } from "next"
import Link from "next/link"
import { Star, Clock, Users, Check, X, Globe, Mountain } from "lucide-react"

export const metadata: Metadata = {
  title: "Tour Detail - MARIVO.vn",
}

const TOUR = {
  name: "4 Islands Snorkeling Tour",
  rating: 4.9,
  reviews: 210,
  duration: "Full Day (6 hours)",
  groupSize: "Up to 15 people",
  meetingPoint: "An Thoi Port, Phu Quoc",
  price: "350,000đ",
  images: [
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&h=400&fit=crop",
  ],
  desc: "Embark on an unforgettable island hopping adventure around the southern islands of Phu Quoc. Visit 4 stunning islands with crystal clear waters, vibrant coral reefs, and pristine beaches.",
  included: [
    "Hotel pickup and drop-off",
    "Speedboat transportation",
    "Snorkeling equipment",
    "Fresh fruit and drinks",
    "Seafood lunch on the boat",
    "English-speaking guide",
    "Insurance coverage",
  ],
  excluded: [
    "Personal expenses",
    "Tips and gratuities",
    "Additional beverages",
  ],
  schedule: [
    { time: "08:00", activity: "Hotel pickup" },
    { time: "08:30", activity: "Depart from An Thoi Port" },
    { time: "09:30", activity: "Snorkeling at May Rut Island" },
    { time: "11:00", activity: "Visit Mong Tay Island" },
    { time: "12:30", activity: "Seafood lunch on the boat" },
    { time: "14:00", activity: "Swimming at Thom Island" },
    { time: "15:30", activity: "Visit Thom Beach" },
    { time: "16:30", activity: "Return to port" },
  ],
}

export default function TourDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/tours" className="hover:text-travel-blue">Tours</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{TOUR.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        {/* Left Column: Main Content (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery (Bento Style) */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            {/* Main image - takes 3 cols x 2 rows */}
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={TOUR.images[0]} alt={TOUR.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" /> {TOUR.rating} ({TOUR.reviews} reviews)
              </div>
            </div>
            {/* Second image - top right */}
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={TOUR.images[1]} alt={`${TOUR.name} 2`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {/* Third image - bottom right with "See all photos" overlay */}
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={TOUR.images[2]} alt={`${TOUR.name} 3`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all {TOUR.images.length} photos
              </div>
            </div>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">{TOUR.name}</h1>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40">
            {[
              { icon: Clock, label: TOUR.duration, sub: "Duration" },
              { icon: Users, label: TOUR.groupSize, sub: "Group Size" },
              { icon: Globe, label: "English / Vietnamese", sub: "Language" },
              { icon: Mountain, label: "Easy - Moderate", sub: "Difficulty" },
            ].map((attr) => (
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

          <p className="text-on-surface-variant leading-relaxed">{TOUR.desc}</p>

          {/* What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-4">What&apos;s Included</h3>
              <ul className="space-y-2">
                {TOUR.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-md font-body-md">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-4">What&apos;s Not Included</h3>
              <ul className="space-y-2">
                {TOUR.excluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-body-md font-body-md">
                    <X className="h-4 w-4 text-error mt-0.5 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Schedule</h3>
            <div className="space-y-3">
              {TOUR.schedule.map((s, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm font-mono font-semibold text-travel-blue w-16">{s.time}</span>
                  <div className="h-2 w-2 rounded-full bg-travel-blue flex-shrink-0" />
                  <span className="text-body-md font-body-md text-on-surface">{s.activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget (4/12) */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <div className="text-center mb-6">
              <span className="text-label-sm font-label-sm text-on-surface-variant">From</span>
              <div className="text-headline-lg font-headline-lg font-bold text-primary">{TOUR.price}</div>
              <span className="text-body-md font-body-md text-on-surface-variant">per person</span>
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Duration</span><span className="font-medium">{TOUR.duration}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Group Size</span><span className="font-medium">{TOUR.groupSize}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Meeting Point</span><span className="font-medium">{TOUR.meetingPoint}</span></div>
            </div>
            <Link href="/booking/20" className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
              Book Now
            </Link>
            <p className="text-xs text-on-surface-variant text-center mt-3">Free cancellation up to 24 hours before</p>
          </div>
        </div>
      </div>
    </section>
  )
}
