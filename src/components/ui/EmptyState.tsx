import { type ReactNode } from "react"
import { cn } from "@/utils/cn"
import { Search, CalendarX, Inbox, MessageSquare } from "lucide-react"
import { Button } from "./Button"
import Link from "next/link"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: { label: string; href: string } | { label: string; onClick: () => void }
  className?: string
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        {icon || <Inbox className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-6">
          {"href" in action ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  )
}

function NoServicesFound({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-gray-400" />}
      title="No services found"
      description="Try adjusting your filters or search terms to find what you're looking for."
      action={onClear ? { label: "Clear Filters", onClick: onClear } : undefined}
    />
  )
}

function NoBookingsYet() {
  return (
    <EmptyState
      icon={<CalendarX className="h-8 w-8 text-gray-400" />}
      title="No bookings yet"
      description="Start exploring services and book your first trip to Phu Quoc!"
      action={{ label: "Browse Services", href: "/airport-transfer" }}
    />
  )
}

function NoReviewsYet() {
  return (
    <EmptyState
      icon={<MessageSquare className="h-8 w-8 text-gray-400" />}
      title="No reviews yet"
      description="Be the first to share your experience!"
    />
  )
}

export { EmptyState, NoServicesFound, NoBookingsYet, NoReviewsYet }
