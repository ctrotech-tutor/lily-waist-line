"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AdminOverviewHeader,
  AdminKPICards,
  RecentOrders,
  AdminQuickActions,
  AdminAlerts,
} from "@/components/admin";
import { KpiCardsSkeleton } from "@/components/admin/overview/kpi-cards-skeleton";
import { RecentOrdersSkeleton } from "@/components/admin/overview/recent-orders-skeleton";
import { useAdminDashboard } from "@/hooks/admin/use-admin-dashboard";

export default function AdminDashboardPage() {
  const { data: metrics, isLoading, error, refetch } = useAdminDashboard();

  return (
    <div className="space-y-8">
      <AdminOverviewHeader />

      {isLoading ? (
        <>
          <KpiCardsSkeleton />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrdersSkeleton />
            </div>
          </div>
        </>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <p className="text-muted-foreground">Failed to load dashboard data. Please try again.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      ) : metrics ? (
        <>
          <AdminKPICards
            totalOrders={metrics.totalOrders}
            totalRevenue={metrics.totalRevenue}
            pendingOrders={metrics.pendingOrders}
            shippedOrders={metrics.shippedOrders}
          />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrders orders={metrics.recentOrders} />
            </div>
            <div className="space-y-6">
              <AdminQuickActions />
              <AdminAlerts
                paymentConfirmations={metrics.alerts.paymentConfirmations}
                lowStock={metrics.alerts.lowStock}
                unshippedOrders={metrics.alerts.unshippedOrders}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
