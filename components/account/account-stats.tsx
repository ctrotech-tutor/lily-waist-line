'use client'

import Link from 'next/link'
import { Package, MapPin, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants/routes'

interface AccountStatsProps {
  ordersCount: number
  addressesCount: number
  wishlistCount: number
  isLoading?: boolean
}

export function AccountStats({
  ordersCount,
  addressesCount,
  wishlistCount,
  isLoading,
}: AccountStatsProps) {
  const stats = [
    {
      label: 'Total Orders',
      value: ordersCount,
      icon: Package,
      href: ROUTES.ORDERS,
      description: 'View your order history',
    },
    {
      label: 'Saved Addresses',
      value: addressesCount,
      icon: MapPin,
      href: ROUTES.ADDRESS,
      description: 'Manage your shipping addresses',
    },
    {
      label: 'Wishlist Items',
      value: wishlistCount,
      icon: Heart,
      href: ROUTES.WISHLIST,
      description: 'View your saved products',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="group block"
        >
          <Card
            className={cn(
              'p-6 transition-all duration-300',
              'group-hover:-translate-y-0.5 group-hover:border-secondary/30 group-hover:bg-muted/50'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>

                <p className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
                  {stat.value}
                </p>

                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <stat.icon
                  className="h-5 w-5 text-secondary"
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