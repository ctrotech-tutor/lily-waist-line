"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminShippingRow } from "./data";

interface AdminShippingModalProps {
  order: AdminShippingRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (orderId: string, carrier: string, trackingNumber: string) => void;
  isSaving?: boolean;
}

const carriers = [
  { value: "USPS", label: "USPS" },
  { value: "UPS", label: "UPS" },
  { value: "FedEx", label: "FedEx" },
  { value: "DHL", label: "DHL" },
];

export function AdminShippingModal({ order, open, onOpenChange, onSave, isSaving }: AdminShippingModalProps) {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSave = () => {
    if (!order || !carrier || !trackingNumber.trim()) return;
    onSave(order.id, carrier, trackingNumber.trim());
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCarrier("");
      setTrackingNumber("");
    }
    onOpenChange(open);
  };

  if (!order) return null;

  return (
    <Dialog key={order.id} open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-bodoni-moda)] text-xl">
            Add Tracking Information
          </DialogTitle>
          <DialogDescription className="font-[family-name:var(--font-montserrat)] text-sm">
            Update shipping details for order {order.id}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="carrier"
              className="font-[family-name:var(--font-montserrat)] text-sm font-medium"
            >
              Carrier Name
            </Label>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger
                id="carrier"
                className="font-[family-name:var(--font-montserrat)]"
              >
                <SelectValue placeholder="Select a carrier" />
              </SelectTrigger>
              <SelectContent>
                {carriers.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value}
                    className="font-[family-name:var(--font-montserrat)]"
                  >
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="tracking"
              className="font-[family-name:var(--font-montserrat)] text-sm font-medium"
            >
              Tracking Number
            </Label>
            <Input
              id="tracking"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="font-[family-name:var(--font-montserrat)]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="font-[family-name:var(--font-montserrat)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!carrier || !trackingNumber.trim() || isSaving}
            className="font-[family-name:var(--font-montserrat)] bg-secondary text-foreground hover:bg-secondary/90"
          >
            {isSaving ? "Saving..." : "Save Tracking Info"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}