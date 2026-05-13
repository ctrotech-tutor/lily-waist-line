import type { Customer, CustomerStatus } from "../data";

export interface CustomerOrder {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  itemCount: number;
}

export interface CustomerActivity {
  id: string;
  type: "account_created" | "first_purchase" | "payment_completed" | "order_shipped";
  title: string;
  description: string;
  date: string;
}

export interface CustomerNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface CustomerProfile extends Customer {
  phone?: string;
  joinedDate: string;
  orders: CustomerOrder[];
  activities: CustomerActivity[];
  notes: CustomerNote[];
}

export const mockCustomerProfile: CustomerProfile = {
  id: "cust_003",
  name: "Emily Williams",
  email: "emily.w@email.com",
  phone: "+1 (555) 123-4567",
  totalOrders: 8,
  totalSpent: 1245.0,
  status: "vip" as CustomerStatus,
  lastOrderDate: "May 9, 2026",
  joinedDate: "January 15, 2026",
  orders: [
    {
      id: "LWL-2026-003",
      date: "May 9, 2026",
      status: "delivered",
      total: 234.0,
      itemCount: 3,
    },
    {
      id: "LWL-2026-015",
      date: "April 28, 2026",
      status: "delivered",
      total: 189.99,
      itemCount: 2,
    },
    {
      id: "LWL-2026-012",
      date: "April 15, 2026",
      status: "delivered",
      total: 156.5,
      itemCount: 2,
    },
    {
      id: "LWL-2026-008",
      date: "March 22, 2026",
      status: "shipped",
      total: 245.0,
      itemCount: 3,
    },
    {
      id: "LWL-2026-005",
      date: "February 18, 2026",
      status: "delivered",
      total: 128.0,
      itemCount: 1,
    },
  ],
  activities: [
    {
      id: "act_001",
      type: "account_created",
      title: "Account Created",
      description: "Customer registered and verified email",
      date: "January 15, 2026",
    },
    {
      id: "act_002",
      type: "first_purchase",
      title: "First Purchase",
      description: "Completed first order (LWL-2026-001)",
      date: "January 20, 2026",
    },
    {
      id: "act_003",
      type: "payment_completed",
      title: "Payment Verified",
      description: "Payment confirmed via Cash App",
      date: "January 20, 2026",
    },
    {
      id: "act_004",
      type: "order_shipped",
      title: "Order Shipped",
      description: "First order shipped via USPS",
      date: "January 22, 2026",
    },
  ],
  notes: [
    {
      id: "note_001",
      content: "Prefers high compression waist trainers",
      createdAt: "2026-02-10",
    },
    {
      id: "note_002",
      content: "Frequent buyer - consider for early access program",
      createdAt: "2026-04-15",
    },
  ],
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
