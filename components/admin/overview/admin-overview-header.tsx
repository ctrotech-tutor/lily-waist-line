"use client";

import { useAdminUser } from "@/hooks/admin/use-admin-user";

export function AdminOverviewHeader() {
  const { data: user } = useAdminUser();

  return (
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-bodoni-moda)] text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        Dashboard
      </h1>
      <p className="mt-2 font-[family-name:var(--font-montserrat)] text-muted-foreground">
        Welcome back, {user?.fullName ?? "Admin"}. Here&apos;s what&apos;s happening with Lily Waist Line today.
      </p>
    </div>
  );
}
