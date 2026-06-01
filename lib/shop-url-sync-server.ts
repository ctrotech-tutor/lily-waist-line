// Server-side utilities for URL parameter management
// This file contains only server-safe code (no client hooks)

import type { ShopSearchParams } from '@/types/shop'

// Re-export for backward compatibility
export type { ShopSearchParams }

// Utility functions for URL parameter management
export function createQueryString(params: Record<string, string | string[] | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => {
          if (v && v !== '') searchParams.append(key, v);
        });
      } else {
        searchParams.set(key, value.toString());
      }
    } else {
      searchParams.delete(key);
    }
  });
  
  return searchParams.toString();
}

// Server-side utility to parse search params
export function parseShopSearchParams(searchParams: URLSearchParams | Record<string, string | string[]>): ShopSearchParams {
  // Handle both URLSearchParams and plain object cases
  const getParam = (key: string): string | undefined => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) || undefined;
    } else {
      const value = searchParams[key];
      if (Array.isArray(value)) {
        return value[0];
      }
      return value || undefined;
    }
  };

  return {
    q: getParam('q'),
    size: getParam('size'),
    compression: getParam('compression'),
    availability: getParam('availability'),
    sort: getParam('sort'),
  };
}
