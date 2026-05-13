"use client";

import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { AdminMobileNav } from "./admin-mobile-nav";
import { Toaster } from "sonner";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-border bg-sidebar lg:block">
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex w-full flex-col lg:ml-64">
        {/* Topbar */}
        <AdminTopbar onMobileMenuClick={() => setMobileNavOpen(true)} />

        {/* Mobile Navigation */}
        <AdminMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        {/* Page Content */}
        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        expand={false}
        theme="light"
        className="font-[family-name:var(--font-montserrat)]"
      />
    </div>
  );
}
