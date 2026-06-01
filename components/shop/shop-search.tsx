"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Search, X } from "lucide-react";

import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";

export interface ShopSearchProps {
  className?: string;
  placeholder?: string;
}

export const ShopSearch = memo(function ShopSearch({
  className,
  placeholder = "Search products...",
}: ShopSearchProps) {
  const { currentParams, updateParams } = useShopURLSync();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inputValue, setInputValue] = useState(currentParams.q || "");

  useEffect(() => {
    setInputValue(currentParams.q || "");
  }, [currentParams.q]);

  const debouncedUpdate = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateParams({ q: value.trim() || undefined });
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedUpdate(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    updateParams({ q: inputValue.trim() || undefined });
  };

  const handleClear = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    setInputValue("");
    updateParams({ q: undefined });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex w-full gap-3", className)}
    >
      <div className="flex-1">
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search className="h-4 w-4" />
          </InputGroupAddon>
          <InputGroupInput
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
          />
          {inputValue && (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="button"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </InputGroupButton>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>

      <Button
        type="submit"
        className="px-6 shrink-0 font-medium"
      >
        Search
      </Button>
    </form>
  );
});

export default ShopSearch;