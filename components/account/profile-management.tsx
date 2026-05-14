'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-white">
          Profile Management
        </h2>
        <p className="font-['Montserrat'] text-sm text-gray-400">
          Update your personal information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border-white/20 bg-white/5 font-['Montserrat'] text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {message && (
          <div
            className={`rounded-sm p-4 font-['Montserrat'] text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="border-[#D4AF37] bg-[#D4AF37] font-['Montserrat'] text-black hover:bg-[#FFD700]"
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
