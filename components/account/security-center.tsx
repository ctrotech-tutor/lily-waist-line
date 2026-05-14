'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Shield, MailCheck, Mail } from 'lucide-react'
import { changePassword, resendVerificationEmail } from '@/server/actions/account'

interface SecurityCenterProps {
  emailVerified: boolean
}

export function SecurityCenter({ emailVerified }: SecurityCenterProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [verificationMessage, setVerificationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordMessage(null)

    const formData = new FormData()
    formData.append('currentPassword', currentPassword)
    formData.append('newPassword', newPassword)

    const result = await changePassword(formData)

    if (result.success) {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
    } else {
      setPasswordMessage({ type: 'error', text: result.error || 'Failed to change password' })
    }

    setIsChangingPassword(false)
  }

  const handleResendVerification = async () => {
    setIsResendingVerification(true)
    setVerificationMessage(null)

    const result = await resendVerificationEmail()

    if (result.success) {
      setVerificationMessage({ type: 'success', text: 'Verification email sent successfully' })
    } else {
      setVerificationMessage({ type: 'error', text: result.error || 'Failed to resend verification email' })
    }

    setIsResendingVerification(false)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-white">
          Security Center
        </h2>
        <p className="font-['Montserrat'] text-sm text-gray-400">
          Manage your account security settings
        </p>
      </div>

      {/* Email Verification Status */}
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#D4AF37]/10">
              {emailVerified ? (
                <MailCheck className="h-6 w-6 text-[#D4AF37]" strokeWidth={1.5} />
              ) : (
                <Mail className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="font-['Montserrat'] text-sm font-semibold text-white">
                  Email Verification
                </h3>
                <Badge
                  variant={emailVerified ? 'default' : 'secondary'}
                  className={
                    emailVerified
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                      : 'border-gray-600 bg-gray-800 text-gray-400'
                  }
                >
                  {emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <p className="font-['Montserrat'] text-xs text-gray-400">
                {emailVerified
                  ? 'Your email address has been verified'
                  : 'Verify your email to access all account features'}
              </p>
            </div>
          </div>
          {!emailVerified && (
            <Button
              onClick={handleResendVerification}
              disabled={isResendingVerification}
              variant="outline"
              className="border-[#D4AF37] bg-transparent font-['Montserrat'] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
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
            className={`mt-4 rounded-sm p-3 font-['Montserrat'] text-xs ${
              verificationMessage.type === 'success'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {verificationMessage.text}
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#D4AF37]/10">
            <Shield className="h-6 w-6 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h3 className="font-['Montserrat'] text-sm font-semibold text-white">
              Change Password
            </h3>
            <p className="font-['Montserrat'] text-xs text-gray-400">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                required
                minLength={8}
              />
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`rounded-sm p-3 font-['Montserrat'] text-xs ${
                passwordMessage.type === 'success'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={isChangingPassword}
            className="border-[#D4AF37] bg-[#D4AF37] font-['Montserrat'] text-black hover:bg-[#FFD700]"
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
