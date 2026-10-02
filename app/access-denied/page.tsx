import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = {
  title: 'Access Denied',
  description: 'You do not have permission to access this page.',
  robots: { index: false, follow: false },
}

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl border border-secondary/30 bg-secondary/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-foreground leading-tight mb-2">
            Access Denied
          </h1>
          <p className="font-sans text-sm md:text-base text-muted-foreground leading-relaxed">
            This area is restricted to administrators only.
          </p>
        </div>

        <Button asChild className="w-full h-12 font-sans text-sm uppercase tracking-wider">
          <Link href={ROUTES.HOME}>
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
