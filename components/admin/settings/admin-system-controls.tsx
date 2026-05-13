"use client";

import { useState } from "react";
import { Shield, ShoppingCart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSystemControls() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newOrdersEnabled, setNewOrdersEnabled] = useState(true);
  const [adminNotificationsEnabled, setAdminNotificationsEnabled] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          System Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <div>
              <Label htmlFor="maintenance-mode" className="font-medium">
                Maintenance Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Temporarily disable customer access to the store
              </p>
            </div>
          </div>
          <Switch
            id="maintenance-mode"
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <div>
              <Label htmlFor="new-orders-enabled" className="font-medium">
                New Orders Enabled
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to place new orders
              </p>
            </div>
          </div>
          <Switch
            id="new-orders-enabled"
            checked={newOrdersEnabled}
            onCheckedChange={setNewOrdersEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <div>
              <Label htmlFor="admin-notifications" className="font-medium">
                Admin Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Send email notifications for new orders and updates
              </p>
            </div>
          </div>
          <Switch
            id="admin-notifications"
            checked={adminNotificationsEnabled}
            onCheckedChange={setAdminNotificationsEnabled}
          />
        </div>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
