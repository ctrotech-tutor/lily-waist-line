"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, List, Truck } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: Plus,
    description: "Create a new product listing",
  },
  {
    label: "View Orders",
    href: "/admin/orders",
    icon: List,
    description: "Manage customer orders",
  },
  {
    label: "Manage Shipping",
    href: "/admin/shipping",
    icon: Truck,
    description: "Update shipment statuses",
  },
];

export function AdminQuickActions() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-[family-name:var(--font-bodoni)] text-xl">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className="block">
            <Button
              variant="outline"
              className="h-auto w-full justify-start gap-3 border-border/50 py-3 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5"
            >
              <action.icon className="h-4 w-4 text-[#d4af37]" />
              <div className="text-left">
                <div className="font-[family-name:var(--font-montserrat)] text-sm font-medium">
                  {action.label}
                </div>
                <div className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                  {action.description}
                </div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
