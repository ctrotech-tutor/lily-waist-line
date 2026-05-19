'use client'

import { useState } from 'react'
import {
  Loader2,
  Shield,
  MailCheck,
  Mail,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import {
  changePassword,
  resendVerificationEmail,
} from '@/server/actions/account'

interface SecurityCenterProps {
  emailVerified: boolean
}

export function SecurityCenter({
  emailVerified,
}: SecurityCenterProps) {
  const [currentPassword, setCurrentPassword] =
    useState('')

  const [newPassword, setNewPassword] =
    useState('')

  const [isChangingPassword, setIsChangingPassword] =
    useState(false)

  const [
    isResendingVerification,
    setIsResendingVerification,
  ] = useState(false)

  const [passwordMessage, setPasswordMessage] =
    useState<{
      type: 'success' | 'error'
      text: string
    } | null>(null)

  const [
    verificationMessage,
    setVerificationMessage,
  ] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handlePasswordChange = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setIsChangingPassword(true)
    setPasswordMessage(null)

    const formData = new FormData()

    formData.append(
      'currentPassword',
      currentPassword
    )

    formData.append(
      'newPassword',
      newPassword
    )

    const result = await changePassword(
      formData
    )

    if (result.success) {
      setPasswordMessage({
        type: 'success',
        text: 'Password changed successfully',
      })

      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordMessage({
        type: 'error',
        text:
          result.error ||
          'Failed to change password',
      })
    }

    setIsChangingPassword(false)
  }

  const handleResendVerification =
    async () => {
      setIsResendingVerification(true)
      setVerificationMessage(null)

      const result =
        await resendVerificationEmail()

      if (result.success) {
        setVerificationMessage({
          type: 'success',
          text:
            'Verification email sent successfully',
        })
      } else {
        setVerificationMessage({
          type: 'error',
          text:
            result.error ||
            'Failed to resend verification email',
        })
      }

      setIsResendingVerification(false)
    }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-foreground">
          Security Center
        </h2>

        <p className="font-['Montserrat'] text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      {/* Email Verification */}
      <Card className="border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary/10">
              {emailVerified ? (
                <MailCheck
                  className="h-6 w-6 text-secondary"
                  strokeWidth={1.5}
                />
              ) : (
                <Mail
                  className="h-6 w-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-['Montserrat'] text-sm font-semibold text-card-foreground">
                  Email Verification
                </h3>

                <Badge
                  className={
                    emailVerified
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {emailVerified
                    ? 'Verified'
                    : 'Unverified'}
                </Badge>
              </div>

              <p className="font-['Montserrat'] text-xs text-muted-foreground">
                {emailVerified
                  ? 'Your email address has been verified'
                  : 'Verify your email to access all account features'}
              </p>
            </div>
          </div>

          {!emailVerified && (
            <Button
              onClick={
                handleResendVerification
              }
              disabled={
                isResendingVerification
              }
              variant="outline"
              className="border-secondary bg-transparent font-['Montserrat'] text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              {isResendingVerification ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Verification'
              )}
            </Button>
          )}
        </div>

        {verificationMessage && (
          <div
            className={`
              mt-4 rounded-sm border p-3 text-xs font-['Montserrat']
              ${
                verificationMessage.type ===
                'success'
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-destructive/20 bg-destructive/10 text-destructive'
              }
            `}
          >
            {verificationMessage.text}
          </div>
        )}
      </Card>

      {/* Password Change */}
      <Card className="border-border bg-card p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary/10">
            <Shield
              className="h-6 w-6 text-secondary"
              strokeWidth={1.5}
            />
          </div>

          <div className="space-y-1">
            <h3 className="font-['Montserrat'] text-sm font-semibold text-card-foreground">
              Change Password
            </h3>

            <p className="font-['Montserrat'] text-xs text-muted-foreground">
              Update your password to keep your
              account secure
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordChange}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Current Password */}
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
              >
                Current Password
              </Label>

              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                required
                className="bg-input font-['Montserrat'] text-card-foreground"
              />
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
              >
                New Password
              </Label>

              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
                minLength={8}
                className="bg-input font-['Montserrat'] text-card-foreground"
              />
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`
                rounded-sm border p-3 text-xs font-['Montserrat']
                ${
                  passwordMessage.type ===
                  'success'
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-destructive/20 bg-destructive/10 text-destructive'
                }
              `}
            >
              {passwordMessage.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={
              isChangingPassword
            }
            className="bg-primary font-['Montserrat'] text-primary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {isChangingPassword ? (
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