'use client'

import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AvatarUpload } from './avatar-upload'

interface AccountHeaderProps {
  fullName: string
  email: string
  memberSince: string
  emailVerified: boolean
  avatarUrl: string | null
  onEditProfile: () => void
  className?: string
}

export function AccountHeader({
  fullName,
  email,
  memberSince,
  emailVerified,
  avatarUrl,
  onEditProfile,
  className,
}: AccountHeaderProps) {
  return (
    <div className={cn('border-b border-border', className)}>
      <div className="py-6 md:py-8 lg:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar */}
          <div className="flex shrink-0 justify-center sm:justify-start">
            <AvatarUpload
              avatarUrl={avatarUrl}
              fullName={fullName}
            />
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div>
              <h1 className="font-heading text-2xl leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {fullName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Member since {memberSince}
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />

              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                  emailVerified
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    emailVerified ? 'bg-primary' : 'bg-muted-foreground'
                  )}
                />
                {emailVerified ? 'Email Verified' : 'Email Unverified'}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            onClick={onEditProfile}
            variant="outline"
            className="w-full shrink-0 sm:w-auto"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  )
}