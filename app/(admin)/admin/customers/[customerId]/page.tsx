"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdminCustomer } from "@/hooks/admin/use-admin-customers";
import { ROUTES } from "@/lib/constants/routes";
import {
  AdminCustomerProfileHeader,
  AdminCustomerStats,
  AdminCustomerOrders,
  AdminCustomerActivity,
  AdminCustomerNotes,
  AdminCustomerActions,
} from "@/components/admin/customers/profile";
import { AdminOrderDetailSkeleton } from "@/components/admin/order";
import type { AdminCustomerProfile, CustomerActivity, CustomerNote } from "@/components/admin/customers/profile";

function deriveActivities(customer: { createdAt: Date | string; orders: Array<{ id: string; createdAt: Date | string; fulfillmentStatus: string }> }): CustomerActivity[] {
  const activities: CustomerActivity[] = [];

  activities.push({
    id: "act_account",
    type: "account_created",
    title: "Account Created",
    description: "Customer registered and verified email",
    date: customer.createdAt instanceof Date
      ? customer.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : String(customer.createdAt),
  });

  if (customer.orders.length > 0) {
    const firstOrder = customer.orders[customer.orders.length - 1];
    const firstOrderDate = firstOrder.createdAt instanceof Date
      ? firstOrder.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : String(firstOrder.createdAt);

    activities.push({
      id: "act_first_purchase",
      type: "first_purchase",
      title: "First Purchase",
      description: `Completed first order (${firstOrder.id})`,
      date: firstOrderDate,
    });
  }

  const latestOrder = customer.orders[0];
  if (latestOrder) {
    const latestDate = latestOrder.createdAt instanceof Date
      ? latestOrder.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : String(latestOrder.createdAt);

    if (latestOrder.fulfillmentStatus === 'SHIPPED' || latestOrder.fulfillmentStatus === 'DELIVERED') {
      activities.push({
        id: "act_order_shipped",
        type: "order_shipped",
        title: "Order Shipped",
        description: `Order ${latestOrder.id} shipped`,
        date: latestDate,
      });
    }
  }

  return activities;
}

export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;

  const { data: customer, isLoading, error } = useAdminCustomer(customerId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminOrderDetailSkeleton />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h1 className="font-[family-name:var(--font-bodoni-moda)] text-xl font-semibold">Customer Not Found</h1>
        <p className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'The customer you are looking for does not exist.'}
        </p>
        <Button
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN_CUSTOMERS)}
          className="mt-4 rounded-none border-border/50 font-[family-name:var(--font-montserrat)] text-sm hover:border-primary/50 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
        </Button>
      </div>
    );
  }

  const activities = deriveActivities(customer);

  const sampleNotes: CustomerNote[] = [];

  return (
    <div className="space-y-6">
      <AdminCustomerProfileHeader
        fullName={customer.fullName}
        email={customer.email}
        status={customer.status as AdminCustomerProfile['status']}
      />

      <Separator className="bg-border/50" />

      <AdminCustomerStats
        totalOrders={customer.orderCount}
        totalSpent={customer.totalSpent}
        lastOrderDate={customer.lastOrderDate}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminCustomerOrders orders={customer.orders} />
        </div>
        <div className="space-y-6">
          <AdminCustomerActivity activities={activities} />
          <AdminCustomerNotes notes={sampleNotes} />
          <AdminCustomerActions customerId={customerId} />
        </div>
      </div>
    </div>
  );
}