import { type HTMLAttributes } from "react"
import { cn } from "@/utils/cn"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

function Card({ className, hover = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-card",
        hover &&
          "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pt-6 pb-2", className)} {...props} />
  )
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4", className)} {...props} />
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center px-6 pb-6 pt-2", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardContent, CardFooter }
