"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ROUTE_BUILDERS } from "@/lib/constants/routes";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  images: { url: string }[];
}

export function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { getProducts } = await import("@/server/actions/products");
      const res = await getProducts({
        search: value,
        limit: 6,
        offset: 0,
      });
      if (res.success) {
        setResults(res.data.products);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = (id: string, slug: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(ROUTE_BUILDERS.product(id, slug));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
        aria-label="Search products"
      >
        <Search className="h-4 w-4" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? "Searching..." : "No products found."}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Products">
              {results.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product.id, product.slug)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-card">
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ${Number(product.basePrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
