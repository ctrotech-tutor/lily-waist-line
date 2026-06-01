"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, Flag, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface AdminCustomerActionsProps {
  customerId: string;
}

export function AdminCustomerActions({ customerId }: AdminCustomerActionsProps) {
  const router = useRouter();

  return (
    <Card className="border-border/50" data-customer-id={customerId}>
      <CardHeader className="flex flex-row items-center gap-2">
        <Zap className="h-5 w-5 text-secondary" />
        <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-secondary hover:text-secondary"
          onClick={() => router.push(ROUTES.ADMIN_ORDERS)}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          View All Orders
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-secondary hover:text-secondary"
          onClick={() => {
            // UI only - contact customer placeholder
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Customer
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-destructive/50 hover:text-destructive"
          onClick={() => {
            // UI only - flag customer placeholder
          }}
        >
          <Flag className="mr-2 h-4 w-4" />
          Flag Customer
        </Button>
      </CardContent>
    </Card>
  );
}
