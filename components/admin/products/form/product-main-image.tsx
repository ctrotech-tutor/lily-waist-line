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
import type { ProductImageEntry } from "@/types/media";

interface ProductMainImageProps {
  mainImage: ProductImageEntry | null;
  onChange: (image: ProductImageEntry | null) => void;
  productId?: string;
  disabled?: boolean;
}

export function ProductMainImage({ mainImage, onChange, productId, disabled }: ProductMainImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isDisabled = disabled || isUploading;

  const handleUpload = useCallback(async (file: File) => {
    if (disabled) return;
    if (!isAllowedImageType(file.type, file.name)) {
      toast.error('Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      let result;
      if (productId) {
        formData.append('productId', productId);
        formData.append('type', 'main');
        result = await uploadProductImage(formData);
      } else {
        result = await uploadTempImage(formData);
      }

      if (result.success && result.url && result.path) {
        const newEntry: ProductImageEntry = {
          url: result.url,
          storagePath: result.path,
          imageType: 'main',
          sortOrder: 0,
          existing: false,
        };

        if (mainImage?.existing && mainImage.storagePath && mainImage.id) {
          await deleteProductImage(mainImage.storagePath);
          onChange(newEntry);
        } else {
          onChange(newEntry);
        }
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, productId, mainImage, disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;
    handleUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [handleUpload, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleUpload(file);
  }, [handleUpload, disabled]);

  const handleRemove = useCallback(async () => {
    if (disabled) return;
    if (mainImage?.existing && mainImage.storagePath && mainImage.id) {
      await deleteProductImage(mainImage.storagePath);
    }
    onChange(null);
  }, [mainImage, onChange, disabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Main Image
        </h2>
      </div>

      {mainImage?.url ? (
        <div className="space-y-3">
          <div className="relative w-full max-w-sm mx-auto aspect-4/5 border border-border bg-muted/30 overflow-hidden">
            <OptimizedImage
              src={mainImage.url}
              alt="Main product image"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isDisabled}
              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-7 h-7 flex items-center justify-center bg-destructive/90 text-destructive-foreground hover:bg-destructive">
                <X className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDisabled}
              onClick={() => inputRef.current?.click()}
              className="border-secondary/50 text-secondary hover:bg-secondary/10"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Replace Image
            </Button>
          </div>

          <p className="text-center font-sans text-xs text-muted-foreground">
            Used on product cards, shop page, and product detail page
          </p>
        </div>
      ) : (
        <div
          onClick={() => !isDisabled && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={isDisabled ? undefined : handleDrop}
          className={cn(
            "border-2 border-dashed p-8 text-center transition-all duration-200 max-w-sm mx-auto",
            isDisabled
              ? "opacity-50 cursor-not-allowed border-border"
              : "cursor-pointer border-border hover:border-secondary/50 hover:bg-muted/30"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center border border-border bg-muted/50">
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-secondary" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-foreground">
                {isUploading ? 'Uploading...' : 'Upload main product image'}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP up to 5MB
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDisabled}
              className="mt-2 border-secondary/50 text-secondary hover:bg-secondary/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/x-png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
