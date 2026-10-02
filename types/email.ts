/**
 * Email-related types
 */

// Email message structure
export interface EmailMessage {
  to: string
  subject: string
  html?: string
  text?: string
  from?: {
    name?: string
    email?: string
  }
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

// Email send result
export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}