'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useLogoutAccount, useDeleteAccount } from '@/hooks/use-account-mutations'
import { ROUTES } from '@/lib/constants/routes'

export function AccountActions() {
  const router = useRouter()

  const [deletePassword, setDeletePassword] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const logoutMutation = useLogoutAccount()
  const deleteAccountMutation = useDeleteAccount()

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

  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('password', deletePassword)

    deleteAccountMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Account deleted successfully')
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

      {/* Logout */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 max-sm:flex-col">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <LogOut className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Logout
              </h3>
              <p className="text-xs text-muted-foreground">
                Sign out of your account securely
              </p>
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

      {/* Delete Account */}
      <Card className="border-destructive/20 bg-destructive/5 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" strokeWidth={1.5} />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Delete Account
              </h3>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This action is irreversible. All your data including
                  orders, addresses, and wishlist items will be permanently
                  deleted.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deletePassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3 max-sm:flex-col">
                  <Button
                    type="submit"
                    disabled={deleteAccountMutation.isPending}
                    variant="destructive"
                  >
                    {deleteAccountMutation.isPending
                      ? 'Deleting...'
                      : 'Confirm Delete Account'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePassword('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}