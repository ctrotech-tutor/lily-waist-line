'use client'

import { AccountHeader } from './account-header'
import { AccountStats } from './account-stats'
import { ProfileManagement } from './profile-management'
import { SecurityCenter } from './security-center'
import { AccountActions } from './account-actions'

interface AccountClientProps {
  fullName: string
  email: string
  memberSince: string
  emailVerified: boolean
  ordersCount: number
  addressesCount: number
  wishlistCount: number
}

export function AccountClient({
  fullName,
  email,
  memberSince,
  emailVerified,
  ordersCount,
  addressesCount,
  wishlistCount,
}: AccountClientProps) {
  const handleEditProfile = () => {
    document
      .getElementById('profile-management')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  return (
    <>
      <div className="mb-12">
        <AccountHeader
          fullName={fullName}
          email={email}
          memberSince={memberSince}
          onEditProfile={handleEditProfile}
        />
      </div>

      <div className="mb-12">
        <AccountStats
          ordersCount={ordersCount}
          addressesCount={addressesCount}
          wishlistCount={wishlistCount}
        />
      </div>

      <div
        id="profile-management"
        className="mb-12 border-b border-border pb-12"
      >
        <ProfileManagement
          initialFullName={fullName}
          initialEmail={email}
        />
      </div>

      <div className="mb-12 border-b border-border pb-12">
        <SecurityCenter
          emailVerified={emailVerified}
        />
      </div>

      <AccountActions />
    </>
  )
}