'use client'

import { useAccountProfile, useAccountStats } from '@/hooks/use-account'
import { AccountHeader } from './account-header'
import { AccountStats } from './account-stats'
import { ProfileManagement } from './profile-management'
import { SecurityCenter } from './security-center'
import { AccountActions } from './account-actions'
import { AccountHeaderSkeleton } from './account-header-skeleton'

export function AccountClient() {
  const { data: user, isLoading: userLoading } = useAccountProfile()
  const { data: stats, isLoading: statsLoading } = useAccountStats()

  const handleEditProfile = () => {
    document
      .getElementById('profile-management')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  if (userLoading || !user) {
    return (
      <div className="mb-12 border-b border-border">
        <div className="py-6 md:py-8 lg:py-10">
          <AccountHeaderSkeleton />
        </div>
      </div>
    )
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <>
      <div className="mb-10">
        <AccountHeader
          fullName={user.fullName}
          email={user.email}
          memberSince={memberSince}
          emailVerified={user.emailVerified}
          avatarUrl={user.avatarUrl}
          onEditProfile={handleEditProfile}
        />
      </div>

      <div className="mb-10">
        <AccountStats
          ordersCount={stats?.ordersCount ?? 0}
          addressesCount={stats?.addressesCount ?? 0}
          wishlistCount={stats?.wishlistCount ?? 0}
          isLoading={statsLoading}
        />
      </div>

      <div
        id="profile-management"
        className="mb-10 border-b border-border pb-10"
      >
        <ProfileManagement
          initialFullName={user.fullName}
          initialEmail={user.email}
          initialPhone={user.phone ?? ''}
        />
      </div>

      <div className="mb-10 border-b border-border pb-10">
        <SecurityCenter
          emailVerified={user.emailVerified}
        />
      </div>

      <AccountActions />
    </>
  )
}