import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/guards'
import { ROUTES } from '@/lib/constants/routes'
import { AdminShell } from '@/components/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect(ROUTES.ACCESS_DENIED)
  }

  return <AdminShell>{children}</AdminShell>;
}
