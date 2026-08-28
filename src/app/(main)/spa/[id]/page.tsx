import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, Clock, CheckCircle2, Sparkles, CalendarDays } from "lucide-react"

export const metadata: Metadata = {
  title: "Spa Detail - MARIVO.vn",
}

const SPA = {
  name: "Prana Spa & Wellness",
  location: "Ong Lang, Phu Quoc",
  rating: 4.9,
  reviews: 167,
  photos: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop",
  ],
  attributes: [
    { label: "Treatments Available", sub: "5 Signature Treatments", icon: Sparkles },
    { label: "Rating", sub: "4.9 / 5.0 (167 reviews)", icon: Star },
    { label: "Location", sub: "Ong Lang, Phu Quoc", icon: MapPin },
    { label: "Opening Hours", sub: "9:00 AM - 9:00 PM", icon: Clock },
  ],
  image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=1200&h=600&fit=crop",
  desc: "Prana Spa offers authentic Vietnamese wellness treatments in a tranquil tropical garden setting. Our skilled therapists use natural ingredients and traditional techniques to help you relax and rejuvenate.",
  treatments: [
    { name: "Traditional Vietnamese Massage", duration: "60 min", price: "200,000đ", desc: "Full body massage using traditional techniques to relieve tension." },
    { name: "Aromatherapy Massage", duration: "90 min", price: "350,000đ", desc: "Relaxing massage with essential oils for deep relaxation." },
    { name: "Hot Stone Therapy", duration: "75 min", price: "300,000đ", desc: "Heated basalt stones placed on key points to release tension." },
    { name: "Body Scrub & Wrap", duration: "60 min", price: "250,000đ", desc: "Exfoliating body scrub with natural ingredients followed by a nourishing wrap." },
    { name: "Facial Treatment", duration: "45 min", price: "180,000đ", desc: "Deep cleansing facial tailored to your skin type." },
  ],
}

export default function SpaDetailPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/spa" className="hover:text-travel-blue">Spa</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{SPA.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
        <div className="lg:col-span-8 space-y-8">
          {/* Bento Image Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 md:gap-4 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
            <div className="col-span-4 md:col-span-3 row-span-2 relative group cursor-pointer">
              <img src={SPA.photos[0]} alt={`${SPA.name} main`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-tr-xl">
              <img src={SPA.photos[1]} alt={`${SPA.name} treatment room`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer overflow-hidden rounded-br-xl">
              <img src={SPA.photos[2]} alt={`${SPA.name} massage`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 text-label-sm font-label-sm shadow-ambient">
                📷 See all 3 photos
              </div>
            </div>
          </div>

          {/* Attributes Bar */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-b border-outline-variant/40 mb-8">
            {SPA.attributes.map((attr) => (
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

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-2">{SPA.name}</h1>
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-on-surface-variant">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {SPA.location}</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current" /> {SPA.rating} ({SPA.reviews} reviews)</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed mb-8">{SPA.desc}</p>

          {/* Treatments */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <h3 className="font-headline-sm font-headline-sm text-primary p-6 border-b border-outline-variant">Treatments & Pricing</h3>
            <div className="divide-y divide-outline-variant">
              {SPA.treatments.map((t) => (
                <div key={t.name} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">{t.name}</h4>
                    <p className="text-body-md font-body-md text-on-surface-variant mt-1">{t.desc}</p>
                    <span className="text-label-sm font-label-sm text-on-surface-variant flex items-center gap-1 mt-1"><Clock className="h-3 w-3" /> {t.duration}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-primary whitespace-nowrap">{t.price}</span>
                    <Link href={`/booking/60`} className="bg-secondary-container text-on-secondary-fixed-variant px-4 py-2 rounded text-sm font-bold hover:bg-secondary-fixed-dim transition-colors whitespace-nowrap">
                      Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant p-6">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Why Choose Us</h3>
            <ul className="space-y-3 text-sm mb-6">
              {["Certified therapists", "Natural products", "Serene garden setting", "Flexible scheduling", "Private treatment rooms"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>

            {/* Book Treatment Form */}
            <div className="bg-surface-container rounded-xl p-5 mb-6">
              <h3 className="text-headline-sm font-headline-sm text-on-surface mb-4">Book Treatment</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Date</label>
                  <input type="date" className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Treatment</label>
                  <select className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select treatment</option>
                    {SPA.treatments.map((t) => (
                      <option key={t.name} value={t.name}>{t.name} - {t.price}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface-variant mb-1">Time</label>
                  <select className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select time</option>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                  </select>
                </div>
                <button type="submit" className="block w-full bg-secondary-container text-on-secondary-fixed-variant text-center py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient">
                  Book Treatment
                </button>
              </form>
            </div>

            <a href="tel:+842973999999" className="block w-full bg-primary text-on-primary text-center py-3 rounded-lg font-bold hover:opacity-90 transition-colors shadow-ambient">
              Call to Book
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
