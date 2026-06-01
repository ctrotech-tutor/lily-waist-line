"use client";

import { Users, UserCheck, Repeat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  returningCustomers: number;
}

interface AdminCustomersStatsProps {
  stats: CustomerStats;
}

export function AdminCustomersStats({ stats }: AdminCustomersStatsProps) {
  const statItems = [
    {
      label: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "bg-muted/50 text-muted-foreground",
      borderColor: "border-border/50",
    },
    {
      label: "Active Customers",
      value: stats.activeCustomers.toLocaleString(),
      icon: UserCheck,
      color: "bg-success/10 text-success",
      borderColor: "border-success/20",
    },
    {
      label: "Returning Customers",
      value: stats.returningCustomers.toLocaleString(),
      icon: Repeat,
      color: "bg-secondary/10 text-primary/80",
      borderColor: "border-secondary/20",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.label}
            className="border border-border/50"
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold mt-1">
                    {item.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center border ${item.borderColor} ${item.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
