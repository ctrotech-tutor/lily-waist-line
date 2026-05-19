import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/guards'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 py-8 md:py-12">
        {children}
      </div>
    </div>
  )
}