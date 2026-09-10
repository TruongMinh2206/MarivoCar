import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Airport Transfer in Phu Quoc | MARIVO.vn",
  description:
    "Seamless, comfortable, and reliable private transfers from Phu Quoc International Airport to your destination.",
}

export default function AirportTransferPage() {
  return (
    <CategoryPage
      category="airport-transfer"
      title="Airport Transfer in Phu Quoc"
      description="Seamless, comfortable, and reliable private transfers from Phu Quoc International Airport to your destination."
    />
  )
}
