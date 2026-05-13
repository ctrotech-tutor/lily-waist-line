"use client";

import { useState, useRef, useEffect } from "react";
import { useShopURLSync } from "@/lib/shop-url-sync-client";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export interface ShopSearchProps {
  className?: string;
  placeholder?: string;
}

export function ShopSearch({ 
  className, 
  placeholder = "Search products..." 
}: ShopSearchProps) {
  const { currentParams, updateParams } = useShopURLSync();
  const [inputValue, setInputValue] = useState(currentParams.q || "");
  // Track last submitted value to avoid unnecessary updates
  const lastSubmittedValue = useRef(currentParams.q || "");

  const prevQRef = useRef(currentParams.q);
  
  // Update input when URL changes from external sources (e.g., browser back/forward, clear filters)
  useEffect(() => {
    // Check if q actually changed
    if (prevQRef.current === currentParams.q) return;
    prevQRef.current = currentParams.q;
    
    const urlValue = currentParams.q || "";
    if (urlValue !== inputValue) {
      // Use microtask to avoid synchronous setState in effect body
      queueMicrotask(() => {
        setInputValue(urlValue);
        lastSubmittedValue.current = urlValue;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParams.q]);

  // Debounced search update - only when input differs from last submitted
  useEffect(() => {
    const trimmedInput = inputValue.trim();
    const lastSubmitted = lastSubmittedValue.current.trim();

    // Skip if values are the same (prevents loops)
    if (trimmedInput === lastSubmitted) return;

    const timer = setTimeout(() => {
      lastSubmittedValue.current = inputValue;
      updateParams({ q: trimmedInput || undefined });
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: inputValue || undefined });
  };
  
  const handleClear = () => {
    setInputValue("");
    updateParams({ q: undefined });
  };
  
  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      
      {/* Input */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-11 pr-11 py-3",
          "bg-transparent border border-border",
          "font-sans text-sm text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0",
          "hover:border-[#d4af37]/50 transition-colors duration-200",
          "focus:border-[#d4af37]/50"
        )}
      />
      
      {/* Clear Button */}
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
    </form>
  );
}

export default ShopSearch;
