import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Private Car with Driver in Phu Quoc | MARIVO.vn",
  description:
    "Private car rental with an experienced local driver for personalized Phu Quoc travel.",
}

export default function PrivateCarPage() {
  return (
    <CategoryPage
      category="private-car"
      title="Private Car with Driver"
      description="Private car rental with driver for personalized travel around Phu Quoc."
    />
  )
}
