"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Package } from "lucide-react"

const services = [
  {
    id: 1,
    name: "Airport Transfer",
    category: "Transportation",
    price: "350,000 VNĐ",
    status: "Active",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Private Car",
    category: "Transportation",
    price: "500,000 VNĐ",
    status: "Active",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Tours",
    category: "Activities",
    price: "1,200,000 VNĐ",
    status: "Active",
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Hotels",
    category: "Accommodation",
    price: "800,000 VNĐ",
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Restaurants",
    category: "Dining",
    price: "250,000 VNĐ",
    status: "Active",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Spa",
    category: "Wellness",
    price: "450,000 VNĐ",
    status: "Inactive",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
  },
]

export default function ServicesPage() {
  const [serviceList, setServiceList] = useState(services)

  const toggleStatus = (id: number) => {
    setServiceList((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
      )
    )
  }

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Services</h1>
        <button className="inline-flex items-center gap-2 rounded-btn bg-secondary-container px-4 py-2 text-label-md text-on-secondary-fixed-variant transition-colors hover:bg-secondary-container/80">
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceList.map((service) => (
          <div
            key={service.id}
            className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient transition-shadow hover:shadow-card"
          >
            {/* Image */}
            <div className="relative h-40 w-full bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.image}
                alt={service.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">
                    {service.name}
                  </h3>
                  <p className="text-label-sm text-on-surface-variant">
                    {service.category}
                  </p>
                </div>
                <span className="rounded-full bg-primary/5 p-2 text-primary">
                  <Package className="h-4 w-4" />
                </span>
              </div>

              <p className="mb-4 text-body-md font-medium text-travel-blue">
                {service.price}
              </p>

              {/* Status Toggle */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-label-sm text-on-surface-variant">Status</span>
                <button
                  onClick={() => toggleStatus(service.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    service.status === "Active" ? "bg-success" : "bg-outline"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-surface-container-lowest transition-transform ${
                      service.status === "Active" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <span
                className={`mb-4 inline-block rounded-full px-2.5 py-0.5 text-label-sm font-label-sm ${
                  service.status === "Active"
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                }`}
              >
                {service.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-outline-variant pt-4">
                <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-btn border border-outline-variant bg-surface-container-lowest py-2 text-label-md text-on-surface transition-colors hover:bg-surface-alt">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-btn border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-md text-error transition-colors hover:bg-error/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
