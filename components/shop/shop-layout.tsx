"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ShopFilters } from "./shop-filters";
import { ShopSort } from "./shop-sort";
import { ShopSearch } from "./shop-search";
import { MobileFilterDrawer, MobileFilterTrigger } from "./mobile-filter-drawer";
import { ProductGrid } from "./product-grid";
import { ActiveFilters } from "./active-filters";
import { ShopSearchParams } from "@/lib/shop-url-sync-server";

interface ShopLayoutProps {
  children?: ReactNode;
  sidebarContent?: ReactNode;
  showFilters?: boolean;
  showSort?: boolean;
  searchParams?: ShopSearchParams;
}

export function ShopLayout({
  children,
  sidebarContent,
  showFilters = true,
  showSort = true,
  searchParams,
}: ShopLayoutProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeMobileFilters, setActiveMobileFilters] = useState(0);

  const handleMobileFiltersChange = (filters: Record<string, string[]>) => {
    const count = Object.values(filters).reduce((acc, vals) => acc + vals.length, 0);
    setActiveMobileFilters(count);
  };

  return (
    <div className="relative w-full min-h-screen bg-background">
      {/* Main Layout Container */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
        <div className="py-8 md:py-12">
          {/* Responsive Grid Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Sidebar - Filters Area */}
            <aside
              className={cn(
                "w-full lg:w-64 xl:w-72 shrink-0",
                "hidden lg:block"
              )}
            >
              <div className="sticky top-24">
                {sidebarContent ? (
                  sidebarContent
                ) : showFilters ? (
                  <ShopFilters searchParams={searchParams} />
                ) : null}
              </div>
            </aside>

            {/* Right Content - Products Area */}
            <main className="flex-1 min-w-0">
              {children ? (
                children
              ) : (
                /* Products Grid */
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="w-full">
                    <ShopSearch />
                  </div>

                  {/* Grid Header with Sort */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary" />
                      <span className="font-sans text-sm font-medium text-foreground">
                        Products
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <ActiveFilters searchParams={searchParams} />
                      {showSort && <ShopSort searchParams={searchParams} />}
                    </div>
                  </div>

                  {/* Product Grid */}
                  <ProductGrid
                    searchParams={searchParams}
                  />
                </div>
              )}

              {/* Footer */}
              {/* <div className="mt-16 pt-8 border-t border-border/30">
                <Footer />
              </div> */}
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle - Visible only on mobile */}
      {showFilters && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50">
          <MobileFilterTrigger
            onClick={() => setMobileFiltersOpen(true)}
            activeFilterCount={activeMobileFilters}
          />
        </div>
      )}

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        onFiltersChange={handleMobileFiltersChange}
        searchParams={searchParams}
      />
    </div>
  );
}

export default ShopLayout;
