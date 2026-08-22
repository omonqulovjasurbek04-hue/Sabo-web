import Image from "next/image";

import { cn } from "@/lib/utils";

interface WebGLFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function WebGLFallback({ src, alt, className }: WebGLFallbackProps) {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
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