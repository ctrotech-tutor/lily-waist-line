import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/guards'
import { AccountClient } from '@/components/account'
import { ROUTES } from '@/lib/constants/routes'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  return <AccountClient />
}