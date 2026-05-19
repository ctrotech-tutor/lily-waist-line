"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { getPaymentConfiguration } from "@/server/actions/payment/get-payment-config";
import { updatePaymentConfiguration } from "@/server/actions/admin/payment/update-payment-config";

export function AdminPaymentSettings() {
  const [cashAppEnabled, setCashAppEnabled] = useState(true);
  const [cashAppHandle, setCashAppHandle] = useState("");
  const [paypalEnabled, setPaypalEnabled] = useState(true);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setIsLoading(true);
    try {
      const result = await getPaymentConfiguration();
      if (result.success && result.data) {
        const cashAppConfig = result.data.find((c: any) => c.paymentMethod === "CASH_APP");
        const paypalConfig = result.data.find((c: any) => c.paymentMethod === "PAYPAL");

        if (cashAppConfig) {
          setCashAppEnabled(cashAppConfig.enabled);
          setCashAppHandle(cashAppConfig.cashAppHandle || "");
        }

        if (paypalConfig) {
          setPaypalEnabled(paypalConfig.enabled);
          setPaypalEmail(paypalConfig.paypalEmail || "");
        }
      }
    } catch (error) {
      console.error("Failed to load payment configuration:", error);
      toast.error("Failed to load payment configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update Cash App configuration
      if (cashAppEnabled && !cashAppHandle) {
        toast.error("Cash App handle is required when Cash App is enabled");
        setIsSaving(false);
        return;
      }

      if (cashAppHandle && !cashAppHandle.startsWith("$")) {
        toast.error("Cash App handle must start with $");
        setIsSaving(false);
        return;
      }

      const cashAppResult = await updatePaymentConfiguration({
        paymentMethod: "CASH_APP",
        enabled: cashAppEnabled,
        cashAppHandle: cashAppEnabled ? cashAppHandle : undefined,
      });

      if (!cashAppResult.success) {
        toast.error(cashAppResult.error || "Failed to update Cash App configuration");
        setIsSaving(false);
        return;
      }

      // Update PayPal configuration
      if (paypalEnabled && !paypalEmail) {
        toast.error("PayPal email is required when PayPal is enabled");
        setIsSaving(false);
        return;
      }

      const paypalResult = await updatePaymentConfiguration({
        paymentMethod: "PAYPAL",
        enabled: paypalEnabled,
        paypalEmail: paypalEnabled ? paypalEmail : undefined,
      });

      if (!paypalResult.success) {
        toast.error(paypalResult.error || "Failed to update PayPal configuration");
        setIsSaving(false);
        return;
      }

      toast.success("Payment configuration updated successfully");
    } catch (error) {
      console.error("Failed to save payment configuration:", error);
      toast.error("Failed to save payment configuration");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
