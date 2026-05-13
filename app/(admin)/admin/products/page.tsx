"use client";

import { useState, useMemo } from "react";
import {
  AdminProductsHeader,
  AdminProductsControls,
  AdminProductsTable,
  AdminProductsEmpty,
  mockAdminProducts,
  type FilterStockStatus,
  type AdminProduct,
} from "@/components/admin/products";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<FilterStockStatus>("all");
  const [products, setProducts] = useState(mockAdminProducts);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

      // Stock filter
      let matchesStock = true;
      if (stockFilter !== "all") {
        matchesStock = product.stockStatus === stockFilter;
      }

      return matchesSearch && matchesStock;
    });
  }, [products, searchQuery, stockFilter]);

  const handleDeleteProduct = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const handleToggleVisibility = (productId: string, isVisible: boolean) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, isVisible } : product
      )
    );
  };

  return (
    <div className="space-y-6">
      <AdminProductsHeader />

      <AdminProductsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
      />

      {filteredProducts.length > 0 ? (
        <AdminProductsTable
          products={filteredProducts}
          onDeleteProduct={handleDeleteProduct}
          onToggleVisibility={handleToggleVisibility}
        />
      ) : (
        <AdminProductsEmpty searchQuery={searchQuery} />
      )}
    </div>
  );
}
