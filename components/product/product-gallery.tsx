"use client";

import * as React from "react";

import useEmblaCarousel from "embla-carousel-react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  OptimizedImage,
} from "@/components/shared/optimized-image";

interface ProductGalleryProps {
  images: {
    url: string;
  }[];

  productName: string;
}

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] =
    React.useState(0);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  const [emblaRef, emblaApi] =
    useEmblaCarousel({
      align: "start",
      loop: false,
      dragFree: false,
    });

  const scrollPrev =
    React.useCallback(() => {
      emblaApi?.scrollPrev();
    }, [emblaApi]);

  const scrollNext =
    React.useCallback(() => {
      emblaApi?.scrollNext();
    }, [emblaApi]);

  const scrollTo =
    React.useCallback(
      (index: number) => {
        emblaApi?.scrollTo(index);
      },
      [emblaApi]
    );

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(
        emblaApi.selectedScrollSnap()
      );
    };

    onSelect();

    emblaApi.on(
      "select",
      onSelect
    );

    return () => {
      emblaApi.off(
        "select",
        onSelect
      );
    };
  }, [emblaApi]);

  return (
    <>
      <div className="space-y-4">
        {/* MAIN IMAGE */}

        <div className="relative isolate">
          <div
            ref={emblaRef}
            className={cn(
              "overflow-hidden rounded-3xl",
              "border border-border bg-card"
            )}
          >
            <div className="flex">
              {images.map(
                (image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative basis-full shrink-0 grow-0",
                      "aspect-4/5"
                    )}
                  >
                    <OptimizedImage
                      src={image.url}
                      alt={`${productName} ${
                        index + 1
                      }`}
                      fill
                      priority={
                        index === 0
                      }
                      className={cn(
                        "object-cover",
                        "transform-gpu",
                        "backface-hidden",
                        "transform-[translateZ(0)]"
                      )}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          {/* ARROWS */}

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                className={cn(
                  "absolute left-4 top-1/2 z-10",
                  "-translate-y-1/2",
                  "hidden md:flex",
                  "h-11 w-11",
                  "bg-background/80 text-foreground",
                  "hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={scrollNext}
                className={cn(
                  "absolute right-4 top-1/2 z-10",
                  "-translate-y-1/2",
                  "hidden md:flex",
                  "h-11 w-11",
                  "bg-background/80 text-foreground",
                  "hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* EXPAND */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreenOpen(true)}
            className={cn(
              "absolute right-4 top-4 z-10",
              "h-10 w-10",
              "bg-background/80 text-foreground"
            )}
          >
            <Expand className="h-4 w-4" />
          </Button>
        </div>

        {/* THUMBNAILS */}

        <div
          className={cn(
            "flex gap-3 overflow-x-auto pb-2",
            "scrollbar-hide"
          )}
        >
          {images.map(
            (image, index) => (
              <button
                key={index}
                onClick={() =>
                  scrollTo(index)
                }
                className={cn(
                  "relative h-20 w-16 shrink-0",
                  "overflow-hidden rounded-2xl",
                  "border-2",
                  "transition-colors duration-200",
                  selectedIndex ===
                    index
                    ? "border-primary"
                    : "border-border"
                )}
              >
                <OptimizedImage
                  src={image.url}
                  alt={`Thumbnail ${
                    index + 1
                  }`}
                  fill
                  sizes="64px"
                  className={cn(
                    "object-cover",
                    "transform-gpu",
                    "backface-hidden",
                    "transform-[translateZ(0)]"
                  )}
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] bg-background p-0 border-border">
          <DialogHeader className="sr-only">
            <DialogTitle>{productName}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[85vh]">
            <OptimizedImage
              src={images[selectedIndex]?.url}
              alt={`${productName} ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 90vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}