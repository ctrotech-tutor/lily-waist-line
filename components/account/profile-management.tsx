'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { updateProfile } from '@/server/actions/account'

interface ProfileManagementProps {
  initialFullName: string
  initialEmail: string
  initialPhone?: string
}

export function ProfileManagement({
  initialFullName,
  initialEmail,
  initialPhone,
}: ProfileManagementProps) {
  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState(initialPhone || '')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData()

    formData.append('fullName', fullName)
    formData.append('email', email)
    formData.append('phone', phone)

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage({
        type: 'success',
        text: 'Profile updated successfully',
      })
    } else {
      setMessage({
        type: 'error',
        text: result.error || 'Failed to update profile',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-foreground">
          Profile Management
        </h2>

        <p className="font-['Montserrat'] text-sm text-muted-foreground">
          Update your personal information
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-2">
            <Label
              htmlFor="fullName"
              className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
            >
              Full Name
            </Label>

            <Input
              id="fullName"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              required
              className="bg-input font-['Montserrat'] text-card-foreground"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
            >
              Email
            </Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="bg-input font-['Montserrat'] text-card-foreground"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground"
            >
              Phone (Optional)
            </Label>

            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="+1 (555) 000-0000"
              className="bg-input font-['Montserrat'] text-card-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`
              rounded-sm border p-4 text-sm font-['Montserrat']
              ${
                message.type === 'success'
                  ? 'border-primary/20 bg-primary/10 text-primary'
                  : 'border-destructive/20 bg-destructive/10 text-destructive'
              }
            `}
          >
            {message.text}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary font-['Montserrat'] text-primary-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </div>
  )
}