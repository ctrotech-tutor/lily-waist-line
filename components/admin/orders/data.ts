export type PaymentStatus = "pending_payment" | "paid" | "failed";
export type FulfillmentStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  date: string;
  itemCount: number;
}

export const mockOrders: AdminOrder[] = [
  {
    id: "LWL-2026-001",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    amount: 149.99,
    paymentStatus: "pending_payment",
    fulfillmentStatus: "processing",
    date: "2026-05-11",
    itemCount: 2,
  },
  {
    id: "LWL-2026-002",
    customerName: "Emily Davis",
    customerEmail: "emily.davis@email.com",
    amount: 89.50,
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    date: "2026-05-10",
    itemCount: 1,
  },
  {
    id: "LWL-2026-003",
    customerName: "Maria Garcia",
    customerEmail: "maria.g@email.com",
    amount: 234.00,
    paymentStatus: "paid",
    fulfillmentStatus: "delivered",
    date: "2026-05-09",
    itemCount: 3,
  },
  {
    id: "LWL-2026-004",
    customerName: "Jessica Wilson",
    customerEmail: "jessica.w@email.com",
    amount: 67.99,
    paymentStatus: "paid",
    fulfillmentStatus: "processing",
    date: "2026-05-09",
    itemCount: 1,
  },
  {
    id: "LWL-2026-005",
    customerName: "Amanda Brown",
    customerEmail: "amanda.brown@email.com",
    amount: 189.00,
    paymentStatus: "pending_payment",
    fulfillmentStatus: "processing",
    date: "2026-05-08",
    itemCount: 2,
  },
  {
    id: "LWL-2026-006",
    customerName: "Jennifer Lee",
    customerEmail: "jlee@email.com",
    amount: 299.99,
    paymentStatus: "failed",
    fulfillmentStatus: "cancelled",
    date: "2026-05-08",
    itemCount: 4,
  },
  {
    id: "LWL-2026-007",
    customerName: "Rachel Taylor",
    customerEmail: "rachel.t@email.com",
    amount: 156.50,
    paymentStatus: "paid",
    fulfillmentStatus: "shipped",
    date: "2026-05-07",
    itemCount: 2,
  },
  {
    id: "LWL-2026-008",
    customerName: "Michelle Chen",
    customerEmail: "michelle.chen@email.com",
    amount: 78.00,
    paymentStatus: "pending_payment",
    fulfillmentStatus: "processing",
    date: "2026-05-07",
    itemCount: 1,
  },
];
