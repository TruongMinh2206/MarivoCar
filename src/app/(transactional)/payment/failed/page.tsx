import { PaymentResultCard } from "@/components/payment/PaymentResultCard"
import { loadBookingSummary, searchParamValue } from "@/lib/booking-summary"

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function PaymentFailedPage({ searchParams }: PageProps) {
  const params = await searchParams
  const booking = await loadBookingSummary(searchParamValue(params, "booking"))

  return (
    <main className="flex-grow flex items-center justify-center py-16 px-5 md:px-16">
      <div className="max-w-2xl w-full bg-surface-container-lowest rounded-xl shadow-modal border border-outline-variant p-8 md:p-12">
        <PaymentResultCard result="failed" booking={booking} />
      </div>
    </main>
  )
}
