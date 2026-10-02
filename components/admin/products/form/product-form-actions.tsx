"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
  onCancel: () => void;
  canSave?: boolean;
  className?: string;
}

export function ProductFormActions({
  isSubmitting,
  isEditMode,
  onCancel,
  canSave = true,
  className,
}: ProductFormActionsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
      {/* Save Button */}
      <Button
        type="submit"
        disabled={isSubmitting || !canSave}
        className="flex-1 sm:flex-none sm:min-w-[200px] bg-secondary text-foreground hover:bg-secondary/90 text-xs uppercase tracking-wider py-3 h-auto transition-all duration-300 flex justify-center items-center gap-2 font-semibold"
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
        className="flex-1 sm:flex-none sm:min-w-[140px] text-xs uppercase tracking-wider py-3 h-auto border-border hover:border-secondary hover:text-secondary transition-colors font-semibold"
      >
        <X className="w-4 h-4 mr-2" />
        Cancel
      </Button>

    </div>
  );
}
