"use client";

import { useState } from "react";
import { CreditCard, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAdminPaymentConfig, useUpdatePaymentConfig } from "@/hooks/admin/use-admin-settings";
import type { PaymentConfig } from "@/types/payment";

function AdminPaymentSettingsForm({ configs }: { configs: PaymentConfig[] }) {
  const updateMutation = useUpdatePaymentConfig();

  const cashAppDefaults = configs.find((c) => c.paymentMethod === 'CASH_APP');
  const paypalDefaults = configs.find((c) => c.paymentMethod === 'PAYPAL');

  const [cashAppEnabled, setCashAppEnabled] = useState(cashAppDefaults?.enabled ?? true);
  const [cashAppHandle, setCashAppHandle] = useState(cashAppDefaults?.cashAppHandle ?? "");
  const [paypalEnabled, setPaypalEnabled] = useState(paypalDefaults?.enabled ?? true);
  const [paypalEmail, setPaypalEmail] = useState(paypalDefaults?.paypalEmail ?? "");
  const [paypalHandle, setPaypalHandle] = useState(paypalDefaults?.paypalHandle ?? "");

  const handleSave = () => {
    if (cashAppEnabled && cashAppHandle && !cashAppHandle.startsWith("$")) {
      toast.error("Cash App handle must start with $");
      return;
    }

    updateMutation.mutate({
      cashAppEnabled,
      cashAppHandle: cashAppEnabled ? cashAppHandle.trim() : undefined,
      paypalEnabled,
      paypalEmail: paypalEnabled ? paypalEmail.trim() : undefined,
      paypalHandle: paypalEnabled ? paypalHandle.trim() : undefined,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Configuration
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cash App */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />

              <Label
                htmlFor="cash-app-enabled"
                className="font-medium"
              >
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
              <Label htmlFor="cash-app-handle">
                Display Handle
              </Label>

              <Input
                id="cash-app-handle"
                value={cashAppHandle}
                onChange={(event) =>
                  setCashAppHandle(event.target.value)
                }
                placeholder="$yourhandle"
              />
            </div>
          )}
        </div>

        {/* PayPal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />

              <Label
                htmlFor="paypal-enabled"
                className="font-medium"
              >
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
              <Label htmlFor="paypal-email">
                Merchant Email
              </Label>

              <Input
                id="paypal-email"
                type="email"
                value={paypalEmail}
                onChange={(event) =>
                  setPaypalEmail(event.target.value)
                }
                placeholder="merchant@example.com"
              />

              <Label htmlFor="paypal-handle">
                PayPal.me Handle
              </Label>

              <Input
                id="paypal-handle"
                value={paypalHandle}
                onChange={(event) =>
                  setPaypalHandle(event.target.value)
                }
                placeholder="yourusername"
              />
              <p className="font-sans text-xs text-muted-foreground">
                Your PayPal.me URL will be: https://www.paypal.me/yourusername
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        <Alert>
          <AlertDescription>
            Manual verification required for all transactions
            during phase one.
          </AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
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

export function AdminPaymentSettings() {
  const { data: configs, isLoading, error } = useAdminPaymentConfig();

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

  if (error || !configs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Configuration
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-destructive">Failed to load payment configuration.</p>
        </CardContent>
      </Card>
    );
  }

  return <AdminPaymentSettingsForm key="loaded" configs={configs} />;
}
