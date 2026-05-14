'use client'

import { User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountHeaderProps {
  fullName: string
  email: string
  memberSince: string
  onEditProfile: () => void
}

export function AccountHeader({
  fullName,
  email,
  memberSince,
  onEditProfile,
}: AccountHeaderProps) {
  return (
    <div className="flex items-start justify-between border-b border-white/10 pb-8">
      <div className="flex items-start gap-6">
        {/* Avatar placeholder */}
        <div className="flex h-20 w-20 items-center justify-center rounded-sm bg-linear-to-br from-[#D4AF37] to-[#FFD700]">
          <User className="h-10 w-10 text-black" strokeWidth={1.5} />
        </div>

        {/* User info */}
        <div className="space-y-2">
          <h1 className="font-['Bodoni_Moda'] text-3xl font-bold text-white">
            {fullName}
          </h1>
          <p className="font-['Montserrat'] text-sm text-gray-400">{email}</p>
          <p className="font-['Montserrat'] text-xs text-gray-500">
            Member since {memberSince}
          </p>
        </div>
      </div>

      {/* Edit profile button */}
      <Button
        onClick={onEditProfile}
        variant="outline"
        className="border-[#D4AF37] bg-transparent font-['Montserrat'] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
      >
        Edit Profile
      </Button>
    </div>
  )
}
