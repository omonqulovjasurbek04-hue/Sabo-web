"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

import { SceneLoader } from "@/components/3d/scene-loader";
import { isWebGLAvailable } from "@/lib/three/detect-webgl";
import { getDeviceTier, prefersReducedMotion } from "@/lib/three/motion";

const Hero3DCanvas = dynamic(
  () => import("@/components/3d/hero-3d-canvas"),
  { ssr: false, loading: () => <SceneLoader /> }
);

interface Hero3DProps {
  productImage?: string;
  alt?: string;
}

export function Hero3D({
  productImage = "/images/products/Sabo_Milk.jpg",
  alt = "SABO",
}: Hero3DProps) {
  const [mode, setMode] = useState<"loading" | "webgl" | "static">("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isWebGLAvailable()) {
      setMode("static");
      return;
    }
    if (prefersReducedMotion() || getDeviceTier() === "low") {
      setMode("static");
      return;
    }
    setMode("webgl");
  }, []);

  if (mode === "webgl") {
    return (
      <>
        <Image
          src={productImage}
          alt={alt}
          fill
          priority
          className="object-contain p-6"
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 480px"
        />
        <Hero3DCanvas productImage={productImage} />
      </>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Image
        src={productImage}
        alt={alt}
        fill
        priority
        className="object-contain p-6"
        sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 480px"
      />
    </div>
  );
}