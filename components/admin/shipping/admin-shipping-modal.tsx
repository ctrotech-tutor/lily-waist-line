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
import type { ShippingOrder, Carrier } from "./data";

interface AdminShippingModalProps {
  order: ShippingOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (orderId: string, carrier: Carrier, trackingNumber: string, shippingDate: string) => void;
}

const carriers: { value: Carrier; label: string }[] = [
  { value: "USPS", label: "USPS" },
  { value: "UPS", label: "UPS" },
  { value: "FedEx", label: "FedEx" },
  { value: "DHL", label: "DHL" },
];

export function AdminShippingModal({ order, open, onOpenChange, onSave }: AdminShippingModalProps) {
  const [carrier, setCarrier] = useState<Carrier>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingDate, setShippingDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when order changes
  useState(() => {
    if (order) {
      setCarrier(order.carrier);
      setTrackingNumber(order.trackingNumber || "");
      setShippingDate(order.shippedDate || new Date().toISOString().split("T")[0]);
    }
  });

  const handleSave = () => {
    if (!order || !carrier || !trackingNumber.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave(order.id, carrier, trackingNumber, shippingDate || new Date().toISOString().split("T")[0]);
      setIsSaving(false);
      onOpenChange(false);
    }, 500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCarrier(null);
    setTrackingNumber("");
    setShippingDate("");
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-none">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-bodoni)] text-xl">
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
            <Select
              value={carrier || ""}
              onValueChange={(value) => setCarrier(value as Carrier)}
            >
              <SelectTrigger
                id="carrier"
                className="font-[family-name:var(--font-montserrat)] rounded-none"
              >
                <SelectValue placeholder="Select a carrier" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                {carriers.map((c) => (
                  <SelectItem
                    key={c.value}
                    value={c.value || ""}
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
              className="font-[family-name:var(--font-montserrat)] rounded-none"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="shippingDate"
              className="font-[family-name:var(--font-montserrat)] text-sm font-medium"
            >
              Shipping Date
            </Label>
            <Input
              id="shippingDate"
              type="date"
              value={shippingDate}
              onChange={(e) => setShippingDate(e.target.value)}
              className="font-[family-name:var(--font-montserrat)] rounded-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="font-[family-name:var(--font-montserrat)] rounded-none"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!carrier || !trackingNumber.trim() || isSaving}
            className="font-[family-name:var(--font-montserrat)] bg-[#d4af37] text-black hover:bg-[#d4af37]/90 rounded-none"
          >
            {isSaving ? "Saving..." : "Save Tracking Info"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
