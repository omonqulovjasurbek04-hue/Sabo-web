"use client";

import { useEffect, useRef } from "react";

import { getDeviceTier, prefersReducedMotion } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  opacity: number;
}

export function ParticleField({ className }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.innerWidth < 768;
    const tier = getDeviceTier();
    const count = reduced ? 14 : tier === "low" ? 24 : tier === "medium" ? 60 : 90;

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.6 + Math.random() * 1.6,
        vy: 0.1 + Math.random() * 0.35,
        vx: -0.05 + Math.random() * 0.1,
        opacity: 0.08 + Math.random() * 0.22,
      }));
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -4) {
          p.y = height + 4;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none w-full h-full", className)}
      aria-hidden="true"
    />
  );
}