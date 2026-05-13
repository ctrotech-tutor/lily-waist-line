"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AdminCustomersHeader,
  AdminCustomersStats,
  AdminCustomersTable,
  AdminCustomersEmpty,
  mockCustomers,
  type Customer,
} from "@/components/admin/customers";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers] = useState<Customer[]>(mockCustomers);

  // Calculate stats from mock data
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
      (c) => c.status === "returning" || c.status === "vip"
    ).length;
    const returningCustomers = customers.filter(
      (c) => c.totalOrders > 1
    ).length;

    return {
      totalCustomers,
      activeCustomers,
      returningCustomers,
    };
  }, [customers]);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      <AdminCustomersHeader />

      {/* Stats Bar */}
      <AdminCustomersStats stats={stats} />

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-none border-border/50 pl-10 font-(family-name:--font-montserrat) text-sm focus-visible:ring-[#d4af37]/20"
        />
      </div>

      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <AdminCustomersTable customers={filteredCustomers} />
      ) : (
        <AdminCustomersEmpty />
      )}
    </div>
  );
}
