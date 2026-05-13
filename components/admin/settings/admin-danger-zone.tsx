"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDangerZone() {
  const [isResetting, setIsResetting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleResetSystem = () => {
    setIsResetting(true);
    // Simulate action
    setTimeout(() => {
      setIsResetting(false);
      alert("System reset action would be performed here");
    }, 2000);
  };

  const handleClearMockData = () => {
    setIsClearing(true);
    // Simulate action
    setTimeout(() => {
      setIsClearing(false);
      alert("Mock data cleared successfully");
    }, 1500);
  };

  const handleExportData = () => {
    setIsExporting(true);
    // Simulate action
    setTimeout(() => {
      setIsExporting(false);
      alert("Data export completed");
    }, 1000);
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
          <div className="flex items-center justify-between rounded-none border border-border p-4">
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
              onClick={handleResetSystem}
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset System"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-none border border-border p-4">
            <div className="flex items-center gap-3">
              <Trash2 className="h-4 w-4 text-destructive" />
              <div>
                <h4 className="font-medium">Clear Mock Data</h4>
                <p className="text-sm text-muted-foreground">
                  Remove all test/demo data from the system
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearMockData}
              disabled={isClearing}
            >
              {isClearing ? "Clearing..." : "Clear Data"}
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-none border border-border p-4">
            <div className="flex items-center gap-3">
              <Download className="h-4 w-4" />
              <div>
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download all store data as backup
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
