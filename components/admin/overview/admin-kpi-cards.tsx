"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Clock, Truck } from "lucide-react";

interface KPIData {
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  shippedOrders: number;
}

const mockKPIData: KPIData = {
  totalOrders: 128,
  revenue: 12540,
  pendingOrders: 8,
  shippedOrders: 34,
};

const kpiConfig = [
  {
    title: "Total Orders",
    value: mockKPIData.totalOrders,
    icon: Package,
    description: "All time orders",
  },
  {
    title: "Revenue",
    value: `$${mockKPIData.revenue.toLocaleString()}`,
    icon: DollarSign,
    description: "Total revenue",
  },
  {
    title: "Pending Orders",
    value: mockKPIData.pendingOrders,
    icon: Clock,
    description: "Awaiting action",
  },
  {
    title: "Shipped Orders",
    value: mockKPIData.shippedOrders,
    icon: Truck,
    description: "In transit",
  },
];

export function AdminKPICards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiConfig.map((kpi) => (
        <Card key={kpi.title} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-[#d4af37]" />
          </CardHeader>
          <CardContent>
            <div className="font-[family-name:var(--font-bodoni)] text-2xl font-bold">
              {kpi.value}
            </div>
            <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
