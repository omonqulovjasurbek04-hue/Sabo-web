---
name: puremilk-senior-qa-review
description: >-
  10-year Senior Developer code review and QA audit protocol for PureMilk.
  Inspects TypeScript type safety, WCAG AA accessibility, responsive fidelity
  (360px-1920px), state management, error handling, and performance regressions.
---

# 🔍 PureMilk — 10-Year Senior Dev Code Review & QA Protocol

## 00. Asosiy Vazifa: QAT'IY KOD VA SIFAT AUDITI
Ushbu protokol Claude, Gemini yoki boshqa AI agentlariga 10 yillik tajribali Senior Software Architect darajasida butun kod bazasini tekshirish, nuqsonlarni aniqlash va darhol tuzatish vakolatini beradi.

---

## 01. Audit Checklist (Tekshiruv Ro'yxati)

### 1. TypeScript & Type Safety (Tip Xavfsizligi)
- `tsc --noEmit` tekshiruvida **0 ta xato** bo'lishi shart.
- `any` yoki `unknown` dan noo'rin foydalanish qat'iyan man etiladi.
- Barcha `Product`, `Order`, `CartItem`, `Language`, `NutritionFacts` tiplari qat'iy tekshiriladi.

### 2. Accessibility (a11y) & WCAG AA Standarti
- Barcha interaktiv elementlarda (`<button>`, `<a>`, `<input>`) to'g'ri `aria-label`, `role` va `title` bo'lishi shart.
- Matn va fon kontrasti kamida `4.5:1` bo'lishi kerak.
- Klaviatura orqali navigatsiya (Tab, Enter, Escape, Arrow keys) to'liq ishlashi kerak (Modallar, Cart Drawer, Search, Til almashtirgich).

### 3. State Management & Context Integrity
- Savat (Cart), Buyurtmalar (Checkout), Sevimlilar (Favorites), Foydalanuvchi tizimi (Auth), Til (Language: UZ/RU/EN) va Tema (Theme: Dark/Light) kontekstlari `localStorage` bilan to'g'ri sinxronizatsiya qilinishi va xotira sizib chiqishi (memory leak) bo'lmasligi kerak.

### 4. Responsiveness & Cross-Device QA
- 360px (kichik telefon), 390px (iPhone), 768px (iPad), 1024px (planshet), 1440px (desktop), 1920px (katta monitor) da sinovdan o'tkazish.
- Sahifada kutilmagan gorizontal scroll (`overflow-x`) yo'qligini tekshirish.

### 5. Error Boundaries & Fallback UI
- Rasm yuklanmay qolganda chiroyli fallback / placeholder ko'rsatilishi kerak (`onError` handler).
- Sahifada topilmagan mahsulot yoki maqola bo'lsa, mos 404/Empty State ko'rsatilishi shart.
