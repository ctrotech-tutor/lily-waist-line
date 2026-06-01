'use client'

import { useState } from 'react'
import {
  Loader2,
  Shield,
  MailCheck,
  Mail,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { useChangePassword, useResendVerificationEmail } from '@/hooks/use-account-mutations'
import { cn } from '@/lib/utils'

interface SecurityCenterProps {
  emailVerified: boolean
}

export function SecurityCenter({
  emailVerified,
}: SecurityCenterProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const changePasswordMutation = useChangePassword()
  const resendVerificationMutation = useResendVerificationEmail()

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('currentPassword', currentPassword)
    formData.append('newPassword', newPassword)

    changePasswordMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Password changed successfully')
        setCurrentPassword('')
        setNewPassword('')
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  const handleResendVerification = () => {
    resendVerificationMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Verification email sent successfully')
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
          Security Center
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      {/* Email Verification */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
              {emailVerified ? (
                <MailCheck className="h-5 w-5 text-secondary" strokeWidth={1.5} />
              ) : (
                <Mail className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Email Verification
                </h3>
                <Badge
                  variant={emailVerified ? 'default' : 'secondary'}
                  className={cn(
                    !emailVerified && 'bg-muted text-muted-foreground hover:bg-muted'
                  )}
                >
                  {emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                {emailVerified
                  ? 'Your email address has been verified'
                  : 'Verify your email to access all account features'}
              </p>
            </div>
          </div>

          {!emailVerified && (
            <Button
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
              variant="outline"
              className="shrink-0"
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification'
              )}
            </Button>
          )}
        </div>
      </Card>

      {/* Password Change */}
      <Card className="p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
            <Shield className="h-5 w-5 text-secondary" strokeWidth={1.5} />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
              Change Password
            </h3>
            <p className="text-xs text-muted-foreground">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              'Change Password'
            )}
          </Button>
        </form>
      </Card>
    </div>
  )
}