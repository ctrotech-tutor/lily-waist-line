"use client";

import { AlertTriangle, AlertCircle, DollarSign, FileX } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AdminOrderDetail } from "./data";

interface AdminOrderAlertsProps {
  order: AdminOrderDetail;
}

export function AdminOrderAlerts({ order }: AdminOrderAlertsProps) {
  const alerts: Array<{
    type: "warning" | "error" | "info";
    icon: typeof AlertTriangle;
    title: string;
    description: string;
  }> = [];

  if (order.paymentStatus === "PENDING") {
    alerts.push({
      type: "warning",
      icon: AlertTriangle,
      title: "Payment Pending",
      description: "This order requires payment verification before fulfillment can begin.",
    });
  }

  if (order.paymentStatus === "PENDING" && !order.paymentProof) {
    alerts.push({
      type: "error",
      icon: FileX,
      title: "Missing Payment Proof",
      description: "Customer has not uploaded payment proof yet. Consider following up.",
    });
  }

  if (order.total > 200) {
    alerts.push({
      type: "info",
      icon: DollarSign,
      title: "High Value Order",
      description: `Order total of $${order.total.toFixed(2)} exceeds $200. Consider additional verification steps.`,
    });
  }

  if (order.paymentStatus === "REJECTED") {
    alerts.push({
      type: "error",
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
          className={`${
            alert.type === "warning"
              ? "border-warning/20 bg-warning/10 text-warning"
              : alert.type === "info"
                ? "border-info/20 bg-info/10 text-info"
                : "border-destructive/20 bg-destructive/10"
          }`}
        >
          <alert.icon
            className={`h-4 w-4 ${
              alert.type === "warning" ? "text-warning" : alert.type === "info" ? "text-info" : ""
            }`}
          />
          <AlertTitle
            className={`font-[family-name:var(--font-montserrat)] text-sm font-semibold ${
              alert.type === "warning" ? "text-warning" : alert.type === "info" ? "text-info" : ""
            }`}
          >
            {alert.title}
          </AlertTitle>
          <AlertDescription
            className={`font-[family-name:var(--font-montserrat)] text-xs ${
              alert.type === "warning" ? "text-warning" : alert.type === "info" ? "text-info" : ""
            }`}
          >
            {alert.description}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}