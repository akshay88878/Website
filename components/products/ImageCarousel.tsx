"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  sizeClass: string;
  autoSlideEnabled?: boolean;
  autoSlideDelay?: number;
};

export function ImageCarousel({
  images,
  alt,
  sizeClass,
  autoSlideEnabled = false,
  autoSlideDelay = 3
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    if (!autoSlideEnabled || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, (autoSlideDelay || 3) * 1000);

    return () => clearInterval(interval);
  }, [autoSlideEnabled, autoSlideDelay, images.length]);

  if (images.length === 0) {
    return (
      <div className={`${sizeClass} flex items-center justify-center rounded-3xl bg-surface-subtle`}>
        <p className="text-sm text-ink-400">No images</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`${sizeClass} overflow-hidden rounded-3xl`}>
        <img
          src={images[0]}
          alt={alt}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={`${sizeClass} group relative overflow-hidden rounded-3xl`}>
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="h-full w-full object-contain"
      />

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-white"
                : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
