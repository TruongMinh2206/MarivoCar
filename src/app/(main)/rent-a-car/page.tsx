import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Rent a Car in Phu Quoc | MARIVO.vn",
  description:
    "Self-drive car rental for independent exploration of Phu Quoc island.",
}

export default function RentACarPage() {
  return (
    <CategoryPage
      category="rent-a-car"
      title="Rent a Car"
      description="Self-drive car rental for independent exploration."
    />
  )
}
