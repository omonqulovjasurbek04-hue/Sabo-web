---
name: puremilk-fact-integrity
description: >-
  Fact and Content Integrity Protocol for PureMilk. Guarantees that no fake
  business statistics, awards, certifications, or nutrition numbers are
  fabricated by AI without verified sources.
---

# 🛡️ PureMilk — Fact & Content Integrity Protocol

## 00. Qat'iy Buyruq: SOURCE OF TRUTH YO'Q BO'LSA — FAKT YO'Q
PureMilk veb-saytida ishlatiladigan har qanday biznes statistikasi, sertifikatlar, zavod quvvati, ozuqaviy qiymatlar (nutrition facts) yoki marketing da'volari:
**HAQIQIY VA TASDIQLANGAN MANBAGA EGA BO'LISHI SHART.**

> AI Agent, Developer yoki Designer:
> **HECH QACHON MA'LUMOTNI O'ZIDAN TO'QIB CHIQARMAYDI (NO FABRICATION).**

---

## 01. Taqiqlangan Soxta Ma'lumotlar (Forbidden Fabrications)
Agar mijoz yoki rasmiy hujjat tomonidan berilmagan bo'lsa, quyidagilarni fakt sifatida yozish taqiqlanadi:
- ❌ "20+ yil tajriba" (agar rasmiy tashkil etilgan yil bo'lmasa)
- ❌ "500 tonna/kun ishlab chiqarish quvvati"
- ❌ "ISO 9001", "HACCP", "Halol" sertifikat raqamlari va berilgan sanalari
- ❌ "100 000+ mamnun mijozlar"
- ❌ "20 ta davlatga eksport"
- ❌ "O'zbekistonda №1 sut kompaniyasi"
- ❌ Soxta mijoz sharhlari (fake testimonials/reviews)
- ❌ Soxta rahbarlar (CEO, direktor) ismlari va fotosuratlari

---

## 02. Ma'lumot Yetishmaganda Nima Qilish Kerak? (Placeholder Policy)
Agar loyihada biror ma'lumot (masalan, telefon, sertifikat PDF, aniq ozuqa qiymati) tasdiqlanmagan bo'lsa:
1. **Neytral Development Placeholder ishlatiladi:**
   - `[Ishlab chiqarish quvvati — Tasdiqlangan ma'lumot kutilmoqda]`
   - `[Sertifikat raqami: ISO-XXXXXX]`
   - `[Bog'lanish: info@puremilk.uz / +998 (71) 200-88-99]`
2. **Kodni to'xtatmasdan, ma'lumot yetishmasligini `data.ts` yoki `Task.md` da aniq belgilab ketish kerak.**

---

## 03. Ozuqaviy Qiymat (Nutrition Facts) Qoidalari
Har bir mahsulot (Sut, Qatiq, Sariyog', Pishloq) uchun:
- Kaloriya (kcal per 100g), oqsillar (proteins), yog'lar (fats), uglevodlar (carbs) faqat haqiqiy standart laboratoriya me'yorlariga asoslanadi.
- Standart me'yorlar `src/constants/data.ts` dagi tasdiqlangan obyektdan olinadi.

---

## 04. Sertifikatlar va Hujjatlar
- ISO 9001:2015, HACCP (ISO 22000), Halol sertifikatlari uchun:
  - Sertifikat nomi, beruvchi tashkilot va PDF yuklab olish tugmasi taqdim etiladi.
  - O'zboshimchalik bilan yangi davlat organlari yoki soxta litsenziyalar yozilmaydi.
