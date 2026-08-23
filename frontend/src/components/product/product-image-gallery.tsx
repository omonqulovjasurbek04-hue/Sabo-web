"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, Box, Image as ImageIcon, Sparkles } from "lucide-react";
import { Product3DViewer } from "@/components/3d/product-3d-viewer";
import { ImageLightbox } from "@/components/ui/image-lightbox";

interface ProductImageGalleryProps {
  mainImage: string;
  galleryImages?: string[];
  productName: string;
  colorAccent?: string;
  labels: {
    hint: string;
    reset: string;
    fullscreen: string;
    exitFullscreen: string;
  };
}

export function ProductImageGallery({
  mainImage,
  galleryImages = [],
  productName,
  colorAccent = "#2F6B45",
  labels,
}: ProductImageGalleryProps) {
  const allImages = [
    { src: mainImage, title: `${productName} — Asosiy ko'rinish` },
    ...galleryImages.map((src, i) => ({
      src,
      title: `${productName} — Qo'shimcha burchak #${i + 1}`,
    })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const currentImage = allImages[selectedIndex] || allImages[0];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image / 3D Canvas Box */}
      <div className="relative aspect-square rounded-[24px] overflow-hidden border border-border bg-surface shadow-md group transition-all">
        {/* Soft Ambient Product Tone Glow */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none transition-opacity group-hover:opacity-25"
          style={{
            background: `radial-gradient(circle at center, ${colorAccent} 0%, transparent 70%)`,
          }}
        />

        {viewMode === "3d" ? (
          <Product3DViewer
            src={currentImage.src}
            alt={productName}
            labels={labels}
          />
        ) : (
          <div
            className="relative w-full h-full cursor-zoom-in flex items-center justify-center p-6"
            onClick={() => handleOpenLightbox(selectedIndex)}
          >
            <Image
              src={currentImage.src}
              alt={productName}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Top Control Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-10">
          {/* 2D / 3D Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("2d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === "2d"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <ImageIcon className="size-3.5" />
              <span>Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                viewMode === "3d"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Box className="size-3.5" />
              <span>3D Model</span>
            </button>
          </div>

          {/* Fullscreen Lightbox Button */}
          <button
            type="button"
            onClick={() => handleOpenLightbox(selectedIndex)}
            className="p-2.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border text-muted hover:text-primary shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Rasmni to'liq ekranda ko'rish va kattalashtirish"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        {/* Bottom Hint */}
        {viewMode === "2d" && (
          <div className="absolute bottom-3 right-3 pointer-events-none z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-[11px] font-semibold text-white/90">
              <Sparkles className="size-3" />
              Kattalashtirish uchun bosing
            </span>
          </div>
        )}
      </div>

      {/* Multi-angle Thumbnail Selector */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx);
                setViewMode("2d");
              }}
              className={`relative size-18 sm:size-20 rounded-2xl overflow-hidden border-2 bg-surface p-1 transition-all cursor-pointer shrink-0 ${
                selectedIndex === idx && viewMode === "2d"
                  ? "border-primary shadow-md scale-105 ring-2 ring-primary/20"
                  : "border-border hover:border-border-strong opacity-80 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <ImageLightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
