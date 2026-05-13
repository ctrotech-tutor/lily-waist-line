"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminEmailSettings() {
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpUser, setSmtpUser] = useState("noreply@lilywaistline.com");
  const [orderConfirmationEnabled, setOrderConfirmationEnabled] = useState(true);
  const [paymentNotificationEnabled, setPaymentNotificationEnabled] = useState(true);
  const [shippingUpdateEnabled, setShippingUpdateEnabled] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SMTP Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">SMTP Settings</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="smtp-host">SMTP Host</Label>
            <Input
              id="smtp-host"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
              placeholder="smtp.example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtp-user">SMTP User</Label>
            <Input
              id="smtp-user"
              type="email"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
              placeholder="user@example.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="smtp-password">SMTP Password</Label>
            <Input
              id="smtp-password"
              type="password"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Email Templates */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Templates</h3>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="order-confirmation" className="font-normal">
              Order Confirmation
            </Label>
            <Switch
              id="order-confirmation"
              checked={orderConfirmationEnabled}
              onCheckedChange={setOrderConfirmationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="payment-notification" className="font-normal">
              Payment Notification
            </Label>
            <Switch
              id="payment-notification"
              checked={paymentNotificationEnabled}
              onCheckedChange={setPaymentNotificationEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="shipping-update" className="font-normal">
              Shipping Update
            </Label>
            <Switch
              id="shipping-update"
              checked={shippingUpdateEnabled}
              onCheckedChange={setShippingUpdateEnabled}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
