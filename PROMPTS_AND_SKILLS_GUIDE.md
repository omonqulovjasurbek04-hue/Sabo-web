# 🥛 SABO — AI Agentlar Uchun To'liq Promptlar va Skilllar Qo'llanmasi

Ushbu hujjat **SABO** loyihasi uchun barcha sun'iy intellekt agentlariga (Claude.ai / Claude Code, Gemini / Antigravity, ChatGPT / Codex) to'liq tushunarli, buyruq beradigan va 10 yillik tajribaga ega dasturchi darajasida ishlatish uchun tayyorlangan universal promptlar va skillar to'plamidir.

---

## 🎨 1. SABO Brand Rang Tizimi va Dizayn Tokenlari (Source of Truth)

### ☀️ Light Mode
| Token | Hex | Vazifasi |
|---|---|---|
| `background` | `#F8FAFC` | Asosiy fon |
| `surface` | `#FFFFFF` | Karta, navbar, modallar |
| `surface-soft` | `#EFF7FB` | Yengil ko‘k bloklar, badge |
| `primary` | `#C71925` | SABO qizil — asosiy CTA, narx, brand highlight |
| `primary-hover` | `#A80F19` | Hover holati |
| `secondary` | `#1684C4` | Kefir/qadoq ko‘k — kategoriya, axborot |
| `secondary-light` | `#E5F3FA` | Ko‘k yumshoq fon |
| `accent` | `#73B832` | Yashil — mahsulotdagi tabiiylik |
| `text` | `#17202A` | Asosiy to'q matn |
| `text-secondary` | `#59636D` | Ikkinchi darajali matn |
| `border` | `#DCE3E8` | Chegaralar va ajratuvchi chiziqlar |

### 🌙 Dark Mode
| Token | Hex | Vazifasi |
|---|---|---|
| `background` | `#0D1117` | Asosiy qorong'u fon |
| `surface` | `#151B22` | Karta foni |
| `surface-elevated` | `#1C242D` | Modal/navbar suzuvchi panel |
| `primary` | `#E32935` | SABO qizil |
| `primary-hover` | `#FF4652` | Hover holati |
| `secondary` | `#2498D1` | Yorqin ko‘k |
| `secondary-soft` | `#102C3C` | Ko‘k dark surface |
| `accent` | `#82C744` | Yorqin yashil |
| `text` | `#F5F7F9` | Asosiy oqish matn |
| `text-secondary` | `#AEB7C0` | Ikkinchi matn |
| `border` | `#29323C` | Chegara chiziqlari |

### 📱 Responsive Media Queries
- **Mobile (360px – 430px):** 1 ustunli grid, pastki `MobileBottomNav`, 16px konteyner padding.
- **Tablet (768px – 1024px):** 2-3 ustunli grid, ochiluvchi filtr paneli, planshetga mos 3D kanvas.
- **Desktop & Ultra-wide (1280px – 1920px):** `max-w-7xl` markazlashgan konteyner, 4 ustunli grid, to'liq animatsiyalar.

---

## 💻 2. Dasturlash Tili va Backend Tili Arxitekturasi
- **Frontend Tili:** TypeScript (React 19, Vite, Tailwind CSS v4, Motion, Canvas/WebGL)
- **Backend Tili:** TypeScript (Node.js, Express, TSX, SQLite/Supabase, REST API)
- **Shared Types:** `src/types/index.ts` — frontend va backend o'rtasida 100% bir xil tiplar.
- **Foizlar Ulushi:** 85% TypeScript, 10% Tailwind CSS v4, 3% HTML5, 2% WebGL/JSON.

---

## 🤖 3. Claude.ai & Claude Code Master Prompt

```markdown
Sen 10 yillik tajribaga ega Senior Full-Stack Architect va UI/UX Ekspertisan.
Sening vazifang — "SABO" premium sut mahsulotlari platformasini eng yuqori darajada, xatosiz va SABO brend ranglariga 100% mos holda yetkazish.

Brand Ranglari:
- 🔴 Qizil (#C71925 / Dark #E32935): Asosiy CTA, narx, highlight.
- 🔵 Ko'k (#1684C4 / Dark #2498D1): Kategoriya, axborot.
- 🟢 Yashil (#73B832 / Dark #82C744): Freshness va tabiiylik.
- ⚪ Light Mode: Fon #F8FAFC, Sirt #FFFFFF, Matn #17202A, Border #DCE3E8.
- ⚫ Dark Mode: Fon #0D1117, Sirt #151B22, Matn #F5F7F9, Border #29323C.
- 🚫 Packaging: Mahsulot fotosiga hech qanday CSS rang filter qo'llanmaydi.

Texnologiyalar:
- 85% TypeScript, React 19, Tailwind CSS v4, Motion, Express REST API, Click/Payme.
- 0 ta TypeScript xatosi (`tsc --noEmit`), WCAG AA accessibility, 360px dan 1920px gacha responsive.
```

---

## ⚡ 4. Google Gemini & Antigravity Master Prompt

```markdown
Siz SABO loyihasining bosh arxitektori va yetakchi dasturchisisiz.
Loyiha qoidalari va SABO dizayn tokenlarini (.agents/skills/ va AGENTS.md) qat'iy qo'llang:
1. Barcha sahifalarni SABO ranglari (#C71925, #1684C4, #73B832, Light #F8FAFC, Dark #0D1117) bilan sinxronlashtirish.
2. 3D WebGL sut stakani va mikro-animatsiyalarni integratsiya qilish.
3. Savat, checkout, to'lov turlari (Click, Payme) va ko'p tillilikni (UZ/RU/EN) to'liq ta'minlash.
4. Type-Safe Backend API (`server/`) va frontend integratsiyasi.
5. 10 yillik Senior Dev sifat auditi bo'yicha 0 ta TypeScript xatosi.
```
