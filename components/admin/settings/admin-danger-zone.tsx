"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, Trash2, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetSystem, useClearAllStoreData, useExportStoreData } from "@/hooks/admin/use-admin-danger-zone";

export function AdminDangerZone() {
  const resetMutation = useResetSystem();
  const clearMutation = useClearAllStoreData();
  const exportMutation = useExportStoreData();
  const [confirmAction, setConfirmAction] = useState<"reset" | "clear" | "export" | null>(null);

  const handleConfirm = () => {
    switch (confirmAction) {
      case "reset":
        resetMutation.mutate();
        break;
      case "clear":
        clearMutation.mutate();
        break;
      case "export":
        exportMutation.mutate();
        break;
    }
    setConfirmAction(null);
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            These actions are irreversible and may affect your store&apos;s operation.
            Please proceed with caution.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* Reset System */}
          <div className="flex items-center justify-between border border-border p-4">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-destructive" />
              <div>
                <h4 className="font-medium">Reset System</h4>
                <p className="text-sm text-muted-foreground">
                  Reset all settings to default values
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmAction("reset")}
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Resetting...</>
              ) : "Reset System"}
            </Button>
          </div>

          {/* Clear All Data */}
          <div className="flex items-center justify-between border border-border p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-4 w-4 text-destructive" />
              <div>
                <h4 className="font-medium">Clear All Data</h4>
                <p className="text-sm text-muted-foreground">
                  Remove all store data including customers, orders, and products
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmAction("clear")}
              disabled={clearMutation.isPending}
            >
              {clearMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Clearing...</>
              ) : "Clear Data"}
            </Button>
          </div>

          {/* Export Data */}
          <div className="flex items-center justify-between border border-border p-4">
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download all store data as a JSON backup file
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmAction("export")}
              disabled={exportMutation.isPending}
            >
              {exportMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting...</>
              ) : "Export Data"}
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
            <div className="w-full max-w-md border border-border bg-background p-6 shadow-lg">
              <h3 className="font-[family-name:var(--font-bodoni-moda)] text-lg font-semibold">
                {confirmAction === "reset" && "Reset System Settings?"}
                {confirmAction === "clear" && "Clear All Store Data?"}
                {confirmAction === "export" && "Export Store Data?"}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                {confirmAction === "reset" && "This will reset all payment configurations to their default disabled state. Customer data, orders, and products will not be affected."}
                {confirmAction === "clear" && "This will permanently delete all customers, orders, products, addresses, wishlists, cart items, and payment proofs. Admin accounts are preserved. This action cannot be undone."}
                {confirmAction === "export" && "Download a complete JSON export of all customers, orders, products, and payment configurations for backup purposes."}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
                <Button
                  variant={confirmAction === "export" ? "outline" : "destructive"}
                  onClick={handleConfirm}
                >
                  {confirmAction === "reset" && "Reset"}
                  {confirmAction === "clear" && "Delete Everything"}
                  {confirmAction === "export" && "Export"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}