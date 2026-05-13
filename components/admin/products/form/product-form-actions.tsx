"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  className?: string;
}

export function ProductFormActions({
  isSubmitting,
  isEditMode,
  onCancel,
  className,
}: ProductFormActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {/* Save Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 sm:flex-none sm:min-w-[200px] bg-[#d4af37] text-black hover:bg-[#d4af37]/90 text-xs uppercase tracking-wider py-3 h-auto rounded-none transition-all duration-300 flex justify-center items-center gap-2 font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            {isEditMode ? "Update Product" : "Save Product"}
          </>
        )}
      </Button>

      {/* Cancel Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex-1 sm:flex-none sm:min-w-[140px] text-xs uppercase tracking-wider py-3 h-auto rounded-none border-border hover:border-[#d4af37] hover:text-[#d4af37] transition-colors font-semibold"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>

      {/* Status indicator */}
      <div className="hidden sm:flex items-center gap-2 ml-auto text-xs text-muted-foreground">
        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
        UI Demo Mode - No data persistence
      </div>
    </div>
  );
}
