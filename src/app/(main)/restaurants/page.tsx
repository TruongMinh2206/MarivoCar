import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Restaurants in Phu Quoc | MARIVO.vn",
  description: "Top dining experiences and local cuisine in Phu Quoc.",
}

export default function RestaurantsPage() {
  return (
    <CategoryPage
      category="restaurants"
      title="Restaurants"
      description="Top dining experiences and local cuisine."
    />
  )
}
