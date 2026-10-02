import { AdminSettingsHeader } from "@/components/admin/settings/admin-settings-header";
import { AdminPaymentSettings } from "@/components/admin/settings/admin-payment-settings";
import { AdminDangerZone } from "@/components/admin/settings/admin-danger-zone";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminSettingsHeader />
      <AdminPaymentSettings />
      <AdminDangerZone />
    </div>
  );
}