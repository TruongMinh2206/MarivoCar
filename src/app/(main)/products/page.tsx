import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Local Products in Phu Quoc | MARIVO.vn",
  description: "Authentic Phu Quoc products — pepper, fish sauce, and souvenirs.",
}

export default function ProductsPage() {
  return (
    <CategoryPage
      category="products"
      title="Local Products"
      description="Authentic local products and souvenirs."
    />
  )
}
