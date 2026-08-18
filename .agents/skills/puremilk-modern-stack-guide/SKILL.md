---
name: puremilk-modern-stack-guide
description: >-
  Modern web stack selection, optimal language distribution, and 100% free
  deployment & hosting guidelines for PureMilk. Covers React 19, TypeScript,
  Tailwind CSS v4, Motion, Three.js, Node.js/Express, SQLite/Supabase, and Cloudflare/Vercel.
---

# 🚀 PureMilk — Modern Tech Stack, Language % & Free Hosting Guide

## 00. Optimal Texnologik Stek va Til Taqsimoti (Language Distribution)
PureMilk platformasi yagona va uzviy ekotizim yaratish uchun **TypeScript Full-Stack** tamoyiliga asoslanadi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PUREMILK FULL-STACK DASTURLASH TILLARI                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🟦 TypeScript (Full-Stack) : 85%                                            │
│    • Frontend : React 19 + TypeScript (Vite, Contextlar, UI Komponentlar)    │
│    • Backend  : Node.js + Express (TypeScript, REST API, Webhooks, Auth)    │
│    • Shared   : src/types/index.ts (Barcha API va ma'lumotlar modellari)    │
│ 🟩 CSS / Tailwind CSS v4    : 10% (Dizayn tokenlar, Responsive, Dark/Light) │
│ 🟧 HTML5 Semantics          : 3%  (SEO JSON-LD, WCAG AA Accessibility)      │
│ 🟨 WebGL / Shader / JSON    : 2%  (3D Sut stakani Canvas, i18n tarjimalar)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 01. Nega Aynan Ushbu Stek? (Afzalliklari)

1. **Frontend:** `React 19` + `TypeScript` + `Vite`
   - Eng tezkor build va Hot Module Replacement (HMR).
   - Zero-overhead, yuqori darajadagi xavfsizlik va avtomatik optimizatsiya.
2. **Backend:** `Node.js` + `Express` + `TypeScript (TSX)`
   - Frontend bilan bitta tilda (`TypeScript`), bir xil tiplarni to'g'ridan-to'g'ri ulash (`src/types/index.ts`).
   - Click va Payme to'lov webhooklari, savat buyurtmalarini qayta ishlash.
3. **Stilizatsiya:** `Tailwind CSS v4` + `Vanilla CSS Tokens`
   - Maketdagi dizayn tokenlariga 100% moslik.
   - Minimal CSS hajmi (keraksiz klasslar avtomatik tozalanadi).
4. **Animatsiya va 3D:** `Motion` (Framer Motion) + `Three.js / HTML5 Canvas`
   - 60-120 fps silliq harakatlar va real vaqtdagi 3D sut shishasi / stakani effekti.
5. **Ikonkalar:** `Lucide React`
   - Toza, vektorli, har bir sahifaga moslashuvchan yengil ikonkalar.
6. **Ma'lumotlar Bazasi:** `SQLite` / `Supabase (PostgreSQL)`
   - Tezkor, ishonchli va kengaytiriluvchan (scalable) arxitektura.

---

## 02. Bepul Joylashtirish va Hosting Yo'nalishlari (100% Free Tiers)

| Yo'nalish | Tavsiya Qilingan Servis | Imkoniyati & Bepul Tarif |
|---|---|---|
| **Frontend Hosting** | **Vercel / Cloudflare Pages / Netlify** | Cheksiz bepul SSL, global CDN, avtomatik GitHub integratsiyasi |
| **Backend & API** | **Render / Railway / Cloudflare Workers / Fly.io** | Serverless yoki doimiy ishlovchi bepul API konteynerlari |
| **Database** | **Supabase (PostgreSQL) / Turso (SQLite)** | 500MB+ bepul relational baza, realtime obunalar, JWT auth |
| **Media & Images** | **Cloudinary / Supabase Storage** | Bepul WebP/AVIF transformatsiyasi va media hosting |
| **Domen & DNS** | **Cloudflare DNS / .uz registrator** | Bepul DDoS himoyasi, tezkor DNS va SSL sertifikat |

---

## 03. O'rnatish va Ishga Tushirish Qadamlari
```bash
# 1. Bog'liqliklarni o'rnatish
npm install # yoki bun install / pnpm install

# 2. Frontend serverini yoqish (Port 3000)
npm run dev

# 3. Backend API serverini yoqish (Port 5000)
npm run server

# 4. TypeScript tekshiruvi (0 ta xato)
npm run typecheck # tsc --noEmit

# 5. Production versiyani yig'ish (Build)
npm run build
```
