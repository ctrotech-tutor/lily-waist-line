import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/lib/generated/prisma/enums";

export interface OrderDetailsCardProps {
  orderNumber?: string;
  orderDate?: string;
  paymentStatus?: PaymentStatus;
  className?: string;
}

export function OrderDetailsCard({
  orderNumber = "LWL-2024-XXXX",
  orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  paymentStatus = PaymentStatus.PENDING,
  className,
}: OrderDetailsCardProps) {
  const getStatusBadge = () => {
    switch (paymentStatus) {
      case PaymentStatus.PAID:
        return (
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            Paid
          </Badge>
        );
      case PaymentStatus.REJECTED:
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20 font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-lg">
            Pending Payment
          </Badge>
        );
    }
  };

  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center border border-primary/30 bg-primary/10 rounded-lg">
          <Hash className="w-5 h-5 text-primary" />
        </div>
        <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground">
          Order Details
        </h2>
      </div>

      <div className="w-full h-px bg-border/50 mb-6" />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-sans text-sm text-muted-foreground">
              Order Number
            </span>
          </div>
          <span className="font-sans text-sm font-semibold text-foreground">
            {orderNumber}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-sans text-sm text-muted-foreground">
              Order Date
            </span>
          </div>
          <span className="font-sans text-sm font-semibold text-foreground">
            {orderDate}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-sans text-sm text-muted-foreground">
              Payment Status
            </span>
          </div>
          {getStatusBadge()}
        </div>
      </div>
    </Card>
  );
}