import { Check } from "lucide-react"
import { cn } from "@/utils/cn"

interface Step {
  label: string
  description?: string
}

interface BookingStepperProps {
  steps: Step[]
  currentStep: number
}

function BookingStepper({ steps, currentStep }: BookingStepperProps) {
  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center",
                index < steps.length - 1 && "flex-1"
              )}
            >
              <div className="flex items-center gap-3">
                {/* Step circle */}
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted && "bg-marivo-600 text-white",
                    isCurrent && "bg-marivo-100 text-marivo-700 ring-2 ring-marivo-600",
                    !isCompleted && !isCurrent && "bg-gray-100 text-gray-400"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>

                {/* Step text */}
                <div className="hidden sm:block">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-marivo-700" : isCompleted ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-400">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-3 h-0.5 flex-1",
                    index < currentStep ? "bg-marivo-600" : "bg-gray-200"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { BookingStepper }
