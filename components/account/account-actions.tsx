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
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
      setActionMessage({ type: 'error', text: result.error || 'Failed to delete account' })
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-white">
          Account Actions
        </h2>
        <p className="font-['Montserrat'] text-sm text-gray-400">
          Manage your account session and data
        </p>
      </div>

      {/* Logout */}
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gray-700/50">
              <LogOut className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-sm font-semibold text-white">
                Logout
              </h3>
              <p className="font-['Montserrat'] text-xs text-gray-400">
                Sign out of your account securely
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="border-white/20 bg-transparent font-['Montserrat'] text-white hover:bg-white/10"
          >
            {isLoggingOut ? 'Signing out...' : 'Logout'}
          </Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="border-red-500/20 bg-red-500/5 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-red-500/10">
              <Trash2 className="h-6 w-6 text-red-400" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-sm font-semibold text-white">
                Delete Account
              </h3>
              <p className="font-['Montserrat'] text-xs text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
          </div>

          {!showDeleteConfirm ? (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="border-red-500/50 bg-transparent font-['Montserrat'] text-red-400 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-4">
              <Alert className="border-red-500/20 bg-red-500/5">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="font-['Montserrat'] text-xs text-gray-300">
                  This action is irreversible. All your data including orders, addresses, and
                  wishlist items will be permanently deleted.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="deletePassword"
                    className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>

                {actionMessage && (
                  <div
                    className={`rounded-sm p-3 font-['Montserrat'] text-xs ${
                      actionMessage.type === 'success'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {actionMessage.text}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isDeletingAccount}
                    className="border-red-500 bg-red-500 font-['Montserrat'] text-white hover:bg-red-600"
                  >
                    {isDeletingAccount ? (
                      'Deleting...'
                    ) : (
                      'Confirm Delete Account'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeletePassword('')
                      setActionMessage(null)
                    }}
                    variant="outline"
                    className="border-white/20 bg-transparent font-['Montserrat'] text-white hover:bg-white/10"
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
