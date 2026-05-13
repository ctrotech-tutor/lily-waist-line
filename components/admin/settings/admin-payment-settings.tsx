"use client";

import { useState } from "react";
import { CreditCard, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AdminPaymentSettings() {
  const [cashAppEnabled, setCashAppEnabled] = useState(true);
  const [cashAppHandle, setCashAppHandle] = useState("$lilywaistline");
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [paypalEmail, setPaypalEmail] = useState("payments@lilywaistline.com");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cash App Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <Label htmlFor="cash-app-enabled" className="font-medium">
                Cash App
              </Label>
            </div>
            <Switch
              id="cash-app-enabled"
              checked={cashAppEnabled}
              onCheckedChange={setCashAppEnabled}
            />
          </div>
          
          {cashAppEnabled && (
            <div className="grid gap-2 pl-6">
              <Label htmlFor="cash-app-handle">Display Handle</Label>
              <Input
                id="cash-app-handle"
                value={cashAppHandle}
                onChange={(e) => setCashAppHandle(e.target.value)}
                placeholder="$yourhandle"
              />
            </div>
          )}
        </div>

        {/* PayPal Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <Label htmlFor="paypal-enabled" className="font-medium">
                PayPal
              </Label>
            </div>
            <Switch
              id="paypal-enabled"
              checked={paypalEnabled}
              onCheckedChange={setPaypalEnabled}
            />
          </div>
          
          {paypalEnabled && (
            <div className="grid gap-2 pl-6">
              <Label htmlFor="paypal-email">Merchant Email</Label>
              <Input
                id="paypal-email"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="merchant@example.com"
              />
            </div>
          )}
        </div>

        {/* Payment Notes */}
        <Alert>
          <AlertDescription>
            Manual verification required for all transactions in phase one.
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
