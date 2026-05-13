"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, Flag, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminCustomerActionsProps {
  customerId: string;
}

export function AdminCustomerActions({ customerId }: AdminCustomerActionsProps) {
  const router = useRouter();

  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="flex flex-row items-center gap-2">
        <Zap className="h-5 w-5 text-[#d4af37]" />
        <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-[#d4af37] hover:text-[#d4af37]"
          onClick={() => router.push("/admin/orders")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          View All Orders
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-[#d4af37] hover:text-[#d4af37]"
          onClick={() => {
            // UI only - contact customer placeholder
            console.log("Contact customer clicked", customerId);
          }}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Customer
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-red-400 hover:text-red-500"
          onClick={() => {
            // UI only - flag customer placeholder
            console.log("Flag customer clicked", customerId);
          }}
        >
          <Flag className="mr-2 h-4 w-4" />
          Flag Customer
        </Button>
      </CardContent>
    </Card>
  );
}
