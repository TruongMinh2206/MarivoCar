import { Metadata } from "next"
import Link from "next/link"
import { Star, MapPin, ArrowRight, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Local Products in Phu Quoc",
  description: "Discover and shop authentic Phu Quoc local products. Pepper, fish sauce, pearls, and more.",
}

const PRODUCTS = [
  {
    id: 80, name: "Phu Quoc Black Pepper", category: "Food & Spice",
    desc: "Premium whole black pepper from Phu Quoc. Strong aroma and bold flavor, perfect for cooking.",
    price: "150,000đ", rating: 4.8, reviews: 89,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop",
  },
  {
    id: 81, name: "Phu Quoc Fish Sauce", category: "Condiment",
    desc: "Authentic Phu Quoc fish sauce (nước mắm), aged for 12+ months. Rich umami flavor.",
    price: "120,000đ", rating: 4.9, reviews: 156,
    image: "https://images.unsplash.com/photo-1472476443508-c7a28b026518?w=600&h=400&fit=crop",
  },
  {
    id: 82, name: "Phu Quoc Pearls", category: "Jewelry",
    desc: "Genuine cultured pearls from Phu Quoc pearl farms. Available in various sizes and colors.",
    price: "From 500,000đ", rating: 4.7, reviews: 67,
    image: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?w=600&h=400&fit=crop",
  },
  {
    id: 83, name: "Sim Wine (Berry Wine)", category: "Beverage",
    desc: "Traditional wine made from Phu Quoc sim berries. Sweet, tangy, and unique to the island.",
    price: "80,000đ", rating: 4.5, reviews: 112,
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=600&h=400&fit=crop",
  },
]

export default function ProductsPage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Local Products</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Local Products</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Take a piece of Phu Quoc home with you. Authentic local products and souvenirs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant overflow-hidden hover:shadow-hover transition-shadow group">
            <div className="h-48 relative overflow-hidden">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-fixed-variant px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-current" /> {p.rating}
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-on-surface-variant px-2 py-1 rounded text-label-sm font-label-sm">
                {p.category}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-headline-sm font-headline-sm text-on-surface mb-2 group-hover:text-travel-blue transition-colors">{p.name}</h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-4 line-clamp-2">{p.desc}</p>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
                <span className="text-lg font-bold text-primary">{p.price}</span>
                <button className="flex items-center gap-1 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1.5 rounded text-xs font-bold hover:bg-secondary-fixed-dim transition-colors">
                  <ShoppingBag className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
