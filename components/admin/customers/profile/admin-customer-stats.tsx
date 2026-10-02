"use client";

import { ShoppingBag, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "./data";

interface AdminCustomerStatsProps {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

function formatDate(date: Date | null): string {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return "N/A"
  }
}

export function AdminCustomerStats({
  totalOrders,
  totalSpent,
  lastOrderDate,
}: AdminCustomerStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Orders
          </CardTitle>
          <ShoppingBag className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-3xl font-semibold">
            {totalOrders}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            {totalOrders === 1 ? "order placed" : "orders placed"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Total Spent
          </CardTitle>
          <DollarSign className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-3xl font-semibold">
            {formatCurrency(totalSpent)}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            Lifetime value
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Last Order Date
          </CardTitle>
          <Calendar className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="font-[family-name:var(--font-bodoni-moda)] text-3xl font-semibold">
            {formatDate(lastOrderDate)}
          </div>
          <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
            Most recent purchase
          </p>
        </CardContent>
      </Card>
    </div>
  );
}