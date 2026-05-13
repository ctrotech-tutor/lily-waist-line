"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: "pending_payment" | "paid" | "shipped";
  date: string;
}

const mockRecentOrders: RecentOrder[] = [
  {
    id: "LWL-2026-001",
    customerName: "Sarah Johnson",
    amount: 149.99,
    status: "pending_payment",
    date: "2026-05-11",
  },
  {
    id: "LWL-2026-002",
    customerName: "Emily Davis",
    amount: 89.50,
    status: "paid",
    date: "2026-05-10",
  },
  {
    id: "LWL-2026-003",
    customerName: "Maria Garcia",
    amount: 234.00,
    status: "shipped",
    date: "2026-05-09",
  },
  {
    id: "LWL-2026-004",
    customerName: "Jessica Wilson",
    amount: 67.99,
    status: "paid",
    date: "2026-05-09",
  },
  {
    id: "LWL-2026-005",
    customerName: "Amanda Brown",
    amount: 189.00,
    status: "pending_payment",
    date: "2026-05-08",
  },
];

const statusConfig = {
  pending_payment: { label: "Pending Payment", variant: "secondary" as const },
  paid: { label: "Paid", variant: "default" as const },
  shipped: { label: "Shipped", variant: "outline" as const },
};

export function RecentOrders() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-bodoni)] text-xl">
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
              {mockRecentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[order.status].variant} className="font-[family-name:var(--font-montserrat)] text-xs">
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                    {order.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
