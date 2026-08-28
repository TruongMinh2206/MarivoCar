import { Metadata } from "next"
import Link from "next/link"
import { Star, Users, Fuel, Settings, Shield, CheckCircle2, Luggage, Thermometer } from "lucide-react"

export const metadata: Metadata = {
  title: "Rent a Car Detail - MARIVO.vn",
}

const VEHICLE = {
  name: "Honda CR-V",
  type: "SUV",
  seats: 5,
  transmission: "Automatic",
  fuel: "Gasoline",
  year: 2024,
  price: "900,000đ",
  unit: "/day",
  rating: 4.9,
  reviews: 54,
  images: [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=600&fit=crop",
  ],
  desc: "The Honda CR-V offers the perfect blend of comfort, space, and performance for exploring Phu Quoc. With its spacious interior and smooth ride, it is ideal for families and small groups.",
  features: ["Bluetooth Audio", "Reverse Camera", "Cruise Control", "Dual Zone AC", "USB Charging", "GPS Navigation"],
  policy: ["Valid driver's license required", "Minimum age: 21 years", "Fuel: Full to Full policy", "Insurance included", "24/7 roadside assistance", "Unlimited mileage"],
}

export default function RentCarDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/rent-a-car" className="hover:text-travel-blue">Rent a Car</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{VEHICLE.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Bento Image Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden">
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={VEHICLE.images[0]} alt={VEHICLE.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Star className="h-4 w-4 fill-current" /> {VEHICLE.rating} ({VEHICLE.reviews} reviews)
              </div>
              <div className="absolute top-4 right-4 bg-primary-container text-white px-3 py-1 rounded text-sm font-semibold">{VEHICLE.type}</div>
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={VEHICLE.images[1]} alt={`${VEHICLE.name} interior`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={VEHICLE.images[2]} alt={`${VEHICLE.name} rear`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all 3 photos
              </div>
            </div>
          </div>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40">
            {[
              { icon: Users, label: `${VEHICLE.seats} Passengers`, sub: "Seating capacity" },
              { icon: Luggage, label: "3 Bags", sub: "Trunk space" },
              { icon: Thermometer, label: "Air Conditioned", sub: "Climate control" },
              { icon: Fuel, label: VEHICLE.transmission, sub: "Transmission" },
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
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">{VEHICLE.name}</h1>
            <p className="text-on-surface-variant leading-relaxed mb-8">{VEHICLE.desc}</p>

            {/* Features */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {VEHICLE.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-body-md font-body-md">
                    <CheckCircle2 className="h-4 w-4 text-travel-blue" /> {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Policy */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Rental Policy</h3>
              <ul className="space-y-2 text-body-md font-body-md text-on-surface-variant">
                {VEHICLE.policy.map((p) => (
                  <li key={p} className="flex items-start gap-2"><Shield className="h-4 w-4 text-travel-blue mt-0.5 flex-shrink-0" /> {p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <div className="text-center mb-6">
              <span className="text-label-sm font-label-sm text-on-surface-variant">From</span>
              <div className="text-headline-lg font-headline-lg font-bold text-primary">{VEHICLE.price}</div>
              <span className="text-sm text-on-surface-variant">{VEHICLE.unit}</span>
            </div>
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Pick-up Date</label>
                <input type="date" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" />
              </div>
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Return Date</label>
                <input type="date" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" />
              </div>
              <div>
                <label className="text-label-sm font-label-sm text-on-surface-variant mb-1 block">Pick-up Location</label>
                <select className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none cursor-pointer">
                  <option>Airport</option>
                  <option>Duong Dong Town</option>
                  <option>Your Hotel</option>
                </select>
              </div>
            </div>
            <Link href="/booking/72" className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
              Book Vehicle
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
