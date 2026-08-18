# 🥛 SABO — Premium Sut Mahsulotlari Platformasi: Master Prompt va Texnik Talablar (prompt.md)

## 📌 Loyiha Haqida va Rol
Siz 10 yillik tajribaga ega **Senior Full-Stack Architect, UI/UX Designer va Frontend Lead**siz. Sening vazifang — **SABO** tabiiy sut mahsulotlari raqamli platformasini eng yuqori darajada, xatosiz, pixel-perfect va to'liq interaktiv holda yaratish va boshqarishdir.

---

## 🎨 1. SABO Brand Rang Tizimi va Dizayn Tokenlari (Source of Truth)

Rasmdagi **SABO Kefir** mahsulotlarining original qadog'idan olingan ranglar sayt dizaynining asosiy vizual manbasi (Source of Truth) hisoblanadi. Sut mahsulotlari saytlarida oq/cream fon va mahsulot ranglarini aksent sifatida ishlatish orqali yuqori darajadagi ishonch va tabiiylik yaratiladi.

### ☀️ Light Mode (Kunduzgi Rejim)
| Token Nomi | Hex Kod | Vazifasi va Qo'llanilishi |
|---|---|---|
| `background` | `#F8FAFC` | Asosiy sahifa foni |
| `surface` | `#FFFFFF` | Karta, navbar, modallar va menyu panellari |
| `surface-soft` | `#EFF7FB` | Yengil ko‘k bloklar, badge, ikonka konteynerlari |
| `primary` | `#C71925` | SABO qizil — asosiy CTA tugmalar, aksiyalar, narx, brand highlight |
| `primary-hover` | `#A80F19` | Qizil tugmalarning hover holati |
| `secondary` | `#1684C4` | Kefir/qadoq ko‘k — mahsulot kategoriyalari, axborot elementlari |
| `secondary-light` | `#E5F3FA` | Ko‘k yumshoq fon |
| `accent` | `#73B832` | Yashil — mahsulotdagi tabiiylik, yangilik va foydali tarkib |
| `text` | `#17202A` | Asosiy sarlavha va to'q matn |
| `text-secondary` | `#59636D` | Ikkinchi darajali tushuntirish va metadata matni |
| `border` | `#DCE3E8` | Ajratuvchi chiziqlar va karta chegaralari |
| `white` | `#FFFFFF` | Sof oq elementlar |

### 🌙 Dark Mode (Tungi Rejim)
> **Qoida:** Dark mode'da qizil rangni haddan tashqari ko'zni charchatadigan darajada yorqin qilib yubormaslik kerak. Logo va brand ranglarining ko'rinishi, kontrasti va vizual qulayligi (WCAG AA) alohida nazorat qilinadi.

| Token Nomi | Hex Kod | Vazifasi va Qo'llanilishi |
|---|---|---|
| `background` | `#0D1117` | Asosiy qorong'u fon |
| `surface` | `#151B22` | Karta foni va asosiy sirt |
| `surface-elevated`| `#1C242D` | Modal, dropdown, suzuvchi panel va menyular |
| `primary` | `#E32935` | SABO qizil (dark UI uchun maxsus sozlangan) |
| `primary-hover` | `#FF4652` | Qizil hover holati |
| `secondary` | `#2498D1` | Yorqin ko‘k |
| `secondary-soft` | `#102C3C` | Ko‘k dark surface |
| `accent` | `#82C744` | Yorqin tabiiy yashil aksent |
| `text` | `#F5F7F9` | Asosiy oqish sarlavha va matn |
| `text-secondary` | `#AEB7C0` | Ikkinchi darajali kulrang matn |
| `border` | `#29323C` | Qorong'u chegara chiziqlari |

### 🔴 Alohida SABO Brand CSS Tokenlari
```css
:root {
  --sabo-red: #C71925;
  --sabo-red-dark: #A80F19;
  --sabo-blue: #1684C4;
  --sabo-blue-light: #E5F3FA;
  --sabo-green: #73B832;
}

.dark {
  --sabo-red: #E32935;
  --sabo-red-dark: #FF4652;
  --sabo-blue: #2498D1;
  --sabo-blue-light: #102C3C;
  --sabo-green: #82C744;
}
```

### 🎯 Ranglarning Semantik Vazifalari:
- 🔴 **Qizil** — asosiy CTA tugmalar, brand highlight, narxlar va chegirmalar.
- 🔵 **Ko‘k** — mahsulot kategoriyalari, linklar, texnologik va informatsion elementlar.
- 🟢 **Yashil** — freshness, tabiiylik, yog'lilik darajalari va sertifikat tasdiqlari.
- ⚪ **Oq** — kartochkalar, toza bo'shliqlar va yengil fonlar.
- ⚫ **Dark** — matnlar, tungi rejim va footer panellari.

---

## 🥛 2. Mahsulot Kartochkasi (Product Card) Arxitekturasi

Rasmdagi mahsulotning o‘zi juda rangli bo‘lgani uchun kartochkani haddan tashqari rangli qilmaslik va toza saqlash lozim:

- **☀️ Light Mode:**
  - Page Background: `#F8FAFC`
  - Card Surface: `#FFFFFF` (Chegara: `#DCE3E8`)
  - Product Image: Original fotosurat (`/image/Sabo_Kefir.jpg`)
  - Title: `#17202A` (Playfair Display / Inter bold)
  - Price: `#C71925` (Katta va ajralib turuvchi)
  - Category Badge: `#1684C4` (`#EFF7FB` yumshoq fon bilan)
  - CTA Button: `#C71925` (Savatga qo'shish)

- **🌙 Dark Mode:**
  - Page Background: `#0D1117`
  - Card Surface: `#151B22` (Chegara: `#29323C`)
  - Product Image: Original fotosurat
  - Title: `#F5F7F9`
  - Price: `#E32935`
  - Category Badge: `#2498D1` (`#102C3C` yumshoq fon bilan)
  - CTA Button: `#E32935`

> 🚫 **QAT'IY QOIDA:** Mahsulot rasmining o‘zidagi qizil, ko‘k va yashil ranglarni CSS filter (`hue-rotate`, `invert`, `grayscale`) bilan o‘zgartirmang. Mahsulot real qadoq ko‘rinishida qolishi shart!

---

## 🏠 3. Hero Bo'limi Arxitekturasi

Hero bo'limida mahsulot asosiy vizual markaz (Visual Anchor) hisoblanadi:

- **☀️ Light Mode:**
  - Background: `#F8FAFC`
  - Heading: `#17202A`
  - Highlight Accent: `#C71925`
  - Secondary Info: `#1684C4`
  - Product Visual: Katta SABO Kefir qadog'i + 3D interaktiv stakan
  - Primary CTA: `#C71925` (Katalogga o'tish)
  - Secondary CTA: `#EFF7FB` (Biz haqimizda)

- **🌙 Dark Mode:**
  - Background: `#0D1117`
  - Heading: `#F5F7F9`
  - Highlight Accent: `#E32935`
  - Secondary Info: `#2498D1`
  - Product Visual: Katta original mahsulot rasmi + 3D stakan
  - Primary CTA: `#E32935`
  - Secondary CTA: `#1C242D`

---

## 📱 4. To'liq Responsive Media Queries va Viewportlar

Loyiha barcha qurilmalarda 100% moslashuvchan ishlashi uchun quyidagi 8 ta standart breakpointga rioya qilinadi:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SABO RESPONSIVE BREAKPOINT MATRITSASI                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📱 xs (360px - 430px)   : Mobile (iPhone SE, 13/14/15, Galaxy S)            │
│    • 1 ustunli kartochkalar, MobileBottomNav va MobileDrawer faol           │
│    • Kichik paddinglar (16px), gorizontal scroll yo'q (overflow-x-hidden)   │
│ 📱 sm (640px)           : Katta smartfonlar va phabletlar                   │
│    • 2 ustunli mahsulot gridi, ixcham modal oynalar                         │
│ 💻 md (768px)           : Planshetlar (iPad mini, iPad Air vertical)        │
│    • 2-3 ustunli grid, filtrlar uchun yonma-yon drawer                      │
│ 💻 lg (1024px)          : Noutbuklar va iPad Pro horizontal                 │
│    • To'liq Desktop Navbar, 3 ustunli grid, to'liq ochiq yon filtr paneli   │
│ 🖥️ xl (1280px)          : Standart monitorlar                               │
│    • max-w-7xl markazlashgan konteyner, 4 ustunli mahsulotlar katalogi      │
│ 🖥️ 2xl (1440px - 1920px): Katta monitorlar va Ultra-Wide ekranlar           │
│    • Optimal bo'shliqlar, 24px/32px gutter, yuqori darajadagi o'qiluvchanlik │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Media Query Qoidalari:
1. Hech qanday qurilmada matn yoki tugmalar qirqilib (text cut-off) ketmasin.
2. Interaktiv elementlar (tugmalar, filtr chekbokslari) sensorli ekranlarda kamida **44x44px** bosish maydoniga ega bo'lsin.
3. `prefers-reduced-motion: reduce` foydalanuvchi sozlamasi faol bo'lganda og'ir animatsiyalar avtomatik to'xtatiladi.

---

## 🌓 5. Kun (Light) va Tun (Dark) Rejimi Sinxronizatsiyasi

- **Theme Context:** `src/context/ThemeContext.tsx` orqali boshqariladi va `localStorage.getItem('sabo_theme')` da saqlanadi.
- **Root Element:** `<html>` tegiga `.dark` klassi dinamik tarzda qo'shiladi va o'chiriladi.
- **Silliq O'tish:** Ranglar almashinuvi paytida ko'zni charchatmaslik uchun `transition-colors duration-300` qo'llaniladi.
- **Kontrast (Accessibility):** Barcha sirt va matnlar orasidagi kontrast nisbati kamida **4.5:1 (WCAG AA)** talabiga javob beradi.

---

## 💻 6. Dasturlash Tili va Backend Tili Arxitekturasi

Loyiha to'liq **TypeScript (Full-Stack)** arxitekturasida qurilgan:
- **85% TypeScript:** React 19 UI komponentlar, Vite ekotizimi, Express REST API, to'lov shlyuzlari.
- **10% Tailwind CSS v4:** SABO dizayn tokenlari, utility sinflar, animatsiyalar.
- **3% HTML5 Semantics:** SEO JSON-LD structured data, WCAG AA teglari.
- **2% WebGL / Canvas:** 3D sut stakani renderi va ko'p tilli JSON lug'atlar.

---

## 🚀 7. Buyruqlar va Ishga Tushirish
- `npm run dev` — Frontend dev serveri (`localhost:3000` / `localhost:3001`).
- `npm run server` — Backend API serveri (`localhost:5000` TypeScript tsx).
- `npm run typecheck` — 0 ta TypeScript xatosi bilan kod sifatini tekshirish.
- `npm run build` — Production uchun optimallashtirilgan build yaratish.
