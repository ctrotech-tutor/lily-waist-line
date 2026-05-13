"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle } from "lucide-react";
import type { ShippingStats } from "./data";

interface AdminShippingStatsProps {
  stats: ShippingStats;
}

const statConfig = [
  {
    key: "pendingShipment" as const,
    title: "Pending Shipment",
    icon: Package,
    description: "Ready to ship",
    className: "text-amber-600",
  },
  {
    key: "shipped" as const,
    title: "Shipped",
    icon: Truck,
    description: "In transit",
    className: "text-blue-600",
  },
  {
    key: "delivered" as const,
    title: "Delivered",
    icon: CheckCircle,
    description: "Completed",
    className: "text-green-600",
  },
];

export function AdminShippingStats({ stats }: AdminShippingStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {statConfig.map((stat) => (
        <Card key={stat.key} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.className}`} />
          </CardHeader>
          <CardContent>
            <div className="font-[family-name:var(--font-bodoni)] text-3xl font-bold">
              {stats[stat.key]}
            </div>
            <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
