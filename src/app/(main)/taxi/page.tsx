"use client"
import { useState } from "react"
import Link from "next/link"
import { Phone, MapPin, Clock, CheckCircle2 } from "lucide-react"

export default function TaxiPage() {
  const [calling, setCalling] = useState(false)

  return (
    <section className="flex-grow min-h-screen">
      <section className="relative min-h-[60vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop")' }} />
        <div className="relative z-10 text-center px-5">
          <h1 className="font-display-lg text-display-lg font-bold text-white mb-4">
            Need a Taxi in Phu Quoc?
          </h1>
          <p className="text-white/80 text-body-lg font-body-lg md:text-body-xl md:font-body-xl max-w-lg mx-auto mb-10">
            Available 24/7. Reliable drivers. Transparent pricing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => { setCalling(true); setTimeout(() => setCalling(false), 3000); }}
              className="w-full sm:w-auto bg-secondary-container text-on-secondary-fixed-variant text-body-lg font-body-lg font-bold py-5 px-8 rounded-lg shadow-ambient hover:bg-secondary-fixed-dim transition-colors flex items-center gap-3"
              disabled={calling}
            >
              <Phone className="h-6 w-6" />
              {calling ? "Calling..." : "Call Taxi Now"}
            </button>
            <Link
              href="/private-car"
              className="w-full sm:w-auto border border-white text-white text-body-lg font-body-lg font-semibold py-5 px-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
            >
              <MapPin className="h-6 w-6" />
              Book a Ride
            </Link>
          </div>

          {/* Calling animation */}
          {calling && (
            <div className="mt-8 flex items-center justify-center gap-3 text-white/90">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 bg-secondary-container rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <span>Connecting you to a driver...</span>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "24/7 Availability", desc: "Taxis available around the clock, even for early morning flights." },
              { icon: CheckCircle2, title: "Verified Drivers", desc: "All drivers are licensed, background-checked, and rated." },
              { icon: MapPin, title: "Island-Wide Coverage", desc: "From the airport to remote beaches, we go everywhere." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="font-headline-sm font-headline-sm text-primary mb-2">{f.title}</h3>
                <p className="text-body-md font-body-md text-on-surface-variant">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16">
          <h2 className="font-headline-md text-headline-md font-semibold text-primary text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative text-center p-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-secondary-container text-on-secondary-fixed-variant flex items-center justify-center text-body-xl font-body-xl font-black">
                  {step}
                </div>
                <div className="pt-10">
                  {step === 1 && (
                    <>
                      <h3 className="font-headline-sm font-headline-sm text-primary mb-2">Call or Book</h3>
                      <p className="text-body-md font-body-md text-on-surface-variant">Press "Call Taxi Now" or book a private car in advance.</p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h3 className="font-headline-sm font-headline-sm text-primary mb-2">Confirm Details</h3>
                      <p className="text-body-md font-body-md text-on-surface-variant">Share your pickup location and destination with the driver.</p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h3 className="font-headline-sm font-headline-sm text-primary mb-2">Enjoy the Ride</h3>
                      <p className="text-body-md font-body-md text-on-surface-variant">Safe, comfortable transport to your destination.</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency/Contact */}
      <section className="py-16 bg-primary">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 text-center">
          <h2 className="font-headline-md text-headline-md font-bold text-white mb-4">Emergency or Need Help?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Our support team is available 24/7 to assist you.</p>
          <a href="tel:+842973999999" className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-fixed-variant font-bold py-3 px-8 rounded-lg hover:bg-secondary-fixed-dim transition-colors">
            <Phone className="h-5 w-5" />
            +84 297 399 9999
          </a>
        </div>
      </section>
    </section>
  )
}