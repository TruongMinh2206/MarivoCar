import { cn } from "@/utils/cn"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton", className)} {...props} />
}

function ServiceCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-card">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="mt-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function ServiceDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-24 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

function BookingFormSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="container-marivo py-8 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServiceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, ServiceCardSkeleton, ServiceDetailSkeleton, BookingFormSkeleton, PageSkeleton }
