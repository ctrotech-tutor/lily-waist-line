"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ShopSearchProps {
  className?: string;
  placeholder?: string;
}

export function ShopSearch({
  className,
  placeholder = "Search products...",
}: ShopSearchProps) {
  const { currentParams, updateParams } = useShopURLSync();

  const [inputValue, setInputValue] = useState(
    currentParams.q || ""
  );

  const lastSubmittedValue = useRef(
    currentParams.q || ""
  );

  const prevQRef = useRef(currentParams.q);

  // Sync from URL changes
  useEffect(() => {
    if (prevQRef.current === currentParams.q) return;

    prevQRef.current = currentParams.q;

    const urlValue = currentParams.q || "";

    if (urlValue !== inputValue) {
      queueMicrotask(() => {
        setInputValue(urlValue);
        lastSubmittedValue.current = urlValue;
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParams.q]);

  // Debounced URL updates
  useEffect(() => {
    const trimmedInput = inputValue.trim();
    const lastSubmitted =
      lastSubmittedValue.current.trim();

    if (trimmedInput === lastSubmitted) return;

    const timer = setTimeout(() => {
      lastSubmittedValue.current = inputValue;

      updateParams({
        q: trimmedInput || undefined,
      });
    }, 300);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    updateParams({
      q: inputValue.trim() || undefined,
    });
  };

  const handleClear = () => {
    setInputValue("");

    lastSubmittedValue.current = "";

    updateParams({
      q: undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full gap-3",
        className
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          placeholder={placeholder}
          className={cn(
            "h-12 rounded-full pl-11 pr-11",
            "border-border/50",
            "bg-card/40 backdrop-blur-sm",
            "focus-visible:ring-primary/30",
            "focus-visible:border-primary/40"
          )}
        />

        {/* Clear */}
        {inputValue && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleClear}
            className={cn(
              "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2",
              "rounded-full"
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Submit */}
      <Button
        type="submit"
        className={cn(
          "h-12 rounded-full px-6 shrink-0",
          "font-medium"
        )}
      >
        Search
      </Button>
    </form>
  );
}

export default ShopSearch;