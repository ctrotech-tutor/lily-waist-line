import type { AdminCustomerProfile } from "../data";

export type { AdminCustomerProfile };

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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}