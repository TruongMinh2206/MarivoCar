"use client"
import { forwardRef, type SelectHTMLAttributes } from "react"
import { cn } from "@/utils/cn"
import { ChevronDown } from "lucide-react"

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  placeholder?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, placeholder, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "flex h-11 w-full appearance-none rounded-lg border bg-white px-4 pr-10 text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-marivo-500 focus:ring-marivo-500/20 hover:border-gray-400",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select }
export type { SelectProps }
