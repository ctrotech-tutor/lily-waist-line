export { AdminCustomersHeader } from "./admin-customers-header";
export { AdminCustomersStats } from "./admin-customers-stats";
export { AdminCustomersTable } from "./admin-customers-table";
export { AdminCustomersEmpty } from "./admin-customers-empty";
export { mockCustomers, type Customer, type CustomerStatus } from "./data";

// Profile components
export {
  AdminCustomerProfileHeader,
  AdminCustomerStats,
  AdminCustomerOrders,
  AdminCustomerActivity,
  AdminCustomerNotes,
  AdminCustomerActions,
  mockCustomerProfile,
  formatCurrency,
} from "./profile";
export type {
  CustomerOrder,
  CustomerActivity,
  CustomerNote,
  CustomerProfile,
} from "./profile";
