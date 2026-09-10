import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Spa & Wellness in Phu Quoc | MARIVO.vn",
  description: "Relax and rejuvenate at the best spas in Phu Quoc.",
}

export default function SpaPage() {
  return (
    <CategoryPage
      category="spa"
      title="Spa & Wellness"
      description="Relax and rejuvenate at the best spas."
    />
  )
}
