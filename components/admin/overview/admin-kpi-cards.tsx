"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Clock, Truck } from "lucide-react";

interface AdminKPICardsProps {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  shippedOrders: number;
}

export function AdminKPICards({ totalOrders, totalRevenue, pendingOrders, shippedOrders }: AdminKPICardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
            Total Orders
          </CardTitle>
          <Package className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-bold">
            {totalOrders}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            All time orders
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
            Revenue
          </CardTitle>
          <DollarSign className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-bold">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            Total revenue
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
            Pending Orders
          </CardTitle>
          <Clock className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-bold">
            {pendingOrders}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            Awaiting action
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
            Shipped Orders
          </CardTitle>
          <Truck className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-bold">
            {shippedOrders}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            In transit
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
