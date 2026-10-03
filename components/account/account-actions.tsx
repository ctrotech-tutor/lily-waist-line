'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLogoutAccount } from '@/hooks/use-account-mutations'
import { ROUTES } from '@/lib/constants/routes'

export function AccountActions() {
  const router = useRouter()
  const logoutMutation = useLogoutAccount()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Signed out successfully')
        router.push(ROUTES.LOGIN)
        router.refresh()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground">
          Account Actions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account session and data
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 max-sm:flex-col">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <LogOut className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">Logout</h3>
              <p className="text-xs text-muted-foreground">Sign out of your account securely</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            variant="outline"
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Logout'}
          </Button>
        </div>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5 p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Request Account Deletion</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Self-service deletion is temporarily unavailable while we protect order and payment records from being erased or left out of sync. Contact support to request a privacy-safe deletion. No data will be removed by opening this page.
            </p>
          </div>
          <Button asChild variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <Link href={ROUTES.CONTACT}>Contact Support</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
