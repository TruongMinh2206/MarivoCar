import { Metadata } from "next"
import Link from "next/link"
import { Star, Clock, CalendarDays, Users, CheckCircle2, Ticket, Timer } from "lucide-react"

export const metadata: Metadata = {
  title: "Ticket Detail - MARIVO.vn",
}

const TICKET = {
  name: "VinWonders Full Day Pass",
  rating: 4.7,
  reviews: 320,
  validity: "Valid for 1 day",
  hours: "8:00 AM - 6:00 PM",
  price: "300,000đ",
  images: [
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=600&fit=crop",
  ],
  duration: "10 hours",
  ticketType: "Full Day Pass",
  desc: "Full-day access to VinWonders Phu Quoc, one of Asia's largest theme parks. Enjoy over 50 rides and attractions including roller coasters, water rides, a coral reef aquarium, and live shows.",
  highlights: ["50+ rides and attractions", "Water park access", "Live shows and performances", "Coral reef aquarium", "Kid-friendly zones", "Food court access"],
  importantInfo: ["Bring valid photo ID", "E-ticket accepted", "No outside food allowed", "Free for children under 1m height"],
}

export default function TicketDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/tickets" className="hover:text-travel-blue">Tickets</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{TICKET.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Bento Image Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={TICKET.images[0]} alt={TICKET.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" /> {TICKET.rating} ({TICKET.reviews} reviews)
              </div>
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={TICKET.images[1]} alt={`${TICKET.name} experience`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={TICKET.images[2]} alt={`${TICKET.name} attraction`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all 3 photos
              </div>
            </div>
          </div>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40">
            {[
              { icon: Timer, label: TICKET.duration, sub: "Duration" },
              { icon: Clock, label: TICKET.hours, sub: "Timings" },
              { icon: CalendarDays, label: TICKET.validity, sub: "Validity" },
              { icon: Ticket, label: TICKET.ticketType, sub: "Type" },
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

          {/* Content */}
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">{TICKET.name}</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">{TICKET.desc}</p>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Highlights</h3>
              <ul className="space-y-2">
                {TICKET.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-body-md font-body-md">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-3">Important Information</h3>
              <ul className="space-y-2 text-body-md font-body-md text-on-surface-variant">
                {TICKET.importantInfo.map((info) => (
                  <li key={info}>• {info}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <div className="text-center mb-6">
              <span className="text-label-sm font-label-sm text-on-surface-variant">Price</span>
              <div className="text-headline-lg font-headline-lg font-bold text-primary">{TICKET.price}</div>
              <span className="text-sm text-on-surface-variant">per person</span>
            </div>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Select Date</label>
                <input type="date" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" />
              </div>
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Quantity</label>
                <select className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none cursor-pointer">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n}>{n} ticket{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <Link href="/booking/30" className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
              Book Tickets
            </Link>
            <p className="text-label-sm font-label-sm text-on-surface-variant text-center mt-3">Instant confirmation via email</p>
          </div>
        </div>
      </div>
    </section>
  )
}
