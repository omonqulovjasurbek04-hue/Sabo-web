"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/utils";

interface Hero3DCanvasProps {
  productImage?: string;
  className?: string;
}

const FOV = 42;
const CAMERA_Z = 6;

function createShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(15, 30, 22, 0.32)");
    gradient.addColorStop(1, "rgba(15, 30, 22, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function Hero3DCanvas({
  productImage = "/images/products/Sabo_Milk.jpg",
  className,
}: Hero3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 600ms ease";
    renderer.domElement.className = "absolute inset-0";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 100);
    camera.position.set(0, 0.2, CAMERA_Z);

    const geometry = new THREE.PlaneGeometry(3.4, 3.4);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0.3;
    scene.add(mesh);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.5),
      shadowMaterial
    );
    shadow.position.set(0, -1.75, 0.2);
    scene.add(shadow);

    const textureLoader = new THREE.TextureLoader();
    let hasFailed = false;
    textureLoader.load(
      productImage,
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

    let particles: THREE.Points | null = null;
    let particleGeometry: THREE.BufferGeometry | null = null;
    let particleMaterial: THREE.PointsMaterial | null = null;
    if (!reducedMotion) {
      const count = window.innerWidth < 768 ? 16 : 42;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 6;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = Math.random() * 2 - 0.5;
      }
      particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.045,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
      });
      particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
    }

    let targetRX = 0;
    let targetRY = 0;
    let rotating = !reducedMotion;

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      if (rect.width === 0) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetRY = nx * 0.09;
      targetRX = -ny * 0.07;
    };
    const onPointerEnter = () => {
      if (!reducedMotion) rotating = false;
    };
    const onPointerLeave = () => {
      if (!reducedMotion) rotating = true;
      targetRX = 0;
      targetRY = 0;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    let scrollScale = 1;
    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.min(
        Math.max((window.innerHeight / 2 - rect.top) / window.innerHeight, 0),
        0.5
      );
      scrollScale = 1 + progress * 0.1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

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

      if (rotating) {
        mesh.rotation.y = t * 0.16;
      }
      mesh.rotation.x += (targetRX - mesh.rotation.x) * 0.06;
      if (!rotating) {
        mesh.rotation.y += (targetRY - mesh.rotation.y) * 0.06;
      }
      if (!reducedMotion) {
        mesh.position.y = Math.sin(t * 1.1) * 0.075;
      }
      mesh.scale.setScalar(scrollScale);
      if (particles) {
        particles.rotation.y = t * 0.02;
        particles.position.y = Math.sin(t * 0.4) * 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      shadow.geometry.dispose();
      shadowMaterial.map?.dispose();
      shadowMaterial.dispose();
      if (particleGeometry) particleGeometry.dispose();
      if (particleMaterial) particleMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [productImage]);

  useEffect(() => {
    if (ready && containerRef.current) {
      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.opacity = "1";
      }
    }
  }, [ready]);

  if (failed) return null;

  return <div ref={containerRef} className={cn("absolute inset-0", className)} />;
}