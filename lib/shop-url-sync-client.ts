"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { ShopSearchParams } from './shop-url-sync-server';

// Utility functions for URL parameter management (client version)
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

// Hook for managing shop URL state
export function useShopURLSync() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current URL parameters - memoized to prevent unnecessary re-renders
  const currentParams = useMemo<ShopSearchParams>(() => ({
    q: searchParams.get('q') || undefined,
    size: searchParams.get('size') || undefined,
    compression: searchParams.get('compression') || undefined,
    sort: searchParams.get('sort') || undefined,
  }), [searchParams]);

  // Update URL parameters - stabilized with useCallback
  const updateParams = useCallback((updates: Partial<ShopSearchParams>) => {
    const newParams = { ...currentParams, ...updates };
    const queryString = createQueryString(newParams);
    const newURL = `/shop${queryString ? `?${queryString}` : ''}`;

    // Use replace to avoid cluttering browser history
    router.replace(newURL, { scroll: false });
  }, [router, currentParams]);

  // Clear all filters - stabilized with useCallback
  const clearFilters = useCallback(() => {
    const newParams = {
      q: undefined,
      size: undefined,
      compression: undefined,
      sort: currentParams.sort, // Preserve sort when clearing filters
    };
    const queryString = createQueryString(newParams);
    const newURL = `/shop${queryString ? `?${queryString}` : ''}`;

    router.replace(newURL, { scroll: false });
  }, [router, currentParams.sort]);

  return {
    currentParams,
    updateParams,
    clearFilters,
  };
}
