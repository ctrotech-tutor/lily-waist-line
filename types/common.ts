/**
 * Common types shared across multiple domains
 */

// Stock state enum used across product cards, wishlist items, etc.
export type StockState = "in-stock" | "low-stock" | "out-of-stock";

// Common error structure
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Common pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Common API response structure
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// Common loading states
export type LoadingState = "idle" | "loading" | "success" | "error";