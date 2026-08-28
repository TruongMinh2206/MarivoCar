import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Rating } from "@/components/ui/Rating"
import { Price } from "@/components/ui/Price"
import type { ServiceListItem } from "@/types"

interface ServiceCardProps {
  service: ServiceListItem
}

function ServiceCard({ service }: ServiceCardProps) {
  const primaryImage = service.images?.[0]
  const imageUrl = primaryImage?.url || "/images/placeholder.jpg"
  const imageAlt = primaryImage?.alt || service.name

  return (
    <Link href={`/${service.category.slug}/${service.slug}`}>
      <Card hover className="overflow-hidden h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {service.isFeatured && (
            <Badge
              variant="primary"
              className="absolute top-3 left-3"
            >
              Featured
            </Badge>
          )}
          {service.category?.icon && (
            <span className="absolute top-3 right-3 text-2xl">
              {service.category.icon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-marivo-600 transition-colors">
              {service.name}
            </h3>
          </div>

          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {service.shortDescription}
          </p>

          {/* Location */}
          {service.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />
              <span>{service.location.name}</span>
              {service.location.area && <span>· {service.location.area}</span>}
            </div>
          )}

          {/* Vehicles preview for transport */}
          {service.vehicles && service.vehicles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {service.vehicles.slice(0, 3).map((v) => (
                <Badge key={v.id} variant="default" className="text-[10px]">
                  {v.vehicleType.name} · {v.seats} seats
                </Badge>
              ))}
            </div>
          )}

          {/* Tour duration */}
          {service.tour?.duration && (
            <div className="mt-2">
              <Badge variant="info" className="text-[10px]">
                ⏱ {service.tour.duration}
              </Badge>
            </div>
          )}

          {/* Footer: Rating + Price */}
          <div className="mt-auto pt-4 flex items-end justify-between border-t border-gray-100">
            <div>
              <Rating value={service.rating} size="sm" reviewCount={service.reviewCount} />
            </div>
            <div className="text-right">
              <Price amount={service.basePrice} size="lg" />
              <p className="text-[10px] text-gray-400">starting from</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export { ServiceCard }
