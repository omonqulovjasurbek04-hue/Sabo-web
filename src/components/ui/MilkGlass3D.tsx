import React, { useRef, useEffect, useState } from 'react';
import { Droplets, Sparkles } from 'lucide-react';

interface MilkGlass3DProps {
  className?: string;
  milkFill?: number; // 0.0 to 1.0 (default 0.78)
  interactive?: boolean;
}

export const MilkGlass3D: React.FC<MilkGlass3DProps> = ({
  className = '',
  milkFill = 0.78,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let waveTime = 0;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Center coords
      const cx = width / 2 + tilt.x * 20;
      const cy = height / 2 + tilt.y * 20;

      // 1. Soft Ambient Glow Behind Glass
      const glowGradient = ctx.createRadialGradient(cx, cy, 30, cx, cy, 180);
      glowGradient.addColorStop(0, 'rgba(22, 132, 196, 0.25)');
      glowGradient.addColorStop(0.5, 'rgba(199, 25, 37, 0.12)');
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.fill();

      // Glass Geometry params
      const topWidth = 140;
      const bottomWidth = 110;
      const glassHeight = 220;
      const glassTop = cy - glassHeight / 2 + 10;
      const glassBottom = cy + glassHeight / 2 - 10;

      // 2. Milk Liquid Body (Inside Glass)
      const currentFill = milkFill;
      const milkTopY = glassBottom - glassHeight * currentFill;
      const milkTopWidth = bottomWidth + (topWidth - bottomWidth) * currentFill;

      // Draw Milk Shape
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - topWidth / 2, glassTop);
      ctx.lineTo(cx - bottomWidth / 2, glassBottom);
      ctx.quadraticCurveTo(cx, glassBottom + 20, cx + bottomWidth / 2, glassBottom);
      ctx.lineTo(cx + topWidth / 2, glassTop);
      ctx.quadraticCurveTo(cx, glassTop - 15, cx - topWidth / 2, glassTop);
      ctx.closePath();
      ctx.clip(); // Clip milk inside glass boundary

      // Milk Fluid Wave
      ctx.beginPath();
      const waveFreq = prefersReducedMotion ? 0 : 0.04;
      const waveSpeed = prefersReducedMotion ? 0 : 0.03;
      waveTime += waveSpeed;

      const waveAmp = isHovered ? 6 : 3;
      const leftMilkX = cx - milkTopWidth / 2;
      const rightMilkX = cx + milkTopWidth / 2;

      ctx.moveTo(leftMilkX, milkTopY);
      for (let x = leftMilkX; x <= rightMilkX; x += 4) {
        const relX = (x - leftMilkX) / milkTopWidth;
        const wave = Math.sin(relX * Math.PI * 4 + waveTime) * waveAmp + Math.cos(relX * Math.PI * 2 - waveTime * 1.5) * (waveAmp * 0.5);
        ctx.lineTo(x, milkTopY + wave);
      }

      ctx.lineTo(cx + bottomWidth / 2 + 10, glassBottom + 30);
      ctx.lineTo(cx - bottomWidth / 2 - 10, glassBottom + 30);
      ctx.closePath();

      // Creamy Milk Gradient
      const milkGradient = ctx.createLinearGradient(cx - 50, milkTopY, cx + 50, glassBottom);
      milkGradient.addColorStop(0, '#FFFFFF');
      milkGradient.addColorStop(0.3, '#FAF7F0');
      milkGradient.addColorStop(0.7, '#F3EFE6');
      milkGradient.addColorStop(1, '#E9E2D5');
      ctx.fillStyle = milkGradient;
      ctx.fill();

      // Milk Surface Highlight Oval
      ctx.beginPath();
      ctx.ellipse(cx, milkTopY, milkTopWidth / 2, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // Subsurface Organic Cream Tint
      const creamGlow = ctx.createRadialGradient(cx - 20, cy + 20, 10, cx, cy + 20, 80);
      creamGlow.addColorStop(0, 'rgba(255, 250, 240, 0.8)');
      creamGlow.addColorStop(1, 'rgba(235, 225, 205, 0)');
      ctx.fillStyle = creamGlow;
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore(); // End Clip

      // 3. Glass Outer Reflections & Specular Highlights
      // Left Edge Glass Reflection
      ctx.beginPath();
      ctx.moveTo(cx - topWidth / 2 + 6, glassTop + 10);
      ctx.lineTo(cx - bottomWidth / 2 + 6, glassBottom - 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Right Edge Shadow Tint
      ctx.beginPath();
      ctx.moveTo(cx + topWidth / 2 - 6, glassTop + 10);
      ctx.lineTo(cx + bottomWidth / 2 - 6, glassBottom - 10);
      ctx.strokeStyle = 'rgba(37, 104, 60, 0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glass Rim (Top Oval)
      ctx.beginPath();
      ctx.ellipse(cx, glassTop, topWidth / 2, 14, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glass Base (Thick Bottom)
      ctx.beginPath();
      ctx.ellipse(cx, glassBottom, bottomWidth / 2, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Cold Condensation Droplets
      const droplets = [
        { x: cx - 25, y: cy - 20, r: 2.5 },
        { x: cx - 35, y: cy + 15, r: 1.8 },
        { x: cx + 30, y: cy - 10, r: 2.2 },
        { x: cx + 20, y: cy + 40, r: 1.5 },
        { x: cx - 10, y: cy + 55, r: 2.0 },
      ];

      droplets.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tilt, milkFill, isHovered]);

  // Handle Mouse / Touch Parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none cursor-pointer transition-transform duration-300 ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${className}`}
      title="SABO 3D Interaktiv Sut Stakani"
    >
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="w-[280px] sm:w-[320px] md:w-[360px] h-[280px] sm:h-[320px] md:h-[360px] drop-shadow-2xl"
      />

      {/* Floating 3D Micro-Badges */}
      <div className="absolute top-4 left-2 bg-white/90 dark:bg-[#151B22]/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-[#DCE3E8] dark:border-[#29323C] flex items-center gap-1.5 text-[11px] font-bold text-[#1684C4] dark:text-[#2498D1] pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-[#C71925] dark:text-[#E32935]" />
        <span>3.2% Yangi Sog'ilgan</span>
      </div>

      <div className="absolute bottom-6 right-2 bg-[#0D1117]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full shadow-lg border border-[#29323C] flex items-center gap-1.5 text-[11px] font-bold pointer-events-none">
        <Droplets className="w-3.5 h-3.5 text-[#1684C4]" />
        <span>+2°C Sovuq</span>
      </div>
    </div>
  );
};
