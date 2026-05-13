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
import type { CustomerOrder } from "./data";
import { formatCurrency } from "./data";

interface AdminCustomerOrdersProps {
  orders: CustomerOrder[];
}

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  processing: { label: "Processing", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  shipped: { label: "Shipped", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-600 border-red-500/20" },
};

export function AdminCustomerOrders({ orders }: AdminCustomerOrdersProps) {
  const router = useRouter();

  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#d4af37]" />
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
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/30">
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                      {order.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-[family-name:var(--font-montserrat)] text-xs ${statusConfig[order.status].className}`}
                      >
                        {statusConfig[order.status].label}
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
                        className="h-8 px-3 font-[family-name:var(--font-montserrat)] text-xs hover:text-[#d4af37]"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
