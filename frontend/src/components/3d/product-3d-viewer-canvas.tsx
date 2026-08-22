"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { MaximizeIcon, MinimizeIcon, RotateCcwIcon } from "@/components/ui/icons";
import { prefersReducedMotion } from "@/lib/three/motion";
import { cn } from "@/lib/utils";

interface Product3DViewerCanvasProps {
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

const DEFAULT_ZOOM = 5.5;
const MIN_ZOOM = 3.2;
const MAX_ZOOM = 9;

export default function Product3DViewerCanvas({
  src,
  alt,
  labels,
  className,
}: Product3DViewerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    const reducedMotion = prefersReducedMotion();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 500ms ease";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.className = "absolute inset-0";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, DEFAULT_ZOOM);

    const geometry = new THREE.PlaneGeometry(4, 4);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const textureLoader = new THREE.TextureLoader();
    let hasFailed = false;
    textureLoader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        const ratio = texture.image.height / texture.image.width;
        geometry.scale(1, ratio, 1);
        material.map = texture;
        material.needsUpdate = true;
        setReady(true);
      },
      undefined,
      () => {
        hasFailed = true;
        mesh.visible = false;
        setFailed(true);
      }
    );

    let targetRotX = 0;
    let targetRotY = 0;
    let targetZoom = DEFAULT_ZOOM;

    const pointers = new Map<number, { x: number; y: number }>();
    let lastPinchDistance = 0;
    let isDragging = false;

    const onPointerDown = (event: PointerEvent) => {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) {
        isDragging = true;
        renderer.domElement.setPointerCapture(event.pointerId);
      } else if (pointers.size === 2) {
        isDragging = false;
        const [a, b] = [...pointers.values()];
        lastPinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      const next = { x: event.clientX, y: event.clientY };
      if (pointers.size === 1 && isDragging && !reducedMotion) {
        targetRotY += (next.x - prev.x) * 0.008;
        targetRotX += (next.y - prev.y) * 0.005;
        targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
      }
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinchDistance > 0) {
          targetZoom = Math.max(
            MIN_ZOOM,
            Math.min(MAX_ZOOM, targetZoom * (lastPinchDistance / distance))
          );
        }
        lastPinchDistance = distance;
      }
      pointers.set(event.pointerId, next);
    };
    const onPointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      lastPinchDistance = 0;
      isDragging = pointers.size === 1;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, targetZoom + event.deltaY * 0.004)
      );
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("pointercancel", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: false });

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);

    const onReset = () => {
      targetRotX = 0;
      targetRotY = 0;
      targetZoom = DEFAULT_ZOOM;
    };
    container.addEventListener("sabo-reset", onReset);

    const resizeObserver = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let raf = 0;
    const animate = () => {
      if (hasFailed) return;
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.x += (targetRotX - mesh.rotation.x) * 0.12;
      mesh.rotation.y += (targetRotY - mesh.rotation.y) * 0.12;
      camera.position.z += (targetZoom - camera.position.z) * 0.12;
      if (!reducedMotion) {
        mesh.position.y = Math.sin(t * 0.9) * 0.04;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      container.removeEventListener("sabo-reset", onReset);
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src, alt]);

  useEffect(() => {
    if (ready && containerRef.current) {
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.opacity = "1";
      }
    }
  }, [ready]);

  const handleReset = () => {
    containerRef.current?.dispatchEvent(new CustomEvent("sabo-reset"));
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const target = el.parentElement ?? el;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void target.requestFullscreen?.();
    }
  };

  if (failed) return null;

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleReset}
          aria-label={labels.reset}
          title={labels.reset}
          className="inline-flex items-center justify-center size-10 rounded-xl border border-border bg-surface/90 text-muted backdrop-blur hover:text-primary hover:border-primary transition-colors shadow-xs"
        >
          <RotateCcwIcon width={18} height={18} />
        </button>
        <button
          type="button"
          onClick={handleFullscreen}
          aria-label={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
          title={isFullscreen ? labels.exitFullscreen : labels.fullscreen}
          className="inline-flex items-center justify-center size-10 rounded-xl border border-border bg-surface/90 text-muted backdrop-blur hover:text-primary hover:border-primary transition-colors shadow-xs"
        >
          {isFullscreen ? (
            <MinimizeIcon width={18} height={18} />
          ) : (
            <MaximizeIcon width={18} height={18} />
          )}
        </button>
      </div>
      {ready ? (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-xs font-medium text-muted bg-surface/70 backdrop-blur px-3 py-1 rounded-full border border-border">
          {labels.hint}
        </span>
      ) : null}
    </div>
  );
}