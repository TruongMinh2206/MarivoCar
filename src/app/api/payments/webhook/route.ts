import { NextRequest } from "next/server"
import { processPaymentCallback } from "@/lib/payment-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headers: Record<string, string> = {}
    request.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Get provider from query params or body
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider") || body.provider || "mock"

    const result = await processPaymentCallback(provider, body, headers)

    return Response.json({ success: result.success })
  } catch (error) {
    console.error("Payment webhook error:", error)
    return Response.json(
      { error: { code: "WEBHOOK_ERROR", message: "Webhook processing failed" } },
      { status: 400 }
    )
  }
}
