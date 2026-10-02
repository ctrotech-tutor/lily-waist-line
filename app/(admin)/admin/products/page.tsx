"use client";

import { useState, useMemo } from "react";
import {
  AdminProductsHeader,
  AdminProductsControls,
  AdminProductsTable,
  AdminProductsEmpty,
  type FilterStockStatus,
  type AdminProduct,
} from "@/components/admin/products";
import { useAdminProducts, useDeleteProduct, useToggleProductStatus } from "@/hooks/admin/use-admin-products";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<FilterStockStatus>("all");
  const [page, setPage] = useState(1);

  const stockFilterMap: Record<string, 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | undefined> = {
    all: undefined,
    'in-stock': 'IN_STOCK',
    'low-stock': 'LOW_STOCK',
    'out-of-stock': 'OUT_OF_STOCK',
  }

  const { data, isLoading } = useAdminProducts({
    page,
    limit: 20,
    search: searchQuery || undefined,
    stockFilter: stockFilter !== 'all' ? stockFilterMap[stockFilter] : undefined,
  });

  const deleteProduct = useDeleteProduct()
  const toggleStatus = useToggleProductStatus()

  const products: AdminProduct[] = useMemo(() => {
    return (data?.products || []) as AdminProduct[]
  }, [data])

  const handleDeleteProduct = (productId: string) => {
    deleteProduct.mutate(productId)
  }

  const handleToggleStatus = (productId: string, status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED') => {
    toggleStatus.mutate({ productId, status })
  }

  return (
    <div className="space-y-6">
      <AdminProductsHeader />

      <AdminProductsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      {isLoading ? (
        <div className="overflow-x-auto border border-border/50 rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-4 w-[80px]"><div className="h-3 w-12 bg-muted rounded animate-pulse" /></th>
                <th className="p-4"><div className="h-3 w-24 bg-muted rounded animate-pulse" /></th>
                <th className="p-4"><div className="h-3 w-16 bg-muted rounded animate-pulse" /></th>
                <th className="p-4"><div className="h-3 w-12 bg-muted rounded animate-pulse" /></th>
                <th className="p-4"><div className="h-3 w-14 bg-muted rounded animate-pulse" /></th>
                <th className="p-4"><div className="h-3 w-16 bg-muted rounded animate-pulse" /></th>
                <th className="p-4 text-right"><div className="h-3 w-12 bg-muted rounded animate-pulse ml-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, row) => (
                <tr key={row} className="border-t border-border/50">
                  <td className="p-4 w-[80px]"><div className="h-10 w-10 bg-muted rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 w-32 bg-muted rounded animate-pulse" /><div className="h-3 w-20 bg-muted rounded animate-pulse mt-2" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-4 w-12 bg-muted rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-5 w-14 bg-muted rounded animate-pulse" /></td>
                  <td className="p-4"><div className="h-5 w-16 bg-muted rounded animate-pulse" /></td>
                  <td className="p-4 text-right"><div className="h-8 w-8 bg-muted rounded animate-pulse ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : products.length > 0 ? (
        <>
          <AdminProductsTable
            products={products}
            onDeleteProduct={handleDeleteProduct}
            onToggleStatus={handleToggleStatus}
          />

          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPreviousPage}
                className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground">
                Page {data.pagination.currentPage} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={!data.pagination.hasNextPage}
                className="font-[family-name:var(--font-montserrat)] text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <AdminProductsEmpty searchQuery={searchQuery} />
      )}
    </div>
  );
}
