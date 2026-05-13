"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Clock, CreditCard } from "lucide-react";

interface Alert {
  id: string;
  type: "payment" | "stock" | "shipping";
  message: string;
  count: number;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "payment",
    message: "orders are awaiting payment confirmation",
    count: 5,
  },
  {
    id: "2",
    type: "stock",
    message: "products are low in stock",
    count: 3,
  },
  {
    id: "3",
    type: "shipping",
    message: "orders need to be shipped",
    count: 8,
  },
];

const alertConfig = {
  payment: { icon: CreditCard, color: "text-amber-500" },
  stock: { icon: Package, color: "text-red-500" },
  shipping: { icon: Clock, color: "text-blue-500" },
};

export function AdminAlerts() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-bodoni)] text-xl">
          <AlertTriangle className="h-5 w-5 text-[#d4af37]" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockAlerts.map((alert) => {
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
        })}
        {mockAlerts.length === 0 && (
          <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
            No alerts at this time.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
