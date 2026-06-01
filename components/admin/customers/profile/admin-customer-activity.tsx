"use client";

import { Activity, UserPlus, ShoppingCart, CreditCard, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomerActivity } from "./data";

interface AdminCustomerActivityProps {
  activities: CustomerActivity[];
}

const activityConfig = {
  account_created: {
    icon: UserPlus,
    className: "bg-info/10 text-info",
  },
  first_purchase: {
    icon: ShoppingCart,
    className: "bg-success/10 text-success",
  },
  payment_completed: {
    icon: CreditCard,
    className: "bg-secondary/10 text-primary/80",
  },
  order_shipped: {
    icon: Truck,
    className: "bg-accent/10 text-accent-foreground",
  },
};

export function AdminCustomerActivity({ activities }: AdminCustomerActivityProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="h-5 w-5 text-secondary" />
        <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="py-8 text-center">
            <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
              No activity recorded
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;
              const isLast = index === activities.length - 1;

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center ${config.className}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {!isLast && (
                      <div className="mt-2 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1 pb-4">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                        {activity.title}
                      </h4>
                      <span className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                        {activity.date}
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
