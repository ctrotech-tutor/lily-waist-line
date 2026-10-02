const DEV_URL = 'http://localhost:3000'
const PROD_URL = 'https://www.lilywaistline.com'

export function getAppUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return process.env.NODE_ENV === 'production' ? PROD_URL : DEV_URL
}