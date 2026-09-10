import type { Metadata } from "next"
import { CategoryPage } from "@/components/service/CategoryPage"

export const metadata: Metadata = {
  title: "Sightseeing Tickets in Phu Quoc | MARIVO.vn",
  description:
    "Entry tickets to attractions, shows, and theme parks across Phu Quoc.",
}

export default function TicketsPage() {
  return (
    <CategoryPage
      category="tickets"
      title="Sightseeing Tickets"
      description="Entry tickets to attractions, shows, and theme parks."
    />
  )
}
