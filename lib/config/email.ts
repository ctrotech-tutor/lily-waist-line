import { serverEnv } from '../env'

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: {
    name: string
    email: string
  }
}

export const getEmailConfig = (): EmailConfig | null => {
  // Check if all required SMTP environment variables are present
  if (!serverEnv.SMTP_HOST || !serverEnv.SMTP_PORT || !serverEnv.SMTP_USER || !serverEnv.SMTP_PASSWORD) {
    console.warn('Email configuration incomplete. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD environment variables.')
    return null
  }

  return {
    host: serverEnv.SMTP_HOST,
    port: serverEnv.SMTP_PORT,
    secure: serverEnv.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: serverEnv.SMTP_USER,
      pass: serverEnv.SMTP_PASSWORD,
    },
    from: {
      name: 'Lily Waist Line',
      email: serverEnv.SMTP_USER, // Use the SMTP user as the sender email
    },
  }
}

export const isEmailConfigured = (): boolean => {
  return getEmailConfig() !== null
}
