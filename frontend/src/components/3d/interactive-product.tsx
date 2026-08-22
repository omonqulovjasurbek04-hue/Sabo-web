"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { isCoarsePointer, prefersReducedMotion } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

interface InteractiveProductProps {
  children: ReactNode;
  className?: string;
}

export function InteractiveProduct({
  children,
  className,
}: InteractiveProductProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || isCoarsePointer()) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return;
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-py * 2.5).toFixed(2)}deg) rotateY(${(px * 2.5).toFixed(2)}deg) scale(1.02)`;
    };
    const onLeave = () => {
      el.style.transform =
        "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "will-change-transform transition-transform duration-250 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
}