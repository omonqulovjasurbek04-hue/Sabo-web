"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sun,
  Moon,
  Palette,
  Type,
  Save,
  RotateCcw,
  CheckCircle2,
  Video,
  Play,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";
import { apiClient } from "@/lib/api-client";
import { VideoPlayerModal } from "@/components/ui/video-player-modal";
import type { ThemeSettings, ThemeModeColors, ProductAddOn } from "@/lib/types";

export function ThemeDesignPanel() {
  const {
    themeSettings,
    updateGlobalThemeSettings,
    resetGlobalThemeSettings,
    fontFamily,
    setFontFamily,
  } = useTheme();

  const [activeTab, setActiveTab] = useState<"light" | "dark" | "brand">("light");
  const [localSettings, setLocalSettings] = useState<ThemeSettings | null>(themeSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);

  // Video preview modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewVideoTitle, setPreviewVideoTitle] = useState("");

  useEffect(() => {
    if (themeSettings) {
      setLocalSettings(JSON.parse(JSON.stringify(themeSettings)));
    }
  }, [themeSettings]);

  if (!localSettings) {
    return (
      <div className="p-8 text-center text-muted">
        Mavzu sozlamalari yuklanmoqda...
      </div>
    );
  }

  const currentColors = activeTab === "dark" ? localSettings.dark : localSettings.light;

  const handleColorChange = (mode: "light" | "dark", key: keyof ThemeModeColors, value: string) => {
    setLocalSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [mode]: {
          ...prev[mode],
          [key]: value,
        },
      };
    });
  };

  const handleBrandChange = (key: string, value: unknown) => {
    setLocalSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        brand: {
          ...prev.brand,
          [key]: value,
        },
      };
    });
  };

  const handleFileUpload = async (
    targetField: "logoUrl" | "logoDarkUrl" | "faviconUrl" | "heroVideoUrl" | "productionVideoUrl" | "aboutVideoUrl",
    file: File
  ) => {
    setUploadingTarget(targetField);
    try {
      const res = await apiClient.uploadMedia(file, "general", file.name);
      if (res.success && res.data?.url) {
        handleBrandChange(targetField, res.data.url);
        setSaveSuccessMsg(`"${file.name}" muvaffaqiyatli yuklandi!`);
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      }
    } catch {
      alert("Fayl yuklashda xatolik yuz berdi");
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleAddOnAdd = () => {
    const newAddOn: ProductAddOn = {
      id: `addon-${Date.now()}`,
      name: { uz: "Yangi Qo'shimcha", ru: "Новое дополнение", en: "New Add-on" },
      price: 5000,
      description: { uz: "Qo'shimcha tavsifi", ru: "Описание дополнения", en: "Add-on description" },
    };
    const currentList = localSettings.brand?.addOnsCatalog || [];
    handleBrandChange("addOnsCatalog", [...currentList, newAddOn]);
  };

  const handleAddOnRemove = (id: string) => {
    const currentList = localSettings.brand?.addOnsCatalog || [];
    handleBrandChange(
      "addOnsCatalog",
      currentList.filter((a) => a.id !== id)
    );
  };

  const handleAddOnUpdate = (idx: number, field: keyof ProductAddOn, value: unknown) => {
    const list = [...(localSettings.brand?.addOnsCatalog || [])];
    list[idx] = { ...list[idx], [field]: value };
    handleBrandChange("addOnsCatalog", list);
  };

  const handleSaveGlobal = async () => {
    if (!localSettings) return;
    setIsSaving(true);
    setSaveSuccessMsg("");

    const updated = await updateGlobalThemeSettings(localSettings);
    setIsSaving(false);
    if (updated) {
      setSaveSuccessMsg("Barcha ranglar, videolar, logotip va dizayn sozlamalari barcha qurilmalarda global saqlandi!");
      setTimeout(() => setSaveSuccessMsg(""), 5000);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm("Barcha ranglar, logotiplar va videolarni standart SABO holatiga qaytarishni xohlaysizmi?")) return;
    setIsSaving(true);
    const reset = await resetGlobalThemeSettings();
    setIsSaving(false);
    if (reset) {
      setLocalSettings(reset);
      setSaveSuccessMsg("Ranglar va sozlamalar standart holatga qaytarildi!");
      setTimeout(() => setSaveSuccessMsg(""), 5000);
    }
  };

  const colorFields: Array<{ key: keyof ThemeModeColors; label: string; desc: string }> = [
    { key: "primary", label: "Asosiy Brend Rangi (Primary)", desc: "Logotip, faol elementlar va asosiy brend tus" },
    { key: "primaryHover", label: "Asosiy Tugma Hover (Primary Hover)", desc: "Kursor bosilganda hosil bo'ladigan to'q tus" },
    { key: "primarySoft", label: "Yumshoq Brend Foni (Primary Soft)", desc: "Ikonkalar foni va yumshoq fon qutilari" },
    { key: "secondary", label: "Ikkilamchi Rangi (Secondary)", desc: "Nishonlar, ikkilamchi urg'ular va xatcho'plar" },
    { key: "background", label: "Sayt Asosiy Foni (Background)", desc: "Butun sahifaning umumiy orqa foni" },
    { key: "surface", label: "Karta va Bloklar Foni (Surface)", desc: "Mahsulot kartalari, panellar va oq qutilar" },
    { key: "surfaceElevated", label: "Ko'tarilgan Blok Foni (Surface Elevated)", desc: "Yon panel, modal sarlavhalari va menyular" },
    { key: "foreground", label: "Asosiy Matn Rangi (Text Foreground)", desc: "Sarlavhalar, mahsulot nomlari va asosiy matn" },
    { key: "muted", label: "Yordamchi Matn Rangi (Muted Text)", desc: "Tavsiflar, sanalar va ikkinchi darajali ma'lumotlar" },
    { key: "border", label: "Chegara Chiziqlari (Border)", desc: "Bloklar va tugmalar atrofidagi ingichka chiziqlar" },
    { key: "buttonBg", label: "Asosiy Tugma Foni (Button Bg)", desc: "'Savatga qo'shish', 'Xarid qilish' tugmalari" },
    { key: "buttonText", label: "Asosiy Tugma Matni (Button Text)", desc: "Tugma ichidagi matn rangi" },
    { key: "buttonHover", label: "Tugma Hover Foni (Button Hover)", desc: "Tugma ustiga kursor borgandagi rang" },
    { key: "actionRed", label: "Narx & Aksiya Rangi (Action Red)", desc: "Mahsulot narxlari, aksiyalar va chegirmalar" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-foreground tracking-tight">
            Dizayn, Video, Logo va Ranglar
          </h1>
          <p className="text-muted text-sm mt-1 font-medium">
            Admin paneldan o&apos;zgartirilgan videolar, logotip, ranglar va shriftlar barcha qurilmalarda global qo&apos;llanadi.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-surface text-muted hover:text-foreground text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Standartga qaytarish</span>
          </button>

          <button
            type="button"
            onClick={handleSaveGlobal}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{isSaving ? "Saqlanmoqda..." : "Global Saqlash (Barcha qurilmalarda)"}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 3 Main Management Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border w-fit shadow-xs flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab("light")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "light"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
              : "text-muted hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          <Sun className="size-4" />
          <span>☀️ Kunduzgi Rejim (Light)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dark")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "dark"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-muted hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          <Moon className="size-4" />
          <span>🌙 Tungi Rejim (Dark)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "brand"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "text-muted hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          <Video className="size-4" />
          <span>🎬 Brend, Video &amp; Logo</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1 & 2: COLOR CUSTOMIZER TABS (LIGHT & DARK) */}
      {/* ------------------------------------------------------------- */}
      {(activeTab === "light" || activeTab === "dark") && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Color Tokens List */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2">
                <Palette className="size-5 text-primary" />
                <span>
                  {activeTab === "light" ? "Kunduzgi rejim ranglari" : "Tungi rejim ranglari"}
                </span>
              </h3>
              <span className="text-xs font-mono text-muted font-bold">
                {colorFields.length} ta rang tokeni
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {colorFields.map((field) => {
                const val = currentColors[field.key];
                return (
                  <div
                    key={field.key}
                    className="p-3.5 rounded-2xl bg-background/60 border border-border hover:border-primary/40 transition-colors flex flex-col justify-between"
                  >
                    <div className="mb-2">
                      <span className="text-xs font-bold text-foreground block">
                        {field.label}
                      </span>
                      <span className="text-[11px] text-muted block leading-tight mt-0.5">
                        {field.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                      <input
                        type="color"
                        value={val}
                        onChange={(e) => handleColorChange(activeTab, field.key, e.target.value)}
                        className="size-9 rounded-xl border border-border cursor-pointer bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => handleColorChange(activeTab, field.key, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-mono font-bold text-foreground uppercase focus:border-primary outline-hidden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Live Testing & Typography */}
          <div className="space-y-6">
            {/* Live Preview Box */}
            <div
              className="p-6 rounded-3xl border shadow-lg space-y-5 transition-colors"
              style={{
                backgroundColor: currentColors.background,
                borderColor: currentColors.border,
                color: currentColors.foreground,
              }}
            >
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentColors.border }}>
                <span className="text-xs font-black uppercase tracking-wider">
                  Jonli Namuna (Preview)
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: currentColors.primarySoft,
                    color: currentColors.primary,
                  }}
                >
                  {activeTab === "light" ? "Light" : "Dark"} Rejim
                </span>
              </div>

              {/* Mock Product Card in Live Colors */}
              <div
                className="p-4 rounded-2xl border transition-all"
                style={{
                  backgroundColor: currentColors.surface,
                  borderColor: currentColors.border,
                }}
              >
                <div
                  className="inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mb-2"
                  style={{
                    backgroundColor: currentColors.primarySoft,
                    color: currentColors.primary,
                  }}
                >
                  SABO SUT 3.2%
                </div>

                <h4 className="font-bold text-base mb-1" style={{ color: currentColors.foreground }}>
                  Tabiiy Toza Sigir Suti
                </h4>

                <p className="text-xs leading-relaxed mb-4" style={{ color: currentColors.muted }}>
                  Yangi sog&apos;ilgan sutning tabiiy ta&apos;mi va foydali vitaminlari to&apos;liq saqlangan.
                </p>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: currentColors.border }}>
                  <span className="font-black text-lg font-display" style={{ color: currentColors.actionRed }}>
                    13 000 UZS
                  </span>

                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: currentColors.buttonBg,
                      color: currentColors.buttonText,
                    }}
                  >
                    Savatga olish
                  </button>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border text-xs"
                style={{
                  backgroundColor: currentColors.surfaceElevated,
                  borderColor: currentColors.border,
                  color: currentColors.foreground,
                }}
              >
                <span className="font-bold block mb-0.5">ℹ️ Tipografiya namunasi</span>
                <span style={{ color: currentColors.muted }}>
                  Tanlangan shrift: <strong>{fontFamily.toUpperCase()}</strong>
                </span>
              </div>
            </div>

            {/* Quick Fonts Selector */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
              <h3 className="font-display font-black text-base text-foreground flex items-center gap-2">
                <Type className="size-4.5 text-primary" />
                <span>Global Shriftni Tanlash</span>
              </h3>

              <div className="space-y-2">
                {[
                  { id: "jakarta" as const, name: "Plus Jakarta Sans (Texnologik & Toza)" },
                  { id: "inter" as const, name: "Inter (Standart Zamonaviy)" },
                  { id: "outfit" as const, name: "Outfit (Geometrik Sarlavhalar)" },
                  { id: "playfair" as const, name: "Playfair Display (Klassik Premium)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFontFamily(f.id);
                      setLocalSettings((prev) => (prev ? { ...prev, fontFamily: f.id } : prev));
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      fontFamily === f.id
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3: BRAND, VIDEOS, LOGO & ADD-ONS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "brand" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Logos & Videos */}
          <div className="space-y-6">
            {/* 1. Logos & Favicon */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-6">
              <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
                <ImageIcon className="size-5 text-primary" />
                <span>Sayt Logotiplari va Favicon</span>
              </h3>

              {/* Light Logo */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground block">
                  Asosiy Logotip URL (Kunduzgi)
                </label>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-background border border-border overflow-hidden relative flex items-center justify-center shrink-0">
                    <Image
                      src={localSettings.brand?.logoUrl || "/images/logo.png"}
                      alt="Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={localSettings.brand?.logoUrl || ""}
                    onChange={(e) => handleBrandChange("logoUrl", e.target.value)}
                    placeholder="/images/logo.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-medium text-foreground focus:border-primary outline-hidden"
                  />
                  <label className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0">
                    {uploadingTarget === "logoUrl" ? (
                      <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload("logoUrl", f);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Favicon URL */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <label className="text-xs font-bold text-foreground block">
                  Sayt Sarlavhasi Iconi (Favicon)
                </label>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-background border border-border overflow-hidden relative flex items-center justify-center shrink-0">
                    <Image
                      src={localSettings.brand?.faviconUrl || "/icon.png"}
                      alt="Favicon"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <input
                    type="text"
                    value={localSettings.brand?.faviconUrl || ""}
                    onChange={(e) => handleBrandChange("faviconUrl", e.target.value)}
                    placeholder="/icon.png"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-medium text-foreground focus:border-primary outline-hidden"
                  />
                  <label className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0">
                    {uploadingTarget === "faviconUrl" ? (
                      <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload("faviconUrl", f);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. Videos Manager */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-6">
              <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2 border-b border-border pb-3">
                <Video className="size-5 text-primary" />
                <span>Videolar Boshqaruvi (Hero &amp; Zavod)</span>
              </h3>

              {/* Hero Video */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    1. Bosh Sahifa Video URL (Hero Background Video)
                  </label>
                  {localSettings.brand?.heroVideoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewVideoUrl(localSettings.brand?.heroVideoUrl || null);
                        setPreviewVideoTitle("Bosh Sahifa Videosi");
                      }}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="size-3" />
                      <span>Ko&apos;rish</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={localSettings.brand?.heroVideoUrl || ""}
                    onChange={(e) => handleBrandChange("heroVideoUrl", e.target.value)}
                    placeholder="/video/sabo-milk-pour.mp4"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-medium text-foreground focus:border-primary outline-hidden"
                  />
                  <label className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0">
                    {uploadingTarget === "heroVideoUrl" ? (
                      <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload("heroVideoUrl", f);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Production Video */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    2. Ishlab Chiqarish Zavod Videosi (Production Process)
                  </label>
                  {localSettings.brand?.productionVideoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewVideoUrl(localSettings.brand?.productionVideoUrl || null);
                        setPreviewVideoTitle("Zavod Ishlab Chiqarish Jarayoni");
                      }}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="size-3" />
                      <span>Ko&apos;rish</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={localSettings.brand?.productionVideoUrl || ""}
                    onChange={(e) => handleBrandChange("productionVideoUrl", e.target.value)}
                    placeholder="/video/sabo-milk-pour.mp4"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-medium text-foreground focus:border-primary outline-hidden"
                  />
                  <label className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0">
                    {uploadingTarget === "productionVideoUrl" ? (
                      <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload("productionVideoUrl", f);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* About Video */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">
                    3. Biz Haqimizda Tarix Videosi (About Video)
                  </label>
                  {localSettings.brand?.aboutVideoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewVideoUrl(localSettings.brand?.aboutVideoUrl || null);
                        setPreviewVideoTitle("SABO Tarixi va Fermerlik");
                      }}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="size-3" />
                      <span>Ko&apos;rish</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={localSettings.brand?.aboutVideoUrl || ""}
                    onChange={(e) => handleBrandChange("aboutVideoUrl", e.target.value)}
                    placeholder="/video/sabo-milk-pour.mp4"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs font-mono font-medium text-foreground focus:border-primary outline-hidden"
                  />
                  <label className="p-2.5 rounded-xl border border-border bg-surface-elevated hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0">
                    {uploadingTarget === "aboutVideoUrl" ? (
                      <div className="size-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload("aboutVideoUrl", f);
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Global Add-ons */}
          <div className="space-y-6">
            {/* Global Add-ons Manager */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display font-black text-lg text-foreground flex items-center gap-2">
                  <Package className="size-5 text-primary" />
                  <span>Qo&apos;shimchalar (Add-ons)</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddOnAdd}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Qo&apos;shish</span>
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {(localSettings.brand?.addOnsCatalog || []).map((addon, idx) => (
                  <div
                    key={addon.id || idx}
                    className="p-3.5 rounded-2xl bg-background border border-border flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={addon.name.uz}
                        onChange={(e) =>
                          handleAddOnUpdate(idx, "name", { ...addon.name, uz: e.target.value })
                        }
                        placeholder="Nomi (UZ)"
                        className="flex-1 px-2.5 py-1 rounded-lg border border-border bg-surface text-xs font-bold text-foreground outline-hidden focus:border-primary"
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          value={addon.price}
                          onChange={(e) =>
                            handleAddOnUpdate(idx, "price", Number(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 rounded-lg border border-border bg-surface text-xs font-bold text-action-red outline-hidden focus:border-primary"
                        />
                        <span className="text-xs font-bold text-muted">UZS</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddOnRemove(addon.id)}
                        className="p-1.5 rounded-lg text-muted hover:text-action-red hover:bg-action-red/10 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={addon.description?.uz || ""}
                      onChange={(e) =>
                        handleAddOnUpdate(idx, "description", {
                          ...addon.description,
                          uz: e.target.value,
                        })
                      }
                      placeholder="Qisqa tavsif..."
                      className="w-full px-2.5 py-1 rounded-lg border border-border/60 bg-surface/50 text-[11px] text-muted outline-hidden focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {previewVideoUrl && (
        <VideoPlayerModal
          videoUrl={previewVideoUrl}
          title={previewVideoTitle}
          isOpen={!!previewVideoUrl}
          onClose={() => setPreviewVideoUrl(null)}
        />
      )}
    </div>
  );
}
