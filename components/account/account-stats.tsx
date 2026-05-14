'use client'

import { Package, MapPin, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface AccountStatsProps {
  ordersCount: number
  addressesCount: number
  wishlistCount: number
}

export function AccountStats({
  ordersCount,
  addressesCount,
  wishlistCount,
}: AccountStatsProps) {
  const stats = [
    {
      label: 'Total Orders',
      value: ordersCount,
      icon: Package,
      href: '/orders',
      description: 'View your order history',
    },
    {
      label: 'Saved Addresses',
      value: addressesCount,
      icon: MapPin,
      href: '/address',
      description: 'Manage your shipping addresses',
    },
    {
      label: 'Wishlist Items',
      value: wishlistCount,
      icon: Heart,
      href: '/wishlist',
      description: 'View your saved products',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <Card className="border-white/10 bg-white/5 p-6 transition-all hover:border-[#D4AF37]/50 hover:bg-white/10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="font-['Montserrat'] text-xs uppercase tracking-wider text-gray-400">
                  {stat.label}
                </p>
                <p className="font-['Bodoni_Moda'] text-4xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="font-['Montserrat'] text-xs text-gray-500">
                  {stat.description}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#D4AF37]/10">
                <stat.icon className="h-6 w-6 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
