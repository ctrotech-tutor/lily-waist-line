// Admin Action Simulation System
// Provides loading states and success feedback for all admin actions

import { toast } from "sonner";

export interface AdminActionOptions {
  successMessage?: string;
  loadingMessage?: string;
  duration?: number;
}

export async function simulateAdminAction<T>(
  action: () => Promise<T> | T,
  options: AdminActionOptions = {}
): Promise<T> {
  const {
    successMessage = "Action completed successfully",
    loadingMessage = "Processing...",
    duration = 1000,
  } = options;

  // Show loading toast
  const loadingId = toast.loading(loadingMessage);

  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, duration));
    
    // Execute the action
    const result = await action();
    
    // Show success toast
    toast.success(successMessage, { id: loadingId });
    
    return result;
  } catch (error) {
    // Show error toast
    toast.error("Action failed. Please try again.", { id: loadingId });
    throw error;
  }
}

// Permission Simulation Layer (UI Only)
export type AdminRole = "admin" | "viewer";

export interface AdminPermissions {
  canViewOrders: boolean;
  canEditOrders: boolean;
  canDeleteOrders: boolean;
  canViewProducts: boolean;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canViewCustomers: boolean;
  canEditCustomers: boolean;
  canDeleteCustomers: boolean;
  canViewShipping: boolean;
  canEditShipping: boolean;
  canViewSettings: boolean;
  canEditSettings: boolean;
}

export const rolePermissions: Record<AdminRole, AdminPermissions> = {
  admin: {
    canViewOrders: true,
    canEditOrders: true,
    canDeleteOrders: true,
    canViewProducts: true,
    canEditProducts: true,
    canDeleteProducts: true,
    canViewCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: true,
    canViewShipping: true,
    canEditShipping: true,
    canViewSettings: true,
    canEditSettings: true,
  },
  viewer: {
    canViewOrders: true,
    canEditOrders: false,
    canDeleteOrders: false,
    canViewProducts: true,
    canEditProducts: false,
    canDeleteProducts: false,
    canViewCustomers: true,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewShipping: true,
    canEditShipping: false,
    canViewSettings: true,
    canEditSettings: false,
  },
};

// Mock current admin role (in real app, this would come from auth)
export let currentAdminRole: AdminRole = "admin";

export function setCurrentAdminRole(role: AdminRole) {
  currentAdminRole = role;
}

export function getCurrentPermissions(): AdminPermissions {
  return rolePermissions[currentAdminRole];
}

export function hasPermission(permission: keyof AdminPermissions): boolean {
  const permissions = getCurrentPermissions();
  return permissions[permission];
}

// Action wrappers with permission checks
export function withPermissionCheck<T extends unknown[], R>(
  permission: keyof AdminPermissions,
  action: (...args: T) => R
) {
  return (...args: T): R => {
    if (!hasPermission(permission)) {
      toast.error("You don't have permission to perform this action.");
      throw new Error("Insufficient permissions");
    }
    return action(...args);
  };
}
