import { ServiceCard } from "./ServiceCard"
import type { ServiceListItem } from "@/types"

interface RecommendedServicesProps {
  services: ServiceListItem[]
  title?: string
}

function RecommendedServices({
  services,
  title = "Recommended Services",
}: RecommendedServicesProps) {
  if (services.length === 0) return null

  return (
    <section className="py-12">
      <div className="container-marivo">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

export { RecommendedServices }
