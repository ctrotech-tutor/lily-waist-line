'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { logout, deleteAccount } from '@/server/actions/account'

export function AccountActions() {
  const router = useRouter()

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    const result = await logout()

    if (result.success) {
      router.push('/login')
      router.refresh()
    }

    setIsLoggingOut(false)
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsDeletingAccount(true)
    setActionMessage(null)

    const formData = new FormData()
    formData.append('password', deletePassword)

    const result = await deleteAccount(formData)

    if (result.success) {
      router.push('/login')
      router.refresh()
    } else {
      setActionMessage({
        type: 'error',
        text: result.error || 'Failed to delete account',
      })

      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-foreground">
          Account Actions
        </h2>

        <p className="font-['Montserrat'] text-sm text-muted-foreground">
          Manage your account session and data
        </p>
      </div>

      {/* Logout */}
      <Card className="border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4 max-sm:flex-col">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-muted">
              <LogOut
                className="h-5 w-5 text-muted-foreground"
                strokeWidth={1.5}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-sm font-semibold text-card-foreground">
                Logout
              </h3>

              <p className="font-['Montserrat'] text-xs text-muted-foreground">
                Sign out of your account securely
              </p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="font-['Montserrat']"
          >
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/20 bg-destructive/5 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-destructive/10">
              <Trash2
                className="h-5 w-5 text-destructive"
                strokeWidth={1.5}
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-sm font-semibold text-card-foreground">
                Delete Account
              </h3>

              <p className="font-['Montserrat'] text-xs text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10 font-['Montserrat']"
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Warning */}
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertTriangle
                  className="h-4 w-4 text-destructive"
                />

                <AlertDescription className="font-['Montserrat'] text-xs text-muted-foreground">
                  This action is irreversible. All your data including
                  orders, addresses, and wishlist items will be permanently
                  deleted.
                </AlertDescription>
              </Alert>

              {/* Form */}
              <form
                onSubmit={handleDeleteAccount}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="deletePassword"
                    className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Confirm Password
                  </Label>

                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) =>
                      setDeletePassword(e.target.value)
                    }
                    required
                    className="font-['Montserrat']"
                  />
                </div>

                {/* Error / Success */}
                {actionMessage && (
                  <div
                    className={`
                      rounded-sm border p-3 text-xs font-['Montserrat']
                      ${
                        actionMessage.type === 'success'
                          ? 'border-primary/20 bg-primary/10 text-primary'
                          : 'border-destructive/20 bg-destructive/10 text-destructive'
                      }
                    `}
                  >
                    {actionMessage.text}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 max-sm:flex-col">
                  <Button
                    type="submit"
                    disabled={isDeletingAccount}
                    variant="destructive"
                    className="font-['Montserrat']"
                  >
                    {isDeletingAccount
                      ? 'Deleting...'
                      : 'Confirm Delete Account'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="font-['Montserrat']"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePassword('')
                      setActionMessage(null)
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