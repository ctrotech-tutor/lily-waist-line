import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/guards'
import { ROUTES } from '@/lib/constants/routes'

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect(ROUTES.LOGIN)
  }
  return <>{children}</>
}