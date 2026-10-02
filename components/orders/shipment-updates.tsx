"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { CheckCircle, MapPin } from "lucide-react";
import type { ShipmentUpdate } from "@/types/order";

export type { ShipmentUpdate };

export interface ShipmentUpdatesProps {
  updates: ShipmentUpdate[];
  className?: string;
}

const getStatusIcon = (status: ShipmentUpdate["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-primary" />;
    case "current":
      return <div className="w-2 h-2 rounded-full bg-primary" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />;
  }
};

export function ShipmentUpdates({ updates, className }: ShipmentUpdatesProps) {
  return (
    <Card className={cn("p-6 md:p-8 border border-border bg-card rounded-lg", className)}>
      <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6">Shipment Updates</h2>
      <div className="space-y-0">
        {updates.map((update, index) => (
          <div key={update.id}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn("w-8 h-8 flex items-center justify-center shrink-0 rounded-lg", update.status === "completed" && "bg-primary/10", update.status === "current" && "bg-primary/20", update.status === "pending" && "bg-muted")}>
                  {getStatusIcon(update.status)}
                </div>
                {index < updates.length - 1 && <div className="w-px flex-1 bg-border my-2" />}
              </div>
              <div className={cn("flex-1 pb-6", index === updates.length - 1 && "pb-0")}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <p className="font-sans text-sm font-medium text-foreground">{update.date}</p>
                  {update.time && <p className="font-sans text-xs text-muted-foreground">{update.time}</p>}
                </div>
                <p className={cn("font-sans text-sm", update.status === "current" ? "text-foreground" : "text-muted-foreground")}>{update.message}</p>
                {update.location && (
                  <p className="font-sans text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {update.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}