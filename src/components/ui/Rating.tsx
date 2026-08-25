"use client"
import { Star } from "lucide-react"
import { cn } from "@/utils/cn"

interface RatingProps {
  value: number
  maxStars?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewCount?: number
  className?: string
}

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }
const textMap = { sm: "text-xs", md: "text-sm", lg: "text-base" }

function Rating({
  value,
  maxStars = 5,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeMap[size],
            i < Math.round(value)
              ? "fill-sunset-400 text-sunset-400"
              : "fill-gray-200 text-gray-200"
          )}
        />
      ))}
      {showValue && (
        <span className={cn("font-medium text-gray-700 ml-0.5", textMap[size])}>
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-gray-500", textMap[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  )
}

export { Rating }
