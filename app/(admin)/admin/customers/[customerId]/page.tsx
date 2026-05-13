import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  AdminCustomerProfileHeader,
  AdminCustomerStats,
  AdminCustomerOrders,
  AdminCustomerActivity,
  AdminCustomerNotes,
  AdminCustomerActions,
  mockCustomerProfile,
} from "@/components/admin/customers/profile";

interface CustomerProfilePageProps {
  params: Promise<{ customerId: string }>;
}

export default async function CustomerProfilePage({
  params,
}: CustomerProfilePageProps) {
  const { customerId } = await params;

  // For demo purposes, we show the mock profile for any ID
  // In production, this would fetch the actual customer
  if (!customerId) {
    notFound();
  }

  const customer = mockCustomerProfile;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <AdminCustomerProfileHeader
        name={customer.name}
        email={customer.email}
        status={customer.status}
      />

      <Separator className="bg-border/50" />

      {/* Stats */}
      <AdminCustomerStats
        totalOrders={customer.totalOrders}
        totalSpent={customer.totalSpent}
        lastOrderDate={customer.lastOrderDate}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Orders */}
        <div className="lg:col-span-2">
          <AdminCustomerOrders orders={customer.orders} />
        </div>

        {/* Right Column - Activity, Notes, Actions */}
        <div className="space-y-6">
          <AdminCustomerActivity activities={customer.activities} />
          <AdminCustomerNotes notes={customer.notes} />
          <AdminCustomerActions customerId={customerId} />
        </div>
      </div>
    </div>
  );
}
