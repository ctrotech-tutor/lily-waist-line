import type { EmailMessage, EmailSendResult } from '../../../types/email'

export type EmailSender = (message: EmailMessage) => Promise<EmailSendResult>

/** Keep delivery failures structured instead of swallowing them or lying to callers. */
export async function sendEmailWithResult(
  message: EmailMessage,
  send: EmailSender,
): Promise<EmailSendResult> {
  try {
    return await send(message)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email delivery error',
    }
  }
}
