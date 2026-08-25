import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-marivo-100 text-marivo-700",
        success: "bg-green-100 text-green-700",
        warning: "bg-sunset-100 text-sunset-700",
        danger: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// Status badge for bookings
const STATUS_MAP: Record<string, { label: string; variant: "default" | "primary" | "success" | "warning" | "danger" | "info" }> = {
  DRAFT: { label: "Draft", variant: "default" },
  PENDING: { label: "Pending", variant: "warning" },
  WAITING_PAYMENT: { label: "Waiting Payment", variant: "info" },
  PAID: { label: "Paid", variant: "primary" },
  CONFIRMED: { label: "Confirmed", variant: "success" },
  IN_PROGRESS: { label: "In Progress", variant: "primary" },
  COMPLETED: { label: "Completed", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
  PAYMENT_FAILED: { label: "Payment Failed", variant: "danger" },
  REFUND_REQUESTED: { label: "Refund Requested", variant: "warning" },
  REFUNDED: { label: "Refunded", variant: "default" },
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] || { label: status, variant: "default" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export { Badge, StatusBadge, badgeVariants }
