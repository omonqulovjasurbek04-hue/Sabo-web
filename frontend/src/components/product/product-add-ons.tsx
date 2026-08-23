"use client";

import { Check, Plus, Gift, ShieldCheck, Sparkles, ThermometerSnowflake, Utensils } from "lucide-react";
import type { ProductAddOn } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locales";
import { localize } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface ProductAddOnsProps {
  addOns?: ProductAddOn[];
  selectedAddOns: ProductAddOn[];
  onToggleAddOn: (addOn: ProductAddOn) => void;
  locale: Locale;
}

export function ProductAddOns({
  addOns = [],
  selectedAddOns,
  onToggleAddOn,
  locale,
}: ProductAddOnsProps) {
  // Default list of SABO accessories / add-ons if none provided
  const availableAddOns: ProductAddOn[] = addOns.length > 0 ? addOns : [
    {
      id: "addon-eco-box",
      name: {
        uz: "Sovg'abop Eko-quti",
        ru: "Подарочная Эко-коробка",
        en: "Gift Eco-box Packaging",
      },
      price: 5000,
      description: {
        uz: "Sifatli va chiroyli SABO qadoqi",
        ru: "Эстетичная подарочная упаковка",
        en: "Premium aesthetic gift packaging",
      },
      icon: "gift",
    },
    {
      id: "addon-thermo-bag",
      name: {
        uz: "Sovutgichli Termopaket (+4°C)",
        ru: "Термопакет охлаждающий (+4°C)",
        en: "Thermal Cooling Pouch (+4°C)",
      },
      price: 12000,
      description: {
        uz: "Yetkazib berishda haroratni 4 soat saqlaydi",
        ru: "Сохраняет свежесть и холод до 4 часов",
        en: "Maintains optimal cold freshness up to 4h",
      },
      icon: "thermo",
    },
    {
      id: "addon-eco-spoon",
      name: {
        uz: "Ekologik Yog'och Qoshiqcha",
        ru: "Экологичная деревянная ложка",
        en: "Eco-friendly Wooden Spoon",
      },
      price: 2000,
      description: {
        uz: "Yogurt va smetana iste'moli uchun qulay",
        ru: "Удобно для йогурта и сметаны",
        en: "Convenient for yogurt & sour cream",
      },
      icon: "spoon",
    },
  ];

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "gift":
        return <Gift className="size-4 text-emerald-600" />;
      case "thermo":
        return <ThermometerSnowflake className="size-4 text-sky-600" />;
      case "spoon":
        return <Utensils className="size-4 text-amber-600" />;
      default:
        return <Sparkles className="size-4 text-primary" />;
    }
  };

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-surface border border-border shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4.5 text-primary" />
          <h3 className="font-bold text-sm text-foreground">
            {locale === "ru" ? "Дополнительные опции и аксессуары" : locale === "en" ? "Additional Options & Add-ons" : "Qo'shimcha qulayliklar va aksessuarlar"}
          </h3>
        </div>
        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-secondary-soft text-secondary">
          {selectedAddOns.length} {locale === "ru" ? "выбрано" : locale === "en" ? "selected" : "tanlandi"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 mt-1">
        {availableAddOns.map((item) => {
          const isSelected = selectedAddOns.some((s) => s.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleAddOn(item)}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                isSelected
                  ? "bg-primary-soft/40 border-primary shadow-xs ring-1 ring-primary/30"
                  : "bg-background/60 border-border hover:border-border-strong hover:bg-background"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-surface border border-border mt-0.5">
                  {getIcon(item.icon)}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-foreground">
                    {localize(item.name, locale)}
                  </div>
                  {item.description && (
                    <div className="text-[11px] text-muted font-medium mt-0.5">
                      {localize(item.description, locale)}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="font-black text-xs sm:text-sm text-action-red font-display">
                  +{formatPrice(item.price, locale)}
                </span>
                <div
                  className={`size-6 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected ? "bg-primary text-white" : "border border-border bg-surface text-muted"
                  }`}
                >
                  {isSelected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
