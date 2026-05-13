"use client";

import { User, Mail, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { CustomerStatus } from "../data";

interface AdminCustomerProfileHeaderProps {
  name: string;
  email: string;
  status: CustomerStatus;
}

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  new: { label: "New Customer", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  returning: { label: "Returning Customer", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  vip: { label: "VIP Customer", className: "bg-[#d4af37]/10 text-[#b8952e] border-[#d4af37]/20" },
};

export function AdminCustomerProfileHeader({
  name,
  email,
  status,
}: AdminCustomerProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/admin/customers")}
        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back to Customers
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-none border border-border/50 bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold tracking-tight sm:text-3xl">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={`font-[family-name:var(--font-montserrat)] text-xs ${statusConfig[status].className}`}
              >
                {statusConfig[status].label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span className="font-[family-name:var(--font-montserrat)]">{email}</span>
      </div>
    </div>
  );
}
