"use client";

import { useState } from "react";
import { Palette, Type, Sun, Moon, Sparkles, X } from "lucide-react";
import { useTheme, type ColorPalette, type FontFamily } from "@/components/layout/theme-provider";

export function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, palette, fontFamily, setTheme, setPalette, setFontFamily } = useTheme();

  const palettes: Array<{ id: ColorPalette; name: string; color: string; accent: string; label: string }> = [
    { id: "natural", name: "SABO Tabiiy Yashil", color: "#2F6B45", accent: "#708B3E", label: "🌿 Tabiiy" },
    { id: "emerald", name: "Alp Qarag'ay", color: "#15803D", accent: "#047857", label: "🌲 Zumrad" },
    { id: "sky", name: "Tog' Buloqi", color: "#0284C7", accent: "#0EA5E9", label: "🌊 Moviy" },
    { id: "berry", name: "Reza Qulupnay", color: "#BE123C", accent: "#E11D48", label: "🍓 Qulupnay" },
    { id: "amber", name: "Oltin Sariyog'", color: "#B45309", accent: "#D97706", label: "🍯 Oltin" },
  ];

  const fonts: Array<{ id: FontFamily; name: string; sample: string }> = [
    { id: "inter", name: "Inter (Standart)", sample: "SABO Tabiiy Sut" },
    { id: "jakarta", name: "Plus Jakarta Sans", sample: "SABO Tabiiy Sut" },
    { id: "outfit", name: "Outfit (Modern)", sample: "SABO Tabiiy Sut" },
    { id: "playfair", name: "Playfair (Klassik)", sample: "SABO Tabiiy Sut" },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-surface/90 backdrop-blur-md border border-border-strong shadow-lg hover:shadow-xl text-foreground font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Mavzu, Ranglar va Fontlarni sozlash"
        >
          <span className="size-3.5 rounded-full" style={{ backgroundColor: palettes.find(p => p.id === palette)?.color || "#2F6B45" }} />
          <Palette className="size-4 text-primary transition-transform group-hover:rotate-45" />
          <span className="hidden sm:inline">Dizayn sozlagich</span>
        </button>
      </div>

      {/* Slide-over / Modal Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-all animate-fadeIn">
          <div className="w-full max-w-md bg-surface border-l border-border h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideLeft p-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary-soft text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-lg text-foreground tracking-tight">
                      Dizayn &amp; Mavzu Sozlagichi
                    </h2>
                    <p className="text-xs text-muted">Ranglar, shriftlar va rejimni jonli moslang</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-background transition-colors cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* 1. Day / Night Mode */}
              <div className="mt-6">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-muted mb-3">
                  1. Ko&apos;rinish rejimi (Theme Mode)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border font-bold text-xs transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    <Sun className="size-4" />
                    <span>Kunduzgi (Yorug&apos;)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex items-center justify-center gap-2.5 p-3 rounded-2xl border font-bold text-xs transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    <Moon className="size-4" />
                    <span>Tungi (Qorong&apos;u)</span>
                  </button>
                </div>
              </div>

              {/* 2. Color Palettes */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
                    2. Ranglar palitrasi (Color Palette)
                  </label>
                  <span className="text-[11px] font-bold text-primary">
                    {palettes.find((p) => p.id === palette)?.name}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {palettes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPalette(item.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        palette === item.id
                          ? "bg-background border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                          : "bg-background/60 border-border hover:border-border-strong hover:bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-5 rounded-full shadow-xs ring-2 ring-white/20"
                            style={{ backgroundColor: item.color }}
                          />
                          <span
                            className="size-3.5 rounded-full shadow-xs opacity-80"
                            style={{ backgroundColor: item.accent }}
                          />
                        </div>
                        <span className="text-xs font-bold text-foreground">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-surface border border-border text-muted">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Typography & Fonts */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Type className="size-3.5" />
                    <span>3. Shrift &amp; Tipografiya (Typography)</span>
                  </label>
                  <span className="text-[11px] font-bold text-primary capitalize">{fontFamily}</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFontFamily(f.id)}
                      className={`p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        fontFamily === f.id
                          ? "bg-background border-primary shadow-sm ring-2 ring-primary/20"
                          : "bg-background/60 border-border hover:border-border-strong"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{f.name}</span>
                        <span className="text-[11px] text-muted font-mono font-medium">CSS: var(--font-{f.id})</span>
                      </div>
                      <div className="text-sm text-primary font-semibold mt-1 truncate font-display">
                        {f.sample} • 100% Tabiiy Mahsulot
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs text-muted font-medium">
              <span>SABO Dynamic Theme Engine</span>
              <button
                type="button"
                onClick={() => {
                  setPalette("natural");
                  setFontFamily("inter");
                  setTheme("light");
                }}
                className="text-action-red font-bold hover:underline cursor-pointer"
              >
                Tiklash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
