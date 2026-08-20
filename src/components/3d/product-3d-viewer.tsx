"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

import { SceneLoader } from "@/components/3d/scene-loader";
import { isWebGLAvailable } from "@/lib/three/detect-webgl";
import { getDeviceTier } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

const Product3DViewerCanvas = dynamic(
  () => import("@/components/3d/product-3d-viewer-canvas"),
  { ssr: false, loading: () => <SceneLoader /> }
);

interface Product3DViewerProps {
  src: string;
  alt: string;
  labels: {
    hint: string;
    reset: string;
    fullscreen: string;
    exitFullscreen: string;
  };
  className?: string;
}

export function Product3DViewer({
  src,
  alt,
  labels,
  className,
}: Product3DViewerProps) {
  const [mode, setMode] = useState<"loading" | "webgl" | "static">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isWebGLAvailable() || getDeviceTier() === "low") {
      setMode("static");
      return;
    }
    setMode("webgl");
  }, []);

  if (mode === "webgl") {
    return (
      <>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <Product3DViewerCanvas src={src} alt={alt} labels={labels} />
      </>
    );
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-contain p-6"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}