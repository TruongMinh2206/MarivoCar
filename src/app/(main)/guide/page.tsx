import { Metadata } from "next"
import Link from "next/link"
import { Clock, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Phu Quoc Travel Guide",
  description: "Everything you need to know about Phu Quoc. Things to do, beaches, restaurants, transport tips.",
}

const GUIDES = [
  {
    slug: "things-to-do",
    title: "Top Things to Do in Phu Quoc",
    desc: "Must-try experiences from island hopping to night market exploration.",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
  },
  {
    slug: "best-beaches",
    title: "Best Beaches in Phu Quoc",
    desc: "Discover pristine white sand beaches and crystal clear waters.",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  },
  {
    slug: "where-to-eat",
    title: "Where to Eat in Phu Quoc",
    desc: "Best seafood restaurants, local eateries, and fine dining spots.",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  },
  {
    slug: "transportation",
    title: "Getting Around Phu Quoc",
    desc: "Taxis, motorbikes, buses, and private car options explained.",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  },
  {
    slug: "travel-tips",
    title: "Essential Travel Tips",
    desc: "Weather, packing, safety, and money tips for Phu Quoc visitors.",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop",
  },
  {
    slug: "best-time-to-visit",
    title: "Best Time to Visit",
    desc: "Seasonal guide to weather, crowds, and prices throughout the year.",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
  },
]

export default function GuidePage() {
  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">Guide</li>
        </ol>
      </nav>
      <div className="mb-8">
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">Explore Phu Quoc</h1>
        <p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-2xl">
          Your complete travel guide to Phu Quoc island. Tips, recommendations, and insider knowledge.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guide/${g.slug}`} className="bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant overflow-hidden hover:shadow-hover transition-shadow group">
            <div className="h-48 relative overflow-hidden">
              <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-on-surface-variant px-2 py-1 rounded text-label-sm font-label-sm flex items-center gap-1">
                <Clock className="h-3 w-3" /> {g.readTime}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-headline-sm font-headline-sm text-on-surface mb-2 group-hover:text-travel-blue transition-colors">{g.title}</h3>
              <p className="text-body-md font-body-md text-on-surface-variant mb-3 line-clamp-2">{g.desc}</p>
              <span className="text-label-sm font-label-sm text-travel-blue flex items-center gap-1">
                Read More <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
