import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        /* Horizon Elite Primary - Deep Navy */
        primary:
          "bg-[#002349] text-white hover:bg-[#001a3a] focus-visible:ring-[#002349] shadow-sm hover:shadow-md",
        /* Horizon Elite CTA - Warm Gold */
        cta:
          "bg-gold text-[#151c22] hover:bg-gold-600 focus-visible:ring-gold shadow-sm hover:shadow-md font-bold",
        /* Horizon Elite Secondary */
        secondary:
          "bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white focus-visible:ring-navy",
        /* Horizon Elite Outline */
        outline:
          "border-2 border-[#002349] text-[#002349] hover:bg-[#002349] hover:text-white focus-visible:ring-[#002349]",
        /* Horizon Elite Ghost */
        ghost:
          "text-[#002349] hover:bg-[#002349]/5 focus-visible:ring-[#002349]",
        /* Horizon Elite Travel Blue */
        blue:
          "bg-[#006CE4] text-white hover:bg-[#0058b8] focus-visible:ring-[#006CE4] shadow-sm",
        /* Horizon Elite Danger */
        danger:
          "bg-[#DC3545] text-white hover:bg-[#c82333] focus-visible:ring-[#DC3545]",
        /* Horizon Elite Success */
        success:
          "bg-[#28A745] text-white hover:bg-[#218838] focus-visible:ring-[#28A745]",
        /* Legacy compat */
        warning:
          "bg-gold text-[#151c22] hover:bg-gold-600 focus-visible:ring-gold",
      },
      size: {
        sm: "h-8 px-3 text-[12px] rounded-[6px]",
        md: "h-10 px-5 text-[14px] rounded-btn",
        lg: "h-12 px-8 text-[16px] rounded-btn",
        xl: "h-14 px-10 text-[18px] rounded-btn",
        icon: "h-10 w-10 rounded-btn",
        "icon-sm": "h-8 w-8 rounded-[6px]",
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
