import { Metadata } from "next"
import Link from "next/link"
import { Clock, ChevronRight, ArrowRight } from "lucide-react"

const ARTICLES: any = {
  "best-beaches": {
    title: "Best Beaches in Phu Quoc",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop",
    content: [
      "Phu Quoc is home to some of the most stunning beaches in Southeast Asia. From quiet, secluded coves to vibrant stretches of sand lined with restaurants and bars, there is a beach for every type of traveler.",
      "Long Beach (Bãi Trường) is the most popular beach on the island, stretching over 20 kilometers along the west coast. It is perfect for watching sunsets and offers a wide range of dining and accommodation options.",
      "Ong Lang Beach is a quieter alternative with crystal-clear water and a more relaxed atmosphere. It is ideal for families and couples looking for a peaceful retreat.",
      "Bai Sao (Star Beach) is known for its powder-white sand and turquoise waters. It is one of the most photographed beaches on the island.",
      "Ganh Dau Beach in the northwest offers a more off-the-beaten-path experience with fishing villages and local charm.",
    ],
    relatedServices: [
      { title: "Book Airport Transfer", link: "/airport-transfer" },
      { title: "Private Car Day Tour", link: "/private-car" },
      { title: "4 Islands Tour", link: "/tours" },
    ],
  },
  "things-to-do": {
    title: "Top Things to Do in Phu Quoc",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&h=600&fit=crop",
    content: [
      "Phu Quoc offers an incredible range of activities for every type of traveler. From adventure sports to cultural experiences, there is never a dull moment on this beautiful island.",
      "Snorkeling and diving are among the most popular activities, with crystal-clear waters and vibrant coral reefs around the southern islands.",
      "Visit the Phu Quoc Night Market in Duong Dong for local street food, souvenirs, and a lively atmosphere.",
      "Take a cable car ride to Hon Thom Island for panoramic views and access to a water park.",
      "Explore the pepper farms and fish sauce factories to learn about local production methods.",
    ],
    relatedServices: [
      { title: "Book a Tour", link: "/tours" },
      { title: "Rent a Car", link: "/rent-a-car" },
      { title: "Buy Tickets", link: "/tickets" },
    ],
  },
  "where-to-eat": {
    title: "Where to Eat in Phu Quoc",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop",
    content: [
      "Phu Quoc is a food lover's paradise, especially for seafood. The island's restaurants offer everything from casual beachside dining to fine international cuisine.",
      "The Phu Quoc Night Market is a must-visit for trying local specialties like grilled sea urchin, bun quay (hand-rolled vermicelli), and fresh seafood BBQ.",
      "Crab House and The Pepper Tree are popular choices for a more upscale dining experience.",
      "For authentic Vietnamese cuisine, head to local eateries along Duong Dong town where you can enjoy pho, banh mi, and fresh spring rolls.",
    ],
    relatedServices: [
      { title: "Browse Restaurants", link: "/restaurants" },
      { title: "Book a Tour", link: "/tours" },
    ],
  },
}

// Default fallback for unknown slugs
const DEFAULT_ARTICLE = {
  title: "Phu Quoc Guide",
  readTime: "5 min read",
  image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop",
  content: [
    "Phu Quoc is Vietnam's largest island, known for its pristine beaches, lush forests, and incredible seafood. Located in the Gulf of Thailand, it has become one of Southeast Asia's top travel destinations.",
    "Whether you are looking for adventure, relaxation, or cultural experiences, Phu Quoc has something for everyone.",
  ],
  relatedServices: [
    { title: "Book Airport Transfer", link: "/airport-transfer" },
    { title: "Explore Tours", link: "/tours" },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES[slug] || DEFAULT_ARTICLE
  return { title: `${article.title} | MARIVO.vn` }
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = ARTICLES[slug] || DEFAULT_ARTICLE

  return (
    <section className="flex-grow w-full max-w-[1280px] mx-auto px-5 md:px-16 py-8">
      <nav aria-label="Breadcrumb" className="flex text-xs text-on-surface-variant mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li><Link href="/" className="hover:text-travel-blue">Home</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li><Link href="/guide" className="hover:text-travel-blue">Guide</Link></li>
          <li><span className="mx-2 text-outline-variant">/</span></li>
          <li className="text-primary font-bold">{article.title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="w-full lg:w-2/3">
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-1 text-body-md font-body-md text-on-surface-variant mb-8">
            <Clock className="h-4 w-4" /> {article.readTime}
          </div>

          <div className="space-y-6">
            {article.content.map((paragraph: string, i: number) => (
              <p key={i} className="text-on-surface-variant leading-relaxed text-body-md font-body-md">{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-ambient p-6 sticky top-28">
            <h3 className="font-headline-sm font-headline-sm text-primary mb-4">Related Services</h3>
            <div className="space-y-3">
              {article.relatedServices.map((service: { title: string; link: string }) => (
                <Link
                  key={service.title}
                  href={service.link}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors group"
                >
                  <span className="text-label-sm font-label-sm text-on-surface group-hover:text-travel-blue transition-colors">{service.title}</span>
                  <ArrowRight className="h-4 w-4 text-outline group-hover:text-travel-blue transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
