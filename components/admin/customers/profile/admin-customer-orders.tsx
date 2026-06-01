"use client";

import { Eye, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "./data";
import type { AdminCustomerOrder } from "../data";

interface AdminCustomerOrdersProps {
  orders: AdminCustomerOrder[];
}

const fulfillmentStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  PROCESSING: { label: "Processing", className: "bg-warning/10 text-warning border-warning/20" },
  SHIPPED: { label: "Shipped", className: "bg-info/10 text-info border-info/20" },
  DELIVERED: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

function formatDate(date: Date): string {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return "N/A"
  }
}

export function AdminCustomerOrders({ orders }: AdminCustomerOrdersProps) {
  const router = useRouter();

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-secondary" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Order History
          </CardTitle>
        </div>
        <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
              No orders yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                    Order ID
                  </TableHead>
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                    Date
                  </TableHead>
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                    Items
                  </TableHead>
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider">
                    Total
                  </TableHead>
                  <TableHead className="font-[family-name:var(--font-montserrat)] text-xs font-semibold uppercase tracking-wider text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusCfg = fulfillmentStatusConfig[order.fulfillmentStatus] || fulfillmentStatusConfig.PENDING;
                  return (
                    <TableRow key={order.id} className="hover:bg-muted/30">
                      <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                        {order.id}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                        {formatDate(order.createdAt as unknown as Date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-[family-name:var(--font-montserrat)] text-xs ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </TableCell>
                      <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="h-8 px-3 font-[family-name:var(--font-montserrat)] text-xs hover:text-secondary"
                        >
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          View Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}