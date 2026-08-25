import { cn } from "@/utils/cn"

interface PriceProps {
  amount: number
  currency?: string
  suffix?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl font-bold",
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount)
}

function Price({
  amount,
  currency = "VND",
  suffix,
  size = "md",
  className,
}: PriceProps) {
  return (
    <span className={cn("font-semibold text-marivo-700", sizeMap[size], className)}>
      {formatPrice(amount)} {currency === "VND" ? "₫" : currency}
      {suffix && (
        <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>
      )}
    </span>
  )
}

export { Price }
