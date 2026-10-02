"use client";

import { useState, useCallback } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { AdminMobileNav } from "./admin-mobile-nav";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin-sidebar-collapsed") === "true";
    }
    return false;
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen overflow-hidden border-r border-border bg-sidebar transition-[width] duration-300 ease-in-out lg:block ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex w-full flex-col overflow-hidden transition-[margin] duration-300 ease-in-out ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Topbar */}
        <AdminTopbar onMobileMenuClick={() => setMobileNavOpen(true)} onToggleSidebar={handleToggleSidebar} />

        {/* Mobile Navigation */}
        <AdminMobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}