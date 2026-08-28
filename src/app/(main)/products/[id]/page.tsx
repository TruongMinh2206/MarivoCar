import { Metadata } from "next"
import Link from "next/link"
import { Star, ChevronRight, Minus, Plus, ShieldCheck, Truck, RotateCcw } from "lucide-react"

export const metadata: Metadata = {
  title: "Product Detail - MARIVO.vn",
}

const PRODUCTS: any = {
  "80": {
    id: 80, name: "Phu Quoc Black Pepper", category: "Food & Spice",
    desc: "Premium whole black pepper from Phu Quoc. Grown in the rich volcanic soil of the island, our black pepper is known for its intense aroma and bold, complex flavor. Hand-harvested and sun-dried to preserve natural oils.",
    price: "150,000đ", unit: "/250g", rating: 4.8, reviews: 89,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=600&fit=crop",
    details: [
      { label: "Origin", value: "Phu Quoc Island, Vietnam" },
      { label: "Weight", value: "250g per bag" },
      { label: "Shelf Life", value: "24 months" },
      { label: "Packaging", value: "Resealable kraft bag" },
      { label: "Type", value: "Whole black pepper corns" },
    ],
    related: [
      { id: 81, name: "Phu Quoc Fish Sauce", price: "120,000đ", image: "https://images.unsplash.com/photo-1472476443508-c7a28b026518?w=300&h=200&fit=crop" },
      { id: 83, name: "Sim Wine (Berry Wine)", price: "80,000đ", image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=300&h=200&fit=crop" },
      { id: 82, name: "Phu Quoc Pearls", price: "From 500,000đ", image: "https://images.unsplash.com/photo-1515562141589-67f0d727b750?w=300&h=200&fit=crop" },
    ],
  },
}

const DEFAULT_PRODUCT = {
  id: 0, name: "Phu Quoc Product", category: "Local Product",
  desc: "Authentic local product from Phu Quoc island.",
  price: "100,000đ", unit: "/piece", rating: 4.5, reviews: 50,
  image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&h=600&fit=crop",
  details: [
    { label: "Origin", value: "Phu Quoc Island" },
    { label: "Weight", value: "250g" },
  ],
  related: [],
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = PRODUCTS[id] || DEFAULT_PRODUCT

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/products" className="hover:text-travel-blue">Products</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full lg:w-2/3">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-secondary-container text-on-secondary-fixed-variant px-3 py-1 rounded text-label-sm font-label-sm flex items-center gap-1">
              <Star className="h-4 w-4 fill-current" /> {product.rating} ({product.reviews})
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-on-surface-variant px-3 py-1 rounded text-label-sm font-label-sm">
              {product.category}
            </div>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">{product.name}</h1>
          <p className="text-on-surface-variant leading-relaxed mb-8">{product.desc}</p>

          {/* Product Details */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 mb-8">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Product Details</h3>
            <div className="space-y-3">
              {product.details.map((d: any) => (
                <div key={d.label} className="flex justify-between text-body-md font-body-md">
                  <span className="text-on-surface-variant">{d.label}</span>
                  <span className="font-medium text-on-surface">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6 sticky top-28">
            <div className="text-center mb-6">
              <span className="text-label-sm font-label-sm text-on-surface-variant">Price</span>
              <div className="text-headline-lg font-headline-lg font-bold text-primary">{product.price}</div>
              <span className="text-body-md font-body-md text-on-surface-variant">{product.unit}</span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-label-sm font-label-sm text-on-surface-variant mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button className="h-10 w-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-lg font-semibold min-w-[2rem] text-center">1</span>
                <button className="h-10 w-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button className="w-full bg-secondary-container text-on-secondary-fixed-variant py-3 rounded-lg font-bold hover:bg-secondary-fixed-dim transition-colors shadow-ambient mb-4">
              Add to Cart
            </button>

            {/* Trust signals */}
            <div className="space-y-2 text-body-md font-body-md text-on-surface-variant border-t border-outline-variant pt-4">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Authentic guaranteed</div>
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-travel-blue" /> Free shipping over 500,000đ</div>
              <div className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-travel-blue" /> 7-day return policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.related.length > 0 && (
        <div className="mt-12">
          <h3 className="font-headline-sm font-headline-sm text-primary mb-6">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.related.map((r: any) => (
              <Link key={r.id} href={`/products/${r.id}`}>
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient overflow-hidden hover:shadow-hover transition-shadow">
                  <div className="h-40 relative overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-headline-sm text-on-surface text-headline-sm mb-1">{r.name}</h4>
                    <span className="text-primary font-bold">{r.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
