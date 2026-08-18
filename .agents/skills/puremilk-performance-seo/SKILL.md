---
name: puremilk-performance-seo
description: >-
  Performance budgets, Core Web Vitals optimization, and E-commerce Technical
  SEO guidelines for PureMilk. Covers crawlability, Schema.org JSON-LD
  structured data, responsive images, and real-device testing.
---

# ⚡ PureMilk — Performance & E-commerce SEO Protocol

## 00. Asosiy Falsafa: REAL USER EXPERIENCE
Performance faqat kompyuterdagi sun'iy Lighthouse balli bilan o'lchanmaydi.
PureMilk: **Real Device + Real Network + Real User Experience** asosida optimallashtiriladi.

---

## 01. Performance Budget (Ko'rsatkichlar Me'yori)
- **LCP (Largest Contentful Paint):** < 2.5s (Critical hero elementlar uchun)
- **INP (Interaction to Next Paint):** < 200ms
- **CLS (Cumulative Layout Shift):** < 0.1 (Rasmlarda qat'iy width/height va aspect-ratio)
- **JavaScript Bundle Size:** Keraksiz og'ir kutubxonalar qo'shilmaydi (Native browser API va Tailwind CSS ustuvor).

---

## 02. Rasmlarni Optimallashtirish (Image Optimization)
1. Barcha rasm va grafiklar zamonaviy WebP / AVIF formatida yoki siqilgan SVG formatida bo'ladi.
2. Hero banner rasmi — `fetchpriority="high"`, pastki bo'limlardagi mahsulot rasmlari esa `loading="lazy"` bilan yuklanadi.
3. Rasm yuklanganda sahifa sakrab ketmasligi uchun barcha `<img>` teglarida `aspect-ratio` yoki aniq `width` va `height` ko'rsatiladi.

---

## 03. E-commerce Technical SEO & Structured Data (JSON-LD)
Qidiruv tizimlari (Google, Yandex) uchun sahifalarda semantik va strukturaviy ma'lumotlar bo'lishi shart:

### 1. Schema.org JSON-LD Turlari:
- **Product Schema (`@type: "Product"`):** Mahsulot nomi, rasmi, tavsifi, narxi (`offers`), valyuta (`UZS`), mavjudligi (`InStock`).
- **Organization Schema (`@type: "Organization"`):** PureMilk brendi, logotip, aloqa telefonlari, rasmiy veb-sayt.
- **BreadcrumbList Schema:** `Bosh sahifa > Katalog > Sut mahsulotlari > Toza Sut 1L`.

### 2. Semantik HTML Ierarxiyasi:
- Har bir sahifada faqat bitta `<h1>` sarlavha.
- To'g'ri teglardan foydalanish: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.

### 3. Meta Teglar & Open Graph:
- `title`, `meta description`, `canonical` URL.
- Ijtimoiy tarmoqlar uchun: `og:title`, `og:description`, `og:image`, `twitter:card`.
