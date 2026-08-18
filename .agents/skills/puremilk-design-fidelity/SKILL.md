---
name: puremilk-design-fidelity
description: >-
  Strict design fidelity protocol and UI implementation guidelines for PureMilk.
  Enforces Figma/HTML mockup as single source of truth, token-first development,
  component reuse, responsive layout rules, and prevents unauthorized redesigns.
---

# 🎨 SABO — Design Fidelity & UI Implementation Protocol

## 00. Asosiy Qoida: SOURCE OF TRUTH
SABO loyihasida dizayn va vizual ko'rinish bo'yicha asosiy va yagona haqiqat manbasi:
1. **SABO Kefir qadog'i va SABO Brand Rang Tizimi** (Source of Truth).
2. Tasdiqlangan Figma / UI Component Kit va Dizayn Tokenlari.

> **FRONTEND DEVELOPER VAZIFASI — DIZAYNNI QAYTA YARATISH EMAS.**
> Vazifa: Tayyorlangan dizayn tizimi, tokenlar va maketlarni 1:1 aniqlik (Pixel-Perfect) bilan kodga o'tkazish.

---

## 01. SABO Brand Ranglari va Dizayn Tokenlari

### ☀️ Light Mode (Kunduzgi Rejim)
| Token | Hex Kod | Vazifasi / Maqsadi |
|---|---|---|
| `background` | `#F8FAFC` | Asosiy sahifa foni |
| `surface` | `#FFFFFF` | Karta, navbar, modallar |
| `surface-soft` | `#EFF7FB` | Yengil ko‘k bloklar, badge, ikonka konteyneri |
| `primary` | `#C71925` | SABO qizil — asosiy CTA, narx, brand highlight |
| `primary-hover` | `#A80F19` | Qizil tugma hover holati |
| `secondary` | `#1684C4` | Kefir/qadoq ko‘k — kategoriya, axborot |
| `secondary-light` | `#E5F3FA` | Ko‘k yumshoq fon |
| `accent` | `#73B832` | Yashil — mahsulotdagi tabiiylik va yangilik |
| `text` | `#17202A` | Asosiy to'q matn |
| `text-secondary` | `#59636D` | Ikkinchi darajali tushuntirish matni |
| `border` | `#DCE3E8` | Ajratuvchi chiziqlar va chegara |
| `white` | `#FFFFFF` | Oq elementlar |

### 🌙 Dark Mode (Tungi Rejim)
| Token | Hex Kod | Vazifasi / Maqsadi |
|---|---|---|
| `background` | `#0D1117` | Asosiy qorong'u fon |
| `surface` | `#151B22` | Karta foni |
| `surface-elevated` | `#1C242D` | Modal, dropdown, suzuvchi panel |
| `primary` | `#E32935` | SABO qizil (dark mode uchun yumshoqroq) |
| `primary-hover` | `#FF4652` | Qizil hover |
| `secondary` | `#2498D1` | Yorqin ko‘k |
| `secondary-soft` | `#102C3C` | Ko‘k dark surface |
| `accent` | `#82C744` | Yorqin tabiiy yashil |
| `text` | `#F5F7F9` | Asosiy oqish matn |
| `text-secondary` | `#AEB7C0` | Ikkinchi darajali kulrang matn |
| `border` | `#29323C` | Qorong'u chegara chiziqlari |

### 🥛 Mahsulot Kartochkasi Qoidalari
- **Light:** Sahifa `#F8FAFC` · Karta `#FFFFFF` · Sarlavha `#17202A` · Narx `#C71925` · Kategoriya `#1684C4` · CTA `#C71925`
- **Dark:** Sahifa `#0D1117` · Karta `#151B22` · Sarlavha `#F5F7F9` · Narx `#E32935` · Kategoriya `#2498D1` · CTA `#E32935`
- 🚫 **MUHIM:** Mahsulot rasmining o‘zidagi qizil, ko‘k va yashil ranglarni CSS filter bilan o‘zgartirmang. Mahsulot real qadoq ko‘rinishida qolishi shart.

### 🏠 Hero Bo'limi Qoidalari
- **Light:** Background `#F8FAFC` · Heading `#17202A` · Highlight `#C71925` · Secondary `#1684C4` · SABO Kefir rasmi · CTA `#C71925`
- **Dark:** Background `#0D1117` · Heading `#F5F7F9` · Highlight `#E32935` · Secondary `#2498D1` · Asl mahsulot rasmi · CTA `#E32935`

---

## 02. Responsive Media Queries & Ekran O'lchamlari

Loyiha barcha qurilmalarda quyidagi media query breakpointlar bo'yicha moslashuvchan (fully responsive):

| Breakpoint | O'lcham (Viewport) | Qurilma Turi | Layout Xususiyatlari |
|---|---|---|---|
| **xs / Mobile** | 360px – 430px | iPhone SE, iPhone 14/15, Galaxy S | 1 ustunli grid, `MobileBottomNav` va `MobileDrawer`, 16px padding |
| **sm / Mobile Large** | 640px | Katta smartfonlar, mini planshet | 2 ustunli mahsulot gridi, ixcham modal |
| **md / Tablet** | 768px | iPad, Android Planshetlar | 2-3 ustunli grid, yon filter paneli toggle |
| **lg / Laptop** | 1024px | MacBook Air, noutbuklar | To'liq desktop navbar, 3 ustunli grid, to'liq yon filtrlar |
| **xl / Desktop** | 1280px | Standart monitorlar | `max-w-7xl` markazlashgan konteyner, 4 ustunli grid |
| **2xl / Ultra-Wide** | 1440px – 1920px | 2K/4K displeylar | Kengaytirilgan bo'shliqlar, optimal o'qiluvchanlik |

---

## 03. UX Bug vs Design Preference

| Turi | Misol | Qilinadigan Ish |
|---|---|---|
| **UX Bug** | Tugma bosilmayapti, matn kontrast pastligi tufayli o'qilmayapti, mobilda rasm chetga chiqib ketdi | **Darhol tuzatiladi** |
| **Accessibility Muammo** | Klaviatura orqali boshqarib bo'lmayapti, aria-label yo'q, focus ring ko'rinmayapti | **Tuzatiladi (WCAG AA bo'yicha)** |
| **Dizayn Tanlovi** | "Menga bu button radiusi 20px bo'lsa chiroyliroq tuyuldi" | **Qat'iyan taqiqlanadi** |
