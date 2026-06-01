"use client";

import { useState, useMemo } from "react";
import { AlertCircle, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminCustomers } from "@/hooks/admin/use-admin-customers";
import { AdminCustomersHeader, AdminCustomersStats, AdminCustomersTable, AdminCustomersTableSkeleton, AdminCustomersEmpty } from "@/components/admin/customers";
import type { AdminCustomerRow } from "@/components/admin/customers";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useAdminCustomers({
    page,
    limit: 20,
    search: searchQuery || undefined,
  });

  const rows: AdminCustomerRow[] = useMemo(() => {
    if (!data?.customers) return [];
    return data.customers.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      orderCount: c.orderCount,
      totalSpent: c.totalSpent,
      status: c.status as AdminCustomerRow['status'],
      lastOrderDate: c.lastOrderDate,
      createdAt: c.createdAt,
    }));
  }, [data]);

  const stats = useMemo(() => {
    if (!rows.length) return { totalCustomers: 0, activeCustomers: 0, returningCustomers: 0 };
    const active = rows.filter((c) => c.status === "RETURNING" || c.status === "VIP").length;
    const returning = rows.filter((c) => c.orderCount > 1).length;
    return {
      totalCustomers: data?.pagination?.totalCount || rows.length,
      activeCustomers: active,
      returningCustomers: returning,
    };
  }, [rows, data?.pagination?.totalCount]);

  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <AdminCustomersHeader />

      <AdminCustomersStats stats={stats} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          className="rounded-none border-border/50 pl-10 font-(family-name:--font-montserrat) text-sm focus-visible:ring-primary/20"
        />
      </div>

      {isLoading ? (
        <AdminCustomersTableSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="font-[family-name:var(--font-montserrat)] text-lg font-semibold">Failed to load customers</h3>
          <p className="mt-2 font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An unexpected error occurred.'}
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-primary/50 hover:text-primary"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      ) : rows.length > 0 ? (
        <>
          <AdminCustomersTable customers={rows} />

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <p className="font-[family-name:var(--font-montserrat)] text-xs text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-xs"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <AdminCustomersEmpty />
      )}
    </div>
  );
}