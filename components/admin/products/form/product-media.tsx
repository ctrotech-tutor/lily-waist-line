"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ImagePlus, X, GripVertical, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import { toast } from "sonner";
import { uploadTempImage } from "@/server/actions/media/upload-temp-image";
import { uploadProductImage, deleteProductImage } from "@/server/actions/media/upload-product-image";
import type { ProductFormData } from "./admin-product-form-shell";
import type { ProductImageEntry } from "@/types/media";

interface ProductMediaProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: unknown) => void;
  productId?: string;
}

export function ProductMedia({ data, onChange, productId }: ProductMediaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadingIndexes, setUploadingIndexes] = useState<Set<number>>(new Set());

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Only JPEG, PNG, WebP, and GIF allowed.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: File must be less than 5MB.`);
        continue;
      }
    }

    const validFiles = fileArray.filter(f =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(f.type) &&
      f.size <= 5 * 1024 * 1024
    );

    const startIndex = data.images.length;
    const placeholders: ProductImageEntry[] = validFiles.map(() => ({
      url: '',
      storagePath: '',
      imageType: 'gallery',
      sortOrder: startIndex,
      existing: false,
    }));

    let updatedImages = [...data.images, ...placeholders];
    onChange("images", updatedImages);

    const uploading = new Set<number>();
    for (let i = 0; i < validFiles.length; i++) {
      uploading.add(startIndex + i);
    }
    setUploadingIndexes(uploading);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = startIndex + i;
      const formData = new FormData();
      formData.append('file', file);

      try {
        let result;
        if (productId) {
          formData.append('productId', productId);
          formData.append('type', 'gallery');
          result = await uploadProductImage(formData);
        } else {
          result = await uploadTempImage(formData);
        }

        if (result.success && result.url && result.path) {
          updatedImages[fileIndex] = {
            url: result.url,
            storagePath: result.path,
            imageType: fileIndex === 0 ? 'main' : 'gallery',
            sortOrder: fileIndex,
            existing: false,
          };
          onChange("images", [...updatedImages]);
        } else {
          toast.error(result.error || `Failed to upload ${file.name}`);
          updatedImages.splice(fileIndex, 1);
          onChange("images", [...updatedImages]);
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`);
        updatedImages.splice(fileIndex, 1);
        onChange("images", [...updatedImages]);
      } finally {
        setUploadingIndexes((prev) => {
          const next = new Set(prev);
          next.delete(fileIndex);
          return next;
        });
      }
    }

    if (inputRef.current) inputRef.current.value = '';
  }, [data.images, onChange, productId]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  }, [handleFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  }, [handleFiles]);

  const removeImage = useCallback(async (index: number) => {
    const image = data.images[index];
    if (!image) return;

    if (image.existing && image.storagePath) {
      const result = await deleteProductImage(image.storagePath);
      if (!result.success) {
        toast.error('Failed to delete image from storage');
      }
      if (image.id) {
        onChange("removedImageIds", [...data.removedImageIds, image.id]);
      }
    }

    const newImages = data.images.filter((_, i) => i !== index);
    onChange("images", newImages);
  }, [data.images, data.removedImageIds, onChange]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...data.images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    onChange("images", newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setIsDragging(false);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDropZoneDragLeave = () => {
    setIsDragging(false);
  };

  const isUploading = uploadingIndexes.size > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Product Media
        </h2>
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDropZoneDragOver}
        onDragLeave={handleDropZoneDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-secondary bg-secondary/5"
            : "border-border hover:border-secondary/50 hover:bg-muted/30"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-12 h-12 flex items-center justify-center border transition-colors",
            isDragging
              ? "border-secondary bg-secondary/10"
              : "border-border bg-muted/50"
          )}>
            <Upload className={cn(
              "w-5 h-5 transition-colors",
              isDragging ? "text-secondary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-foreground">
              Click to upload or drag and drop
            </p>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              PNG, JPG, WebP up to 5MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            className="mt-2 border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Select Images'}
          </Button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
      />

      {data.images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-sans text-sm font-medium text-foreground">
              {data.images.length} {data.images.length === 1 ? "Image" : "Images"}
            </p>
            <p className="font-sans text-xs text-muted-foreground">
              Drag to reorder
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.images.map((image, index) => (
              <div
                key={`${image.storagePath || image.url}-${index}`}
                draggable={!uploadingIndexes.has(index)}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-square border border-border bg-muted/30 cursor-move overflow-hidden",
                  draggedIndex === index && "opacity-50 border-secondary"
                )}
              >
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 flex items-center justify-center bg-background/60 text-foreground">
                    <GripVertical className="w-3 h-3" />
                  </div>
                </div>

                {uploadingIndexes.has(index) ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
                    <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-6 h-6 flex items-center justify-center bg-destructive/90 text-destructive-foreground hover:bg-destructive">
                        <X className="w-3 h-3" />
                      </div>
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center">
                      {image.url ? (
                        <OptimizedImage
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 160px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">IMG</span>
                        </div>
                      )}
                    </div>

                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-secondary text-foreground text-[10px] font-semibold uppercase tracking-wider py-1 text-center">
                        Main Image
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
