"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface ImageLightboxProps {
  images: Array<{ src: string; alt?: string; title?: string }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
    setRotation(0);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
    setRotation(0);
  }, [images.length]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
    setRotation(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.3, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.3, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImage.src;
    link.download = currentImage.src.split("/").pop() || "sabo-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all select-none">
      {/* Top Toolbar */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="text-white">
          <h3 className="font-bold text-sm sm:text-base drop-shadow-xs">
            {currentImage.title || currentImage.alt || "SABO Mahsulot Tasviri"}
          </h3>
          <span className="text-xs text-white/70 font-mono">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Kichiklashtirish (-)"
          >
            <ZoomOut className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Kattalashtirish (+)"
          >
            <ZoomIn className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Aylantirish"
          >
            <RotateCw className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Rasmni yuklab olish"
          >
            <Download className="size-4.5" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer hidden sm:flex"
            title="To'liq ekran"
          >
            {isFullscreen ? <Minimize2 className="size-4.5" /> : <Maximize2 className="size-4.5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-action-red hover:bg-action-red-dark transition-colors cursor-pointer ml-2"
            title="Yopish (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] p-6 flex items-center justify-center overflow-hidden">
        <div
          className="relative w-full h-full transition-transform duration-200 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
          }}
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt || "SABO"}
            fill
            sizes="100vw"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer z-20 hover:scale-110"
            title="Oldingi rasm"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all cursor-pointer z-20 hover:scale-110"
            title="Keyingi rasm"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 rounded-2xl bg-black/60 backdrop-blur-md max-w-[90vw] overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setScale(1);
                setRotation(0);
              }}
              className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt={img.alt || ""} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
