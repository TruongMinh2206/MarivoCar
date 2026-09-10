import { MockPaymentForm } from "@/components/payment/MockPaymentForm"
import { searchParamValue } from "@/lib/booking-summary"

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function MockPaymentPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <main className="flex-grow flex items-center justify-center py-16 px-5 md:px-16">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-xl shadow-modal border border-outline-variant p-8">
        <MockPaymentForm
          txn={searchParamValue(params, "txn")}
          amount={Number(searchParamValue(params, "amount")) || 0}
          currency={searchParamValue(params, "currency") || "VND"}
          bookingCode={searchParamValue(params, "booking")}
        />
      </div>
    </main>
  )
}
