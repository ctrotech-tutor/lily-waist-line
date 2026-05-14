import { getCurrentUser } from '@/lib/auth/guards'
import { getAccountStats } from '@/server/actions/account'
import { AccountClient } from '@/components/account/account-client'

export default async function AccountPage() {
  const user = await getCurrentUser()

  const stats = await getAccountStats()

  const memberSince = new Date(user!.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <AccountClient
      fullName={user!.fullName}
      email={user!.email}
      memberSince={memberSince}
      emailVerified={user!.emailVerified}
      ordersCount={stats?.ordersCount || 0}
      addressesCount={stats?.addressesCount || 0}
      wishlistCount={stats?.wishlistCount || 0}
    />
  )
}