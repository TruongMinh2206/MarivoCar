export interface EmailInput {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Whether a real email provider is configured. When false, sendEmail falls
 * back to logging (development & tests).
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

/**
 * Send a transactional email.
 *
 * Uses Resend when RESEND_API_KEY is set; otherwise logs the payload so the
 * booking flow keeps working in local development and tests.
 *
 * Never throws — email delivery must not block the booking pipeline. Returns
 * true when the email was delivered (or logged in fallback mode), false when
 * the provider rejected it.
 */
export async function sendEmail(input: EmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log(
      `[EMAIL] To: ${input.to} | Subject: ${input.subject}`
    )
    return true
  }

  try {
    // Lazy import keeps the Resend SDK out of the bundle when unused.
    const { Resend } = await import("resend")
    const resend = new Resend(apiKey)
    const from = process.env.EMAIL_FROM || "MARIVO <noreply@marivo.vn>"

    const result = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    })

    if (result.error) {
      console.error("Email provider rejected the message:", result.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}
