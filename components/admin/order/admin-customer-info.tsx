"use client";

import { User, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderDetails } from "./data";

interface AdminCustomerInfoProps {
  order: OrderDetails;
}

export function AdminCustomerInfo({ order }: AdminCustomerInfoProps) {
  return (
    <Card className="rounded-none border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#d4af37]" />
          <CardTitle className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
            Customer Information
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-sm">{order.customerName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-sm">{order.customerEmail}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Shipping Address
            </p>
            <div className="mt-1 space-y-0.5">
              <p className="font-[family-name:var(--font-montserrat)] text-sm">{order.shippingAddress.fullName}</p>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {order.shippingAddress.street}
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-[family-name:var(--font-montserrat)] text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Phone Number
            </p>
            <p className="font-[family-name:var(--font-montserrat)] text-sm">{order.shippingAddress.phone}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
