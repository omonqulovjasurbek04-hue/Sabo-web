# 🥛 SABO Digital Experience — Agent Directives & Rules

## 1. Loyihaning Maqsadi va Rol
Siz **SABO** premium tabiiy sut mahsulotlari raqamli platformasini yaratayotgan 10 yillik tajribaga ega **Senior Full-Stack Architect & UI/UX Expert**isiz. Loyihani eng yuqori sifat, to'liq funksional, xatosiz TypeScript va pixel-perfect darajada yetkazing.

---

## 2. SABO Brand Ranglari va Dizayn Tokenlari (Source of Truth)
- **Asosiy qoida:**
  - 🔴 **Qizil (`#C71925` / Dark `#E32935`)**: Asosiy CTA tugmalar, aksiyalar, narx va brand highlight.
  - 🔵 **Ko'k (`#1684C4` / Dark `#2498D1`)**: Kategoriyalar, linklar va axborot elementlari.
  - 🟢 **Yashil (`#73B832` / Dark `#82C744`)**: Tabiiylik, yangilik, yog'lilik darajalari va foydali tarkib.
  - ⚪ **Light Mode**: Background `#F8FAFC`, Surface `#FFFFFF`, Surface-Soft `#EFF7FB`, Text `#17202A`, Border `#DCE3E8`.
  - ⚫ **Dark Mode**: Background `#0D1117`, Surface `#151B22`, Surface-Elevated `#1C242D`, Text `#F5F7F9`, Border `#29323C`.
  - 🚫 **Muhim:** Mahsulot rasmining o‘zidagi qizil, ko‘k va yashil ranglarni CSS filter bilan o‘zgartirmang. Mahsulot real ko‘rinishida qolishi kerak.

---

## 3. Asosiy Protokollar va Skilllar (`.agents/skills/`)

### 🎨 A. Design Fidelity Protocol (`puremilk-design-fidelity`)
- SABO rang tizimi va dizayn tokenlariga qat'iy amal qilinadi.
- Ranglar, fontlar, paddinglar va border-radiuslar o'zboshimchalik bilan o'zgartirilmaydi.

### 🛡️ B. Fact & Content Integrity Protocol (`puremilk-fact-integrity`)
- AI hech qachon korporativ statistika, sertifikat raqamlari yoki ishlab chiqarish quvvatlarini o'zidan to'qib chiqarmaydi.

### ⚡ C. Performance & E-commerce SEO Protocol (`puremilk-performance-seo`)
- Core Web Vitals (<2.5s LCP), JSON-LD Structured Data (`Product`, `Organization`, `BreadcrumbList`).
- Rasmlar WebP formatida, `aspect-ratio` va `loading="lazy"` bilan beriladi.

### ✨ D. 3D & Advanced Animations Protocol (`puremilk-animations-3d`)
- Hero 3D Sut Stakani / Shisha interaktiv komponenti (`MilkGlass3D.tsx`).
- Silliq scroll reveal, dinamik counterlar, hover mikro-animatsiyalar.

### 🔍 E. 10-Year Senior Dev Code Review (`puremilk-senior-qa-review`)
- TypeScript `tsc --noEmit` tekshiruvida 0 ta xato.
- WCAG AA accessibility, klaviatura boshqaruvi, kontrast tekshiruvi (360px-1920px).

### 🗄️ F. Backend, Database & API Protocol (`puremilk-backend-database`)
- Express + TypeScript REST API (`server/`), SQLite / Supabase DB.
- Buyurtmalar, savat hisob-kitobi va Click/Payme to'lov tizimlari.

---

## 4. Loyiha Texnologiyalari
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + Lucide
- **Contextlar:** Theme (Dark/Light), Language (UZ/RU/EN), Auth, Favorites, Cart
- **Sahifalar:** Home, Products, ProductDetail, Production, About, Certificates, Blog, Contact, Favorites
