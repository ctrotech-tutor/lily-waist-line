export type CustomerStatus = "NEW" | "RETURNING" | "VIP";

export interface AdminCustomerRow {
  id: string
  fullName: string
  email: string
  phone: string | null
  orderCount: number
  totalSpent: number
  status: CustomerStatus
  lastOrderDate: Date | null
  createdAt: Date
}

export interface AdminCustomerOrder {
  id: string
  createdAt: Date
  fulfillmentStatus: string
  total: number
  itemCount: number
}

export interface AdminCustomerProfile {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  orderCount: number
  totalSpent: number
  status: CustomerStatus
  lastOrderDate: Date | null
  createdAt: Date
  orders: AdminCustomerOrder[]
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}