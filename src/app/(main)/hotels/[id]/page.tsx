import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, Wifi, ArrowRight, Shield, Waves, Utensils } from "lucide-react"

export const metadata: Metadata = {
  title: "Hotel Detail - MARIVO.vn",
}

const HOTEL = {
  name: "Premier Village Phu Quoc",
  location: "Ong Lang Beach, Phu Quoc",
  rating: 4.9,
  reviews: 245,
  price: "$150",
  unit: "/night",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=600&fit=crop",
  ],
  desc: "Nestled on the pristine Ong Lang Beach, Premier Village Phu Quoc offers luxury villas with private pools, world-class dining, and a serene spa. Perfect for couples and families seeking an unforgettable island escape.",
  amenities: ["Outdoor Pool", "Spa & Wellness", "Restaurant", "Beach Access", "Free WiFi", "Free Parking", "Airport Shuttle", "Fitness Center", "Kids Club", "Concierge"],
  roomTypes: [
    { name: "Garden Villa", capacity: "2 Adults + 1 Child", price: "$150", features: ["Private Pool", "Garden View", "King Bed", "Rain Shower"] },
    { name: "Ocean Villa", capacity: "2 Adults + 2 Children", price: "$220", features: ["Private Pool", "Ocean View", "King Bed", "Bathtub"] },
    { name: "Beachfront Villa", capacity: "4 Adults", price: "$350", features: ["Private Pool", "Direct Beach Access", "King + Twin Beds", "Bathtub"] },
  ],
}

export default function HotelDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/hotels" className="hover:text-travel-blue">Hotels</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{HOTEL.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        {/* Left Column: Main Content (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Gallery (Bento Style) */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            {/* Main image - takes 3 cols x 2 rows */}
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={HOTEL.images[0]} alt={HOTEL.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" /> {HOTEL.rating} ({HOTEL.reviews} reviews)
              </div>
            </div>
            {/* Second image - top right */}
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={HOTEL.images[1]} alt={`${HOTEL.name} 2`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            {/* Third image - bottom right with "See all photos" overlay */}
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={HOTEL.images[2]} alt={`${HOTEL.name} 3`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all {HOTEL.images.length} photos
              </div>
            </div>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">{HOTEL.name}</h1>
          <p className="text-on-surface-variant flex items-center gap-1 -mt-4"><MapPin className="h-4 w-4" /> {HOTEL.location}</p>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40">
            {[
              { icon: Star, label: `${HOTEL.rating} Stars`, sub: "Star Rating" },
              { icon: Waves, label: "Outdoor Pool", sub: "Pool" },
              { icon: Wifi, label: "Free WiFi", sub: "Connectivity" },
              { icon: Utensils, label: "On-site Dining", sub: "Restaurant" },
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

          <p className="text-on-surface-variant leading-relaxed">{HOTEL.desc}</p>

          {/* Amenities */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {HOTEL.amenities.map((a) => (
                <span key={a} className="flex items-center gap-1 px-3 py-1.5 bg-surface-alt rounded-full text-sm text-on-surface-variant">
                  <Shield className="h-3.5 w-3.5 text-travel-blue" /> {a}
                </span>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden mb-8">
            <h3 className="font-headline-sm font-headline-sm text-primary p-6 border-b border-outline-variant">Available Rooms</h3>
            <div className="divide-y divide-outline-variant">
              {HOTEL.roomTypes.map((room) => (
                <div key={room.name} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-headline-sm font-headline-sm text-primary mb-1">{room.name}</h4>
                    <p className="text-body-md font-body-md text-on-surface-variant mb-2">{room.capacity}</p>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((f) => (
                        <span key={f} className="px-2 py-0.5 bg-surface-container rounded text-xs text-on-surface-variant">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right md:text-left">
                    <div className="text-body-xl font-body-xl font-bold text-primary mb-1">{room.price}<span className="text-sm font-normal text-on-surface-variant">{HOTEL.unit}</span></div>
                    <Link href={`/booking/${room.name}`} className="text-sm font-semibold text-travel-blue hover:underline flex items-center gap-1">Select <ArrowRight className="h-4 w-4" /></Link>
                  </div>
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
              <div className="text-headline-lg font-headline-lg font-bold text-primary">{HOTEL.price}</div>
              <span className="text-body-md font-body-md text-on-surface-variant">{HOTEL.unit}</span>
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-on-surface-variant">Check-in</span><span className="font-medium">3:00 PM</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Check-out</span><span className="font-medium">11:00 AM</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Free Cancellation</span><span className="font-medium text-success">Yes</span></div>
            </div>
            <Link href={`/booking/40`} className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
              Book Now
            </Link>
            <p className="text-xs text-on-surface-variant text-center mt-3">Free cancellation up to 24 hours before</p>
          </div>
        </div>
      </div>
    </section>
  )
}