
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
    <div className="min-h-screen bg-[#131313]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-['Bodoni_Moda'] text-4xl font-bold text-white">
            My Account
          </h1>
          <p className="font-['Montserrat'] text-sm text-gray-400">
            Manage your identity, security, and preferences
          </p>
        </div>

        {children}
      </div>
    </div>
  )
}