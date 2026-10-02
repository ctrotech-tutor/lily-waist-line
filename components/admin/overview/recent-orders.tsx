"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardRecentOrder } from "@/hooks/admin/use-admin-dashboard";

interface RecentOrdersProps {
  orders: DashboardRecentOrder[];
}

const statusBadge: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "Pending Payment", variant: "secondary" },
  PAID: { label: "Paid", variant: "default" },
  REJECTED: { label: "Rejected", variant: "destructive" },
  SHIPPED: { label: "Shipped", variant: "outline" },
  DELIVERED: { label: "Delivered", variant: "default" },
};

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-xl">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                  Order ID
                </TableHead>
                <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                  Customer
                </TableHead>
                <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                  Amount
                </TableHead>
                <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const badge = statusBadge[order.paymentStatus] || statusBadge.PENDING
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={badge.variant} className="font-[family-name:var(--font-montserrat)] text-xs">
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                      {order.date}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
