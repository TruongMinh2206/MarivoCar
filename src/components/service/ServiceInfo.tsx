"use client"
import { useState } from "react"
import { Check, X as XIcon, Info, FileText, MessageSquare } from "lucide-react"
import { cn } from "@/utils/cn"

interface ServiceInfoProps {
  description: string | null
  policies: Record<string, unknown> | null
  cancellationPolicy: Record<string, unknown> | null
  tour?: {
    included: Record<string, unknown> | null
    excluded: Record<string, unknown> | null
    meetingPoint: string | null
  } | null
}

type Tab = "description" | "included" | "policies" | "reviews"

function ServiceInfo({ description, policies, cancellationPolicy, tour }: ServiceInfoProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description")

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: "description", label: "Description", icon: <Info className="h-4 w-4" /> },
    ...(tour?.included || tour?.excluded
      ? [{ id: "included" as Tab, label: "What's Included", icon: <Check className="h-4 w-4" /> }]
      : []),
    { id: "policies", label: "Policies", icon: <FileText className="h-4 w-4" /> },
    { id: "reviews", label: "Reviews", icon: <MessageSquare className="h-4 w-4" /> },
  ]

  const includedList = tour?.included
    ? Object.entries(tour.included).map(([key, val]) => ({
        text: typeof val === "string" ? val : key,
        included: true,
      }))
    : []

  const excludedList = tour?.excluded
    ? Object.entries(tour.excluded).map(([key, val]) => ({
        text: typeof val === "string" ? val : key,
        included: false,
      }))
    : []

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-marivo-600 text-marivo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none text-gray-600">
            {description ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-gray-400 italic">No description available.</p>
            )}
          </div>
        )}

        {activeTab === "included" && (
          <div className="space-y-6">
            {includedList.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Included</h4>
                <ul className="space-y-2">
                  {includedList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {excludedList.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Not Included</h4>
                <ul className="space-y-2">
                  {excludedList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <XIcon className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tour?.meetingPoint && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h4 className="font-medium text-gray-900 mb-1">Meeting Point</h4>
                <p className="text-sm text-gray-600">{tour.meetingPoint}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "policies" && (
          <div className="space-y-6">
            {policies && typeof policies === "object" && Object.keys(policies).length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Service Policies</h4>
                <ul className="space-y-2">
                  {Object.entries(policies).map(([key, val]) => (
                    <li key={key} className="text-sm text-gray-600">
                      <span className="font-medium">{key}:</span>{" "}
                      {typeof val === "string" ? val : JSON.stringify(val)}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No specific policies listed.</p>
            )}
            {cancellationPolicy &&
              typeof cancellationPolicy === "object" &&
              Object.keys(cancellationPolicy).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Cancellation Policy</h4>
                  <ul className="space-y-2">
                    {Object.entries(cancellationPolicy).map(([key, val]) => (
                      <li key={key} className="text-sm text-gray-600">
                        <span className="font-medium">{key}:</span>{" "}
                        {typeof val === "string" ? val : JSON.stringify(val)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div id="reviews-section">
            <p className="text-sm text-gray-500">Reviews section — scroll down to see all reviews.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export { ServiceInfo }
