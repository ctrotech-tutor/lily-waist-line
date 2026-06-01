"use client";

import { cn } from "@/lib/utils";
import { Type, AlignLeft, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductBasicInfoProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string | string[]) => void;
  errors?: Record<string, string>;
}

// Form field with floating label pattern
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  multiline?: boolean;
  rows?: number;
}

function FloatingField({
  id,
  label,
  type = "text",
  required = false,
  value,
  placeholder,
  onChange,
  error,
  multiline = false,
  rows = 4,
}: FloatingFieldProps) {
  return (
    <div className="relative w-full group">
      {multiline ? (
        <Textarea
          id={id}
          name={id}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || " "}
          rows={rows}
          className={cn(
            "peer w-full border-0 border-b border-border bg-transparent py-3 px-0 rounded-none resize-none",
            "focus-visible:border-secondary focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder-transparent transition-colors text-sm",
            "text-foreground",
            "min-h-[120px]",
            error && "border-destructive focus-visible:border-destructive"
          )}
        />
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || " "}
          className={cn(
            "peer w-full border-0 border-b border-border bg-transparent py-3 px-0 rounded-none h-auto",
            "focus-visible:border-secondary focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder-transparent transition-colors text-sm",
            "text-foreground",
            error && "border-destructive focus-visible:border-destructive"
          )}
        />
      )}
      <Label
        htmlFor={id}
        className={cn(
          "absolute left-0 top-3 -translate-y-6 text-xs text-muted-foreground uppercase tracking-widest transition-all",
          "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted-foreground/70",
          "peer-focus:-translate-y-6 peer-focus:text-xs peer-focus:text-secondary peer-focus:uppercase peer-focus:tracking-widest",
          required && "after:content-['*'] after:ml-1 after:text-destructive",
          "cursor-text font-sans font-semibold pointer-events-none"
        )}
      >
        {label}
      </Label>
      {/* Bottom border highlight on focus */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-secondary transition-all duration-300 peer-focus:w-full" />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

export function ProductBasicInfo({ data, onChange, errors }: ProductBasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Basic Information
        </h2>
      </div>

      <div className="space-y-6">
        {/* Product Name */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <Type className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <FloatingField
              id="productName"
              label="Product Name"
              required
              value={data.name}
              onChange={(value) => onChange("name", value)}
              error={errors?.name}
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <AlignLeft className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <FloatingField
              id="shortDescription"
              label="Short Description"
              value={data.shortDescription}
              onChange={(value) => onChange("shortDescription", value)}
              placeholder="Brief tagline for product cards"
            />
            <p className="text-xs text-muted-foreground mt-2">
              A short description that appears on product cards and listings.
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-3">
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <FloatingField
              id="fullDescription"
              label="Full Description"
              value={data.fullDescription}
              onChange={(value) => onChange("fullDescription", value)}
              multiline
              rows={6}
              placeholder="Detailed product description with benefits and features"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Comprehensive description displayed on the product detail page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
