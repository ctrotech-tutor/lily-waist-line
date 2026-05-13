"use client";

import { AlertTriangle, AlertCircle, DollarSign, FileX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { OrderDetails } from "./data";

interface AdminOrderAlertsProps {
  order: OrderDetails;
}

export function AdminOrderAlerts({ order }: AdminOrderAlertsProps) {
  const alerts = [];

  if (order.paymentStatus === "pending") {
    alerts.push({
      type: "warning" as const,
      icon: AlertTriangle,
      title: "Payment Pending",
      description: "This order requires payment verification before fulfillment can begin.",
    });
  }

  if (order.paymentStatus === "pending" && !order.paymentProof) {
    alerts.push({
      type: "error" as const,
      icon: FileX,
      title: "Missing Payment Proof",
      description: "Customer has not uploaded payment proof yet. Consider following up.",
    });
  }

  if (order.total > 200) {
    alerts.push({
      type: "info" as const,
      icon: DollarSign,
      title: "High Value Order",
      description: `Order total of $${order.total.toFixed(2)} exceeds $200. Consider additional verification steps.`,
    });
  }

  if (order.paymentStatus === "rejected") {
    alerts.push({
      type: "error" as const,
      icon: AlertCircle,
      title: "Payment Rejected",
      description: "Payment verification was rejected. Customer needs to resubmit proof or use alternative payment.",
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          variant={alert.type === "error" ? "destructive" : "default"}
          className={`rounded-none ${
            alert.type === "warning"
              ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
              : alert.type === "info"
                ? "border-blue-500/20 bg-blue-500/10 text-blue-600"
                : "border-red-500/20 bg-red-500/10"
          }`}
        >
          <alert.icon
            className={`h-4 w-4 ${
              alert.type === "warning" ? "text-amber-600" : alert.type === "info" ? "text-blue-600" : ""
            }`}
          />
          <AlertTitle
            className={`font-[family-name:var(--font-montserrat)] text-sm font-semibold ${
              alert.type === "warning" ? "text-amber-700" : alert.type === "info" ? "text-blue-700" : ""
            }`}
          >
            {alert.title}
          </AlertTitle>
          <AlertDescription
            className={`font-[family-name:var(--font-montserrat)] text-xs ${
              alert.type === "warning" ? "text-amber-600" : alert.type === "info" ? "text-blue-600" : ""
            }`}
          >
            {alert.description}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
