"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Download } from "lucide-react";

interface VideoPlayerModalProps {
  videoUrl: string;
  title?: string;
  poster?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({
  videoUrl,
  title = "SABO Video Lavhasi",
  poster,
  isOpen,
  onClose,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsPlaying(true);
    } else {
      document.body.style.overflow = "";
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, togglePlay]);

  if (!isOpen) return null;

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-linear-to-b from-black/80 to-transparent">
          <div className="text-white">
            <h3 className="font-bold text-sm sm:text-base drop-shadow-xs">{title}</h3>
            <span className="text-xs text-white/70">SABO Tabiiy Sut Ishlab Chiqarish</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={videoUrl}
              download
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Videoni yuklab olish"
            >
              <Download className="size-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors cursor-pointer"
              title="Yopish (ESC)"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={poster}
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Center Play/Pause button on hover / pause */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute size-20 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="size-8 ml-1" />
            </button>
          )}
        </div>

        {/* Custom Bottom Controls Bar */}
        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-white/10 flex flex-col gap-3">
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            className="w-full h-2 rounded-full bg-white/20 cursor-pointer relative overflow-hidden group"
          >
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              title="To'liq ekran"
            >
              <Maximize2 className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
