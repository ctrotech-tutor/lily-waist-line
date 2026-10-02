import nodemailer from 'nodemailer'
import { getEmailConfig, isEmailConfigured } from '@/lib/config/email'
import type { EmailMessage, EmailSendResult } from '@/types/email'

export type { EmailMessage, EmailSendResult }

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  private getTransporter(): nodemailer.Transporter | null {
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
        const error = 'Email service not configured'
        console.error('Email send failed:', error)
        return { success: false, error }
      }

      const config = getEmailConfig()
      if (!config) {
        const error = 'Email configuration not available'
        console.error('Email send failed:', error)
        return { success: false, error }
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
      
      console.log('Email sent successfully:', {
        messageId: result.messageId,
        to: message.to,
        subject: message.subject,
      })

      return {
        success: true,
        messageId: result.messageId,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Email send failed:', {
        error: errorMessage,
        to: message.to,
        subject: message.subject,
      })

      return {
        success: false,
        error: errorMessage,
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
}

// Singleton instance
export const emailService = new EmailService()

// Helper function for non-blocking email sending
export const sendEmailAsync = async (message: EmailMessage): Promise<void> => {
  // Send email in background without blocking the main flow
  try {
    await emailService.sendEmail(message)
  } catch (error) {
    // Error is already logged in the email service
    // We don't throw here to avoid breaking business flows
    console.error('Background email send failed:', error)
  }
}
