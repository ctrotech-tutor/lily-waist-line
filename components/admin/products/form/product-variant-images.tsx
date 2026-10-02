"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { toast } from "sonner";
import { uploadTempImage } from "@/server/actions/media/upload-temp-image";
import { uploadProductImage, deleteProductImage } from "@/server/actions/media/upload-product-image";
import { isAllowedImageType } from "@/lib/utils/file-validation";
import type { ProductFormData } from "./admin-product-form-shell";
import type { ProductImageEntry } from "@/types/media";

interface ProductVariantImagesProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
  disabled?: boolean;
  productId?: string;
  variantIdMap: Record<string, string>;
}

const SIZE_LABELS: Record<string, string> = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
};

export function ProductVariantImages({
  data,
  onChange,
  disabled,
  productId,
  variantIdMap,
}: ProductVariantImagesProps) {
  const [uploadingSize, setUploadingSize] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File, size: string) => {
    if (!isAllowedImageType(file.type, file.name)) {
      toast.error('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB.');
      return;
    }

    setUploadingSize(size);
    const formData = new FormData();
    formData.append('file', file);

    try {
      let result;
      if (productId && variantIdMap[size]) {
        formData.append('productId', productId);
        formData.append('variantId', variantIdMap[size]);
        formData.append('type', 'variant');
        result = await uploadProductImage(formData);
      } else {
        result = await uploadTempImage(formData);
      }

      if (result.success && result.url && result.path) {
        const newEntry: ProductImageEntry = {
          url: result.url,
          storagePath: result.path,
          imageType: 'variant',
          sortOrder: 0,
          existing: false,
        };

        const existing = data.variantImages[size];
        if (existing?.existing && existing.storagePath) {
          await deleteProductImage(existing.storagePath);
        }

        onChange("variantImages", { ...data.variantImages, [size]: newEntry });
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingSize(null);
    }
  }, [onChange, productId, variantIdMap, data.variantImages]);

  const handleRemove = useCallback(async (size: string) => {
    const existing = data.variantImages[size];
    if (existing?.existing && existing.storagePath) {
      await deleteProductImage(existing.storagePath);
    }
    const newImages = { ...data.variantImages };
    delete newImages[size];
    onChange("variantImages", newImages);
  }, [data.variantImages, onChange]);

  const visibleSizes = data.sizes.filter(s => ['S', 'M', 'L', 'XL'].includes(s));

  if (visibleSizes.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Variant Images
        </h2>
      </div>

      <p className="font-sans text-xs text-muted-foreground">
        Upload a distinct image per physical size. The same image is used across all compression levels of that size.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {visibleSizes.map((size) => (
          <VariantImageCard
            key={size}
            size={size}
            label={SIZE_LABELS[size] || size}
            image={data.variantImages[size] || null}
            isUploading={uploadingSize === size}
            disabled={disabled}
            onUpload={(file) => handleUpload(file, size)}
            onRemove={() => handleRemove(size)}
          />
        ))}
      </div>
    </div>
  );
}

interface VariantImageCardProps {
  size: string;
  label: string;
  image: ProductImageEntry | null;
  isUploading: boolean;
  disabled?: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function VariantImageCard({
  size,
  label,
  image,
  isUploading,
  disabled,
  onUpload,
  onRemove,
}: VariantImageCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    onUpload(file);
  }, [onUpload]);

  const isDisabled = disabled || isUploading;

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="aspect-square relative bg-muted/30">
        {image?.url && !isUploading ? (
          <>
            <OptimizedImage
              src={image.url}
              alt={`Size ${size}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 160px"
            />
            <button
              type="button"
              onClick={onRemove}
              disabled={isDisabled}
              className="absolute top-1 right-1 z-10"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-destructive/90 text-destructive-foreground hover:bg-destructive">
                <X className="w-3 h-3" />
              </div>
            </button>
          </>
        ) : (
          <div
            onClick={() => !isDisabled && inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={isDisabled ? undefined : handleDrop}
            className={cn(
              "w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors duration-200",
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted/50"
            )}
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
            ) : (
              <>
                <div className="w-10 h-10 flex items-center justify-center border border-border bg-muted/50">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-wider">
                  Upload
                </span>
              </>
            )}
          </div>
        )}

        {isUploading && image?.url && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="w-5 h-5 animate-spin text-secondary" />
          </div>
        )}
      </div>

      <div className="p-2 border-t border-border">
        <p className="font-sans text-xs font-semibold text-foreground text-center">
          Size {size}
        </p>
        <p className="font-sans text-[10px] text-muted-foreground text-center">
          {label}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/x-png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isDisabled}
      />
    </div>
  );
}
