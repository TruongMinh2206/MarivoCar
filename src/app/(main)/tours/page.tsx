import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Tours & Experiences in Phu Quoc | MARIVO.vn",
  description:
    "Discover the best tours and experiences in Phu Quoc — from island hopping to sunset cruises.",
}

export default function ToursPage() {
  return (
    <CategoryPage
      category="tours"
      title="Tours & Experiences"
      description="Discover the best tours and experiences in Phu Quoc."
    />
  )
}
