---
name: puremilk-animations-3d
description: >-
  Modern 3D and rich interactive animations implementation skill for PureMilk.
  Guides Three.js WebGL rendering, Framer Motion/CSS micro-interactions,
  scroll-driven reveals, counter animations, and reduced-motion fallbacks.
---

# ✨ PureMilk — 3D & Advanced Interactive Animations Protocol

## 00. Asosiy Maqsad: WOW-EFFECT & LIGHTWEIGHT PERFORMANCE
PureMilk interfeysi foydalanuvchiga "tabiiy soflik va zamonaviy premium texnologiya" tuyg'usini berishi kerak. Animatsiyalar chiroyli, silliq (60-120fps) va hech qachon qurilmani qotirib qo'ymaydigan bo'lishi shart.

---

## 01. 3D WebGL Elementlar (Three.js & Canvas)

### 1. Hero 3D Sut Stakani / Shisha Idish Komponenti (`MilkGlass3D.tsx`)
- **Texnologiya:** Three.js / WebGL / Canvas.
- **Funksionalligi:** 
  - Kursor harakatiga nisbatan silliq 3D burilish (parallax tilt effect).
  - Sut suyuqligi va shisha yaltiroqligi (subsurface scattering va transmission shaders).
  - Kondensatsiya (sovuq shishadagi tomchilar) va mayin to'lqinlar (fluid wave ripple).
  - Mobil qurilmalarda yoki batareya tejash rejimida avtomatik ravishda yengil Canvas/CSS rejimiga o'tadi.

---

## 02. Interaktiv Animatsiyalar (Interactive Motion & Micro-interactions)

### 1. Scroll Reveal & Stagger Effects
- Har bir bo'lim scroll qilinganda silliq `opacity: 0 -> 1` va `translateY: 24px -> 0px` bilan paydo bo'ladi.
- Mahsulotlar to'ri (product grid) stagger animatsiyasi orqali navbatma-navbat ko'tariladi.

### 2. Dinamik Statistika Counterlari (`CountUp`)
- `20+ yil`, `500 tonna/kun`, `50+ mahsulot`, `100% sifat nazorati` raqamlari ko'rinish maydoniga (viewport) kirishi bilanoq 0 dan o'z qiymatigacha `easeOutExpo` bilan aylanadi.

### 3. Kartochka va Tugmalar Micro-interactionlari:
- **Hover Lift:** `transform: translateY(-4px)`, yumshoq soyalar (`box-shadow: 0 12px 30px rgba(5,36,23,0.1)`).
- **Magnetic / Fluid Button Effect:** Asosiy tugmalar kursorga mayin tortiladi.
- **Organic Blob & Wave Shimmer:** Rasm va fonlarda mayin organik to'lqin harakati.

---

## 03. Accessibility: `prefers-reduced-motion`
Foydalanuvchi tizimida harakatlarni kamaytirish sozlamasi yoqilgan bo'lsa:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Barcha 3D aylanuvchi modellar statik holatga o'tadi va barcha animatsiyalar darhol yakunlanadi.
