import { Settings } from "lucide-react";

export function AdminSettingsHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center bg-primary">
        <Settings className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-[family-name:var(--font-bodoni-moda)] text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
          Manage store configuration, payment methods, and business preferences.
        </p>
      </div>
    </div>
  );
}