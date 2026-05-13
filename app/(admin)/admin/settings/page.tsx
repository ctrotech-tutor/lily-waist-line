import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSettingsHeader } from "@/components/admin/settings/admin-settings-header";
import { AdminBusinessProfile } from "@/components/admin/settings/admin-business-profile";
import { AdminPaymentSettings } from "@/components/admin/settings/admin-payment-settings";
import { AdminEmailSettings } from "@/components/admin/settings/admin-email-settings";
import { AdminSystemControls } from "@/components/admin/settings/admin-system-controls";
import { AdminDangerZone } from "@/components/admin/settings/admin-danger-zone";

export default function AdminSettingsPage() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <AdminSettingsHeader />
        
        <div className="grid gap-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminBusinessProfile />
            <AdminPaymentSettings />
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
            <AdminEmailSettings />
            <AdminSystemControls />
          </div>
          
          <AdminDangerZone />
        </div>
      </div>
    </>
  );
}