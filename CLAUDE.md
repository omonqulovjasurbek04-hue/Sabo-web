# CLAUDE.md — SABO

SABO — premium sut mahsulotlari (dairy) brendi uchun veb-platforma.
Ushbu fayl har yangi sessiya boshida o'qiladi. Quyidagi qarorlar barqaror — boshqa so'ralmasa o'zgartirilmaydi.

## ENG MUHIM QOIDA — FAQAT TASDIQLANGAN MA'LUMOT

SABO haqida quyidagilarni HECH QACHON o'ylab topma:
kompaniya tarixi/yoshi, ishlab chiqarish quvvati, sertifikatlar (ISO, HACCP, Halal),
manzil, telefon, email, mahsulot tarkibi/ozuqaviy qiymati, narx, saqlash muddati,
mavjudlik, sharh/reyting/statistika.

- MANBA BOR → ISHLAT
- MANBA YO'Q → maydonni butunlay YASHIR (hech qachon "N/A"/"undefined"/soxta qiymat chiqarma)
- To'lov/backend: hech qachon "soxta muvaffaqiyat" ko'rsatma — faqat real API ulanganda ishlaydi

## Stack (tasdiqlangan)

- Next.js 15 (App Router) + React 19 + TypeScript (strict). Dev: `next dev --turbopack`; Build: `next build` (**webpack** — Turbopack build Windows'da `pages-manifest.json` race + `next start` "dataRoutes is not iterable" bug beradi, faqat dev'da ishlatiladi)
- **Tailwind CSS v4 + shadcn/ui** — Natural Premium Design System (`globals.css` da `@theme` directive)
- **Animatsiya**: opacity/transform/scale (150–300ms) + 3D/Advanced Animation layer (spec #51–92) — `three ^0.185.1` (plain Three.js, R3F yo'q), lazy-loaded, WebGL fallback'li (qoidalar pastda)
- **Haqiqiy Rasmlar Bazasi**: `image/` dagi real packaging va tabiiy suratlar `public/images/products/` va `public/images/nature/` da ishlatilmoqda
- i18n: o'z tizimi — `src/locales/{uz,ru,en}.ts` (JSON emas, TS; matnlar componentga hardcode qilinmaydi)
- Tema: o'z ThemeProvider (light/dark/system, `data-theme` attributi, localStorage `sabo-theme`, `theme-init.tsx` flash-ning oldini oladi)
- Fontlar: `next/font` — Playfair Display (heading), Inter (body), faqat ishlatilgan weight'lar
- Backend/DB: hozircha YO'Q — ma'lumotlar `src/data/` dan; real API keyingi bosqichda

## 3D Layer Qoidalari (spec #51–92)

- Komponentlar `src/components/3d/` da: `Hero3D`, `Product3DViewer`, `InteractiveProduct`,
  `ParallaxNature`, `MilkDropAnimation`, `ParticleField`, `SceneLoader`, `WebGLFallback`.
- Har bir WebGL komponent: dinamik import (`ssr: false` + Suspense), wrapper'da WebGL
  detect + `prefers-reduced-motion` + device tier tekshiruvi — yo'q bo'lsa **statik rasm**
  (bo'sh maydon ko'rsatilmaydi; statik rasm doim tagda, canvas fade-in).
- Animatsiya qiymatlari: hero tilt 3–6°, float 0→-8px (sin), sekin 360° (hover'da pauza),
  card hover scale 1.02 + translateY(-4px) 250ms; particles desktop 50–150 / mobile 10–30.
- Haqiqiy mahsulot rasmlari ishlatiladi — soxta 3D model/packaging yaratilmaydi.
- Unmount'da: cancelAnimationFrame + geometry/material/texture/renderer `dispose()`.
- Har yangi 3D o'zgarishdan keyin: `npm run lint` + `npx tsc --noEmit` + `next build`
  (webpack) + smoke test (ERROR-LOG #19–21 da ko'rsatilgan holda).

## Natural Premium Dizayn Tokenlari

Light / Kunduzgi:
- Background: #F7F5EF (sutli, tabiiy iliq oq)
- Surface: #FFFFFF (toza oq card/container)
- Primary Green: #2F6B45 (asosiy tabiiy brand rang)
- Natural Green: #708B3E (yaylov yashili)
- Light Green: #E7F0E5 (yumshoq section fonlari)
- Sky Blue: #95BFEE (tog' va osmon ko'ki)
- Soft Blue: #E8F3FB (info cardlar)
- SABO Red: #C71925 (faqat logo, action, CTA, narx, muhim badge)
- Dark Red: #9F1720 (hover/active state)
- Main Text: #24332B (tabiiy to'q yashil-kulrang)
- Secondary Text: #65716A (muted)
- Border: #DDE4DE

Dark / Tungi:
- Background: #101A16 (tabiiy to'q yashil-qora)
- Surface: #17251F
- Elevated: #203128
- Primary Green: #76A978
- Natural Green: #8FAF58
- Sky Blue: #79AEDD
- SABO Red: #E53A43
- Main Text: #F3F6F1
- Secondary Text: #AAB8AE
- Border: #304139

## Rasmlar Boshqaruvi
- `image/` dagi rasmlar `public/images/products/` va `public/images/nature/` ga ko'chirilgan.
- Barcha mahsulotlar (`Sabo_Milk.jpg`, `SaboSutim.jpg`, `Sabo_Kefir.jpg`, `Sabo_Kefir_05.jpg`, `Sabo_Yogurt.jpg`, `Sabo_Smetana.jpg`, `Sabo_Qaymoq.jpg`) haqiqiy packaging fotolari bilan ishlamoqda.
- Mahsulot rasmlariga hech qanday CSS rang filtrlari qo'llanmaydi.
