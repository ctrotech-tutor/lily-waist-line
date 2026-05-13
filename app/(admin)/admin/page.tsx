import { Metadata } from "next";
import {
  AdminOverviewHeader,
  AdminKPICards,
  RecentOrders,
  AdminQuickActions,
  AdminAlerts,
} from "@/components/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard | Lily Waist Line",
  description: "Administrative dashboard for Lily Waist Line",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <AdminOverviewHeader />

      {/* KPI Cards */}
      <AdminKPICards />

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders - takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Sidebar - Quick Actions + Alerts */}
        <div className="space-y-6">
          <AdminQuickActions />
          <AdminAlerts />
        </div>
      </div>
    </div>
  );
}
