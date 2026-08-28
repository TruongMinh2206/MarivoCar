"use client"
import { useState } from "react"
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+84 297 399 9999", href: "tel:+842973999999" },
  { icon: Mail, label: "Email", value: "info@marivo.vn", href: "mailto:info@marivo.vn" },
  { icon: MessageCircle, label: "WhatsApp", value: "+84 912 345 678", href: "https://wa.me/84912345678" },
  { icon: MapPin, label: "Location", value: "Phu Quoc, Kien Giang, Vietnam", href: null },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1500)
  }

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Contact Us</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Have a question or need help with your booking? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          {CONTACT_INFO.map((c) => (
            <div key={c.label} className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-primary mb-1">{c.label}</h3>
                {c.href ? (
                  <a href={c.href} className="text-body-md font-body-md text-travel-blue hover:underline">{c.value}</a>
                ) : (
                  <p className="text-body-md font-body-md text-on-surface-variant">{c.value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="p-4 bg-surface-container-low rounded-xl">
            <h3 className="text-headline-sm font-headline-sm text-primary mb-2">Business Hours</h3>
            <div className="space-y-1 text-body-md font-body-md text-on-surface-variant">
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="text-travel-blue font-semibold mt-2">Emergency support: 24/7</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                <h2 className="font-headline-sm text-headline-sm font-bold text-primary mb-2">Message Sent!</h2>
                <p className="text-body-md font-body-md text-on-surface-variant mb-6">We will get back to you within 24 hours.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Full Name *</label>
                    <input type="text" required className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Email *</label>
                    <input type="email" required className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Phone</label>
                    <input type="tel" className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none" placeholder="+84..." />
                  </div>
                  <div>
                    <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Subject *</label>
                    <select required className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none appearance-none cursor-pointer">
                      <option value="">Select a topic</option>
                      <option>Booking Question</option>
                      <option>Payment Issue</option>
                      <option>Refund Request</option>
                      <option>Partnership Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Message *</label>
                  <textarea required rows={5} className="w-full px-4 py-3 bg-surface-alt border border-outline-variant rounded-lg text-sm focus:border-travel-blue focus:ring-1 focus:ring-travel-blue outline-none resize-none" placeholder="Tell us how we can help..." />
                </div>
                <Button type="submit" variant="cta" size="lg" disabled={loading} className="w-full md:w-auto">
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <Send className="h-4 w-4 ml-2" />}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}