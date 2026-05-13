import { Settings } from "lucide-react";

export function AdminSettingsHeader() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary">
        <Settings className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 font-body text-sm text-muted-foreground">
          Configure store behavior, payments, and business identity.
        </p>
      </div>
    </div>
  );
}
