"use client"
import { use, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, MapPin, Users, Luggage, Clock } from "lucide-react"
import { useServiceDetail } from "@/hooks/useServiceDetail"
import { ServiceGallery } from "@/components/service/ServiceGallery"
import { ServiceInfo } from "@/components/service/ServiceInfo"
import { PriceBreakdown } from "@/components/booking/PriceBreakdown"
import { Rating } from "@/components/ui/Rating"
import { Price } from "@/components/ui/Price"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ServiceDetailSkeleton } from "@/components/ui/LoadingSkeleton"
import { ErrorState } from "@/components/ui/ErrorState"
import { ReviewForm } from "@/components/reviews/ReviewForm"
import { ReviewList, type ReviewItem } from "@/components/reviews/ReviewList"
import type { Quote } from "@/types"

/** Reviews section: guest review form + live list, reloaded after each submit. */
function ReviewsSection({
  serviceId,
  serviceName,
}: {
  serviceId: string
  serviceName: string
}) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/reviews?serviceId=${encodeURIComponent(serviceId)}`)
      if (!res.ok) {
        throw new Error("Failed to load reviews")
      }
      const json = await res.json()
      setReviews(Array.isArray(json.data) ? json.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews")
    } finally {
      setIsLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    void loadReviews()
  }, [loadReviews])

  return (
    <section aria-labelledby="reviews-heading" className="space-y-8">
      <div>
        <h2 id="reviews-heading" className="text-headline-sm font-headline-sm text-primary mb-4">
          Reviews
        </h2>

        <ReviewForm serviceId={serviceId} serviceName={serviceName} onCreated={loadReviews} />
      </div>

      {isLoading ? (
        <p className="text-body-md font-body-md text-on-surface-variant">Loading reviews...</p>
      ) : error ? (
        <ErrorState title="Reviews Unavailable" message={error} onRetry={loadReviews} />
      ) : (
        <ReviewList reviews={reviews} />
      )}
    </section>
  )
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = use(params)
  const { service, loading, error } = useServiceDetail(slug)

  if (loading) {
    return (
      <div className="container-marivo py-8">
        <ServiceDetailSkeleton />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="container-marivo py-8">
        <ErrorState title="Service Not Found" message={error || "This service could not be found."} />
      </div>
    )
  }

  const primaryImage = service.images?.find((img) => img.isPrimary) || service.images?.[0]

  // Create a minimal quote preview for the sidebar
  const quotePreview: Quote = {
    quoteId: "preview",
    serviceId: service.id,
    serviceName: service.name,
    tripType: "ONE_WAY",
    date: "",
    time: "",
    passengers: 1,
    luggage: 0,
    priceBreakdown: [{ name: "Base Price", amount: Number(service.basePrice) }],
    subtotal: Number(service.basePrice),
    discount: 0,
    serviceFee: 0,
    total: Number(service.basePrice),
    currency: service.currency,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }

  return (
    <div className="container-marivo py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-marivo-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${category}`} className="hover:text-marivo-600 capitalize">
          {category.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-medium">{service.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          {service.images.length > 0 && (
            <ServiceGallery images={service.images} />
          )}

          {/* Service Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{service.category.name}</Badge>
                  {service.isFeatured && <Badge variant="warning">Featured</Badge>}
                </div>
                <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-bold">
                  {service.name}
                </h1>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
              <Rating value={service.rating} reviewCount={service.reviewCount} />
              {service.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.location.name}
                  {service.location.area && `, ${service.location.area}`}
                </span>
              )}
            </div>

            {service.shortDescription && (
              <p className="mt-4 text-on-surface-variant">{service.shortDescription}</p>
            )}
          </div>

          {/* Vehicles (for transport services) */}
          {service.vehicles && service.vehicles.length > 0 && (
            <div>
              <h2 className="text-headline-sm font-headline-sm text-primary mb-4">Available Vehicles</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {service.vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="default" className="mb-2">{vehicle.vehicleType.name}</Badge>
                        <h3 className="font-semibold text-primary">{vehicle.name}</h3>
                      </div>
                      <Price amount={Number(vehicle.pricePerTrip)} size="lg" />
                    </div>
                    <div className="mt-3 flex gap-4 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {vehicle.seats} seats
                      </span>
                      <span className="flex items-center gap-1">
                        <Luggage className="h-4 w-4" /> {vehicle.luggage} bags
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tour info */}
          {service.tour && (
            <div className="flex flex-wrap gap-4">
              {service.tour.duration && (
                <Badge variant="info" className="text-sm py-1.5 px-3">
                  <Clock className="h-4 w-4 mr-1" /> {service.tour.duration}
                </Badge>
              )}
              {service.tour.capacity && (
                <Badge variant="default" className="text-sm py-1.5 px-3">
                  <Users className="h-4 w-4 mr-1" /> Max {service.tour.capacity} people
                </Badge>
              )}
            </div>
          )}

          {/* Info Tabs */}
          <ServiceInfo
            description={service.description}
            policies={service.policies as Record<string, unknown> | null}
            cancellationPolicy={service.cancellationPolicy as Record<string, unknown> | null}
            tour={service.tour}
          />

          {/* Reviews */}
          <ReviewsSection serviceId={service.id} serviceName={service.name} />
        </div>

        {/* Sidebar - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-on-surface-variant">Starting from</span>
                <Price amount={Number(service.basePrice)} size="xl" />
              </div>

              <Link href={`/booking/${service.slug}?serviceId=${service.id}`}>
                <Button className="w-full" size="lg">
                  Book Now
                </Button>
              </Link>

              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <PriceBreakdown quote={quotePreview} compact />
              </div>

              <p className="mt-4 text-xs text-center text-outline">
                Free cancellation up to 24 hours before
              </p>
            </Card>

            {/* Reviews preview */}
            {service.reviews && service.reviews.length > 0 && (
              <Card className="p-6 mt-4">
                <h3 className="font-semibold text-primary mb-3">Recent Reviews</h3>
                <div className="space-y-3">
                  {service.reviews.slice(0, 3).map((review: any) => (
                    <div key={review.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <Rating value={review.rating} size="sm" showValue={false} />
                        <span className="font-medium text-on-surface">
                          {review.user?.name || "Anonymous"}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-1 text-on-surface-variant line-clamp-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
