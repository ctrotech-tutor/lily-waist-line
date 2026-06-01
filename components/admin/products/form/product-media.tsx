"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ImagePlus, X, GripVertical, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/shared/optimized-image";
import type { ProductFormData } from "./admin-product-form-shell";

interface ProductMediaProps {
  data: ProductFormData;
  onChange: (field: keyof ProductFormData, value: string[]) => void;
}

// Mock images for demonstration
const MOCK_IMAGES = [
  "/img-1.png",
  "/img-p-1.png",
  "/auth-1.png",
];

export function ProductMedia({ data, onChange }: ProductMediaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Simulate file upload (UI only)
  const handleFileSelect = useCallback(() => {
    // In a real implementation, this would open a file picker
    // For now, we'll add a mock image
    const randomMock = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    onChange("images", [...data.images, randomMock]);
  }, [data.images, onChange]);

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    onChange("images", newImages);
  };

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate drop - add mock image
    const randomMock = MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
    onChange("images", [...data.images, randomMock]);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/50">
        <div className="w-1.5 h-1.5 bg-secondary" />
        <h2 className="font-sans text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
          Product Media
        </h2>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={handleFileSelect}
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
              PNG, JPG up to 10MB (UI Demo Only)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 border-secondary/50 text-secondary hover:bg-secondary/10"
          >
            <ImagePlus className="w-4 h-4 mr-2" />
            Select Images
          </Button>
        </div>
      </div>

      {/* Image Grid */}
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
                key={`${image}-${index}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative group aspect-square border border-border bg-muted/30 cursor-move overflow-hidden",
                  draggedIndex === index && "opacity-50 border-secondary"
                )}
              >
                {/* Drag Handle */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 flex items-center justify-center bg-background/60 text-foreground">
                    <GripVertical className="w-3 h-3" />
                  </div>
                </div>

                {/* Remove Button */}
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

                {/* Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {image.startsWith("/") ? (
                    <OptimizedImage
                      src={image}
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

                {/* First Image Badge */}
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-secondary text-foreground text-[10px] font-semibold uppercase tracking-wider py-1 text-center">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
