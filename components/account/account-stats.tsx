'use client'

import Link from 'next/link'
import { Package, MapPin, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'

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
        <Link
          key={stat.label}
          href={stat.href}
          className="group block"
        >
          <Card className="border-border bg-card p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-secondary/50 group-hover:bg-muted">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="font-['Montserrat'] text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>

                <p className="font-['Bodoni_Moda'] text-4xl font-bold text-card-foreground">
                  {stat.value}
                </p>

                <p className="font-['Montserrat'] text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary/10">
                <stat.icon
                  className="h-6 w-6 text-secondary"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}