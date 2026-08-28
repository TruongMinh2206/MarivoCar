"use client"

import { useState } from "react"
import { Star, MessageSquare, Trash2, Send, ChevronLeft, ChevronRight } from "lucide-react"

const mockReviews = [
  {
    id: 1,
    customer: "Nguyen Thi Mai",
    service: "Airport Transfer",
    rating: 5,
    comment: "Dich vu rat tot! Tai xe rat than thien va den dung gio. Chuyen di truyen tot khong co van de gi. Rat hai long voi dich vu nay.",
    date: "2024-08-25",
    replied: true,
  },
  {
    id: 2,
    customer: "Tran Hoang Nam",
    service: "Island Hopping Tour",
    rating: 5,
    comment: "Chuyen di dao tuyet voi! Canh dep, huong dan vien nhiet tinh. Gia ca hop ly so voi chat luong. Se quay lai lan nua.",
    date: "2024-08-24",
    replied: true,
  },
  {
    id: 3,
    customer: "Pham Thanh Hoa",
    service: "Hotel Booking",
    rating: 4,
    comment: "Khach san sach se, view dep. Tuy nhien khong gian yeu cau hon mot chut ve do am trong phong. Nhan vien lich su.",
    date: "2024-08-23",
    replied: false,
  },
  {
    id: 4,
    customer: "Vo Ngoc Anh",
    service: "Snorkeling Tour",
    rating: 5,
    comment: "Trai nghiem ky niem! Nuoc bien trong xanh, cac loai ca dep. Huong dan vien chuyen nghiep va an toan. Rat dang tien.",
    date: "2024-08-22",
    replied: true,
  },
  {
    id: 5,
    customer: "Le Quoc Bao",
    service: "Spa",
    rating: 4,
    comment: "Spa tot, khong gian yen tinh. Massage rat thu gian. Nhan vien khach nhiet nhung doi hoi phuc vu cham hon mot chut.",
    date: "2024-08-21",
    replied: false,
  },
  {
    id: 6,
    customer: "Hoang Thi Kim",
    service: "VinWonders Ticket",
    rating: 5,
    comment: "Ve vao VinWonders gia tot qua mang viet. Giai tri ca ngay, nhieu tro choi hap dan. Rat phu hop cho gia dinh co tre em.",
    date: "2024-08-20",
    replied: true,
  },
]

const filterOptions = ["All", "5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const filteredReviews = mockReviews.filter((review) => {
    if (activeFilter === "All") return true
    const starCount = parseInt(activeFilter.charAt(0))
    return review.rating === starCount
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-travel-blue text-travel-blue" : "text-outline"
        }`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-headline-md text-headline-md text-primary">Reviews</h1>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="appearance-none rounded-lg border border-outline-variant bg-surface-alt px-4 py-2 text-body-md text-on-surface focus:border-travel-blue focus:outline-none focus:ring-1 focus:ring-travel-blue"
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <p className="text-sm font-medium text-on-surface-variant">Average Rating</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">4.8</span>
            <span className="text-sm text-outline">/ 5</span>
          </div>
          <div className="mt-2 flex items-center gap-1">
            {renderStars(5)}
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <p className="text-sm font-medium text-on-surface-variant">Total Reviews</p>
          <div className="mt-2">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">342</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-success">
            <span>+18 this month</span>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <p className="text-sm font-medium text-on-surface-variant">5-Star Reviews</p>
          <div className="mt-2">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">72%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-success">
            <span>+3% vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-ambient">
          <p className="text-sm font-medium text-on-surface-variant">Response Rate</p>
          <div className="mt-2">
            <span className="text-headline-sm font-headline-sm font-bold text-primary">94%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-success">
            <span>Avg response: 2h</span>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-ambient">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Service
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Comment
                </th>
                <th className="px-4 py-3 text-left text-label-sm font-semibold text-on-surface-variant">
                  Date
                </th>
                <th className="px-4 py-3 text-center text-label-sm font-semibold text-on-surface-variant">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-outline-variant last:border-b-0 hover:bg-surface-alt/50"
                >
                  <td className="px-4 py-4 text-body-md font-medium text-on-surface">
                    {review.customer}
                  </td>
                  <td className="px-4 py-4 text-body-md text-on-surface-variant">
                    {review.service}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-4 text-body-md text-on-surface-variant">
                    <p className="line-clamp-2">{review.comment}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-body-md text-on-surface-variant">
                    {review.date}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                        className={`rounded p-1 transition-colors ${
                          review.replied
                            ? "text-success hover:bg-success/10"
                            : "text-outline hover:bg-surface-alt hover:text-travel-blue"
                        }`}
                        title={review.replied ? "Replied" : "Reply"}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded p-1 text-outline transition-colors hover:bg-error/10 hover:text-error"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-outline-variant px-4 py-3">
          <p className="text-body-md text-on-surface-variant">
            Showing {filteredReviews.length} of {mockReviews.length} reviews
          </p>
          <div className="flex items-center gap-1">
            <button
              className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-btn ${
                currentPage === 1
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant transition-colors hover:bg-surface-alt"
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-btn ${
                currentPage === 2
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant transition-colors hover:bg-surface-alt"
              }`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className={`inline-flex h-10 w-10 items-center justify-center rounded-btn ${
                currentPage === 3
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant transition-colors hover:bg-surface-alt"
              }`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-label-md text-on-surface-variant transition-colors hover:bg-surface-alt"
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
