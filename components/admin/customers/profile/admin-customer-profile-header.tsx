"use client";

import { User, Mail, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { CustomerStatus } from "../data";
import { ROUTES } from "@/lib/constants/routes";

interface AdminCustomerProfileHeaderProps {
  fullName: string;
  email: string;
  status: CustomerStatus;
}

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  NEW: { label: "New Customer", className: "bg-info/10 text-info border-info/20" },
  RETURNING: { label: "Returning Customer", className: "bg-success/10 text-success border-success/20" },
  VIP: { label: "VIP Customer", className: "bg-secondary/10 text-primary/80 border-secondary/20" },
};

export function AdminCustomerProfileHeader({
  fullName,
  email,
  status,
}: AdminCustomerProfileHeaderProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(ROUTES.ADMIN_CUSTOMERS)}
        className="h-8 px-2 font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Back to Customers
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-border/50 bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold tracking-tight sm:text-3xl">
              {fullName}
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