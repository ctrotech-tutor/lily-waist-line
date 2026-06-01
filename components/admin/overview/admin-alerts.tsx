"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Clock, CreditCard } from "lucide-react";

interface AdminAlertsProps {
  paymentConfirmations: number;
  lowStock: number;
  unshippedOrders: number;
}

export function AdminAlerts({ paymentConfirmations, lowStock, unshippedOrders }: AdminAlertsProps) {
  const alerts = [
    paymentConfirmations > 0 && {
      id: 'payment',
      type: 'payment' as const,
      count: paymentConfirmations,
      message: 'orders are awaiting payment confirmation',
    },
    lowStock > 0 && {
      id: 'stock',
      type: 'stock' as const,
      count: lowStock,
      message: 'products are low in stock',
    },
    unshippedOrders > 0 && {
      id: 'shipping',
      type: 'shipping' as const,
      count: unshippedOrders,
      message: 'orders need to be shipped',
    },
  ].filter(Boolean)

  const alertConfig = {
    payment: { icon: CreditCard, color: "text-warning" },
    stock: { icon: Package, color: "text-destructive" },
    shipping: { icon: Clock, color: "text-info" },
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-bodoni-moda)] text-xl">
          <AlertTriangle className="h-5 w-5 text-secondary" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length > 0 ? alerts.map((alert) => {
          if (!alert) return null
          const { icon: Icon, color } = alertConfig[alert.type];
          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-md border border-border/50 bg-muted/30 p-3"
            >
              <Icon className={`mt-0.5 h-4 w-4 ${color}`} />
              <div className="flex-1">
                <p className="font-[family-name:var(--font-montserrat)] text-sm">
                  <span className="font-semibold">{alert.count}</span>{" "}
                  {alert.message}
                </p>
              </div>
            </div>
          );
        }) : (
          <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
            No alerts at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
