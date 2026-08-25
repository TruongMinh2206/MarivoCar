import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-marivo-600 text-white hover:bg-marivo-700 focus-visible:ring-marivo-500 shadow-sm hover:shadow-md",
        secondary:
          "bg-ocean-600 text-white hover:bg-ocean-700 focus-visible:ring-ocean-500 shadow-sm",
        outline:
          "border-2 border-marivo-600 text-marivo-600 hover:bg-marivo-50 focus-visible:ring-marivo-500",
        ghost:
          "text-marivo-600 hover:bg-marivo-50 focus-visible:ring-marivo-500",
        danger:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        warning:
          "bg-sunset-500 text-white hover:bg-sunset-600 focus-visible:ring-sunset-500",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
