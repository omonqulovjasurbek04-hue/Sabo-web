"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { prefersReducedMotion } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

interface ParallaxNatureProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function ParallaxNature({
  children,
  className,
  speed = 0.04,
}: ParallaxNatureProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = innerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const viewport = window.innerHeight;
        if (rect.bottom < 0 || rect.top > viewport) return;
        const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
        el.style.transform = `translate3d(0, ${(progress * -1 * speed * 100).toFixed(1)}px, 0)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={innerRef} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}