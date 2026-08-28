"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Expand } from "lucide-react"
import { cn } from "@/utils/cn"

interface Image {
  id?: string
  url: string
  alt: string | null
  isPrimary: boolean
  sortOrder?: number
}

interface ServiceGalleryProps {
  images: Image[]
}

function ServiceGallery({ images }: ServiceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(
    images.findIndex((img) => img.isPrimary) || 0
  )
  const [fullscreen, setFullscreen] = useState(false)

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <>
      {/* Main Image */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 group">
        <img
          src={activeImage.url}
          alt={activeImage.alt || "Service image"}
          className="h-full w-full object-cover"
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 rounded-lg bg-black/60 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Expand className="h-4 w-4" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                index === activeIndex
                  ? "border-marivo-500"
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <img
                src={img.url}
                alt={img.alt || `Image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] bg-black/90 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setFullscreen(false)}
          >
            ✕
          </button>
          <img
            src={activeImage.url}
            alt={activeImage.alt || "Service image"}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

export { ServiceGallery }
