import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Hotels & Resorts in Phu Quoc | MARIVO.vn",
  description: "Best hotels and resorts in Phu Quoc, hand-picked by locals.",
}

export default function HotelsPage() {
  return (
    <CategoryPage
      category="hotels"
      title="Hotels & Resorts"
      description="Best hotels and resorts in Phu Quoc."
    />
  )
}
