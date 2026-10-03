import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { getEmailConfig, isEmailConfigured } from '@/lib/config/email'
import type { EmailMessage, EmailSendResult } from '@/types/email'
import { sendEmailWithResult } from './email-delivery'

export type { EmailMessage, EmailSendResult }

class EmailService {
  private transporter: Transporter | null = null

  private getTransporter(): Transporter | null {
    if (!isEmailConfigured()) {
      return null
    }

    if (!this.transporter) {
      const config = getEmailConfig()
      if (!config) {
        return null
      }

      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
        // Use pooled connections for better performance
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
      })
    }

    return this.transporter
  }

  async sendEmail(message: EmailMessage): Promise<EmailSendResult> {
    try {
      const transporter = this.getTransporter()
      if (!transporter) {
        return { success: false, error: 'Email service not configured' }
      }

      const config = getEmailConfig()
      if (!config) {
        return { success: false, error: 'Email configuration not available' }
      }

      const mailOptions = {
        from: message.from 
          ? `"${message.from.name || config.from.name}" <${message.from.email || config.from.email}>`
          : `"${config.from.name}" <${config.from.email}>`,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      }

      const result = await transporter.sendMail(mailOptions)
      
      console.info('Email accepted by SMTP transport:', {
        messageId: result.messageId,
        subject: message.subject,
      })

      return {
        success: true,
        messageId: result.messageId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const transporter = this.getTransporter()
      if (!transporter) {
        return false
      }

      await transporter.verify()
      return true
    } catch (error) {
      console.error('Email service verification failed:', error)
      return false
    }
  }

  closeTransport(): void {
    this.transporter?.close()
    this.transporter = null
  }
}

// Singleton instance
export const emailService = new EmailService()

// Kept under its existing name for compatibility; the send outcome is returned
// so business flows can distinguish a successful SMTP handoff from a failure.
export const sendEmailAsync = async (message: EmailMessage): Promise<EmailSendResult> => {
  const result = await sendEmailWithResult(message, (emailMessage) => emailService.sendEmail(emailMessage))
  if (!result.success) {
    console.error('Email delivery failed:', {
      subject: message.subject,
      error: result.error,
    })
  }
  return result
}
