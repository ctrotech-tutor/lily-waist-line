"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/optimized-image";

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
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  React.useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();

    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="space-y-4">

      {/* MAIN IMAGE */}
      <div className="relative">

        <div
          className={cn(
            "overflow-hidden rounded-3xl",
            "border border-border bg-card"
          )}
          ref={emblaRef}
        >
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative min-w-0 shrink-0 grow-0 basis-full aspect-[4/5]"
              >
                <OptimizedImage
                  src={image.url}
                  alt={`${productName} ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2",
                "hidden md:flex",
                "h-11 w-11 items-center justify-center",
                "rounded-full",
                "bg-black/60 text-white backdrop-blur-xl",
                "transition hover:bg-primary"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={scrollNext}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2",
                "hidden md:flex",
                "h-11 w-11 items-center justify-center",
                "rounded-full",
                "bg-black/60 text-white backdrop-blur-xl",
                "transition hover:bg-primary"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Expand Button */}
        <button
          className={cn(
            "absolute right-4 top-4",
            "flex h-10 w-10 items-center justify-center",
            "rounded-full",
            "bg-black/60 text-white backdrop-blur-xl"
          )}
        >
          <Expand className="h-4 w-4" />
        </button>

      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "relative shrink-0",
              "h-20 w-16",
              "overflow-hidden rounded-2xl",
              "border-2 transition-all",
              selectedIndex === index
                ? "border-primary"
                : "border-border"
            )}
          >
            <OptimizedImage
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

    </div>
  );
}