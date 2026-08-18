---
name: puremilk-ecommerce-architecture
description: >-
  Full architecture, state management, and multi-language/multi-theme guidelines
  for PureMilk. Covers Cart, Checkout, Auth, Favorites, i18n (UZ/RU/EN), and
  Dark Mode.
---

# 🛒 PureMilk — E-Commerce Architecture & i18n Protocol

## 00. Arxitektura Tuzilishi

PureMilk to'liq e-commerce funksionaliga ega zamonaviy veb-platformadir:
```
src/
├── context/
│   ├── ThemeContext.tsx      # Dark / Light mode (Tailwind dark class + localStorage)
│   ├── LanguageContext.tsx   # UZ / RU / EN ko'p tillilik tizimi
│   ├── AuthContext.tsx       # Foydalanuvchi profil va buyurtmalar tarixi
│   ├── FavoritesContext.tsx  # Sevimli mahsulotlar (Wishlist)
│   └── CartContext.tsx       # Savat, hajm/narx tanlash, miqdor, kassa hisob-kitobi
├── constants/
│   ├── data.ts               # Tasdiqlangan mahsulotlar, filiallar, sertifikatlar
│   └── translations.ts       # 3 tildagi barcha UI matnlar va tarjimalar
├── components/
│   ├── layout/               # Navbar, Footer, MobileDrawer, MobileBottomNav, SearchModal
│   ├── cart/                 # CartDrawer, CheckoutModal (Click, Payme, Naqd, Karta)
│   ├── auth/                 # AuthModal, ProfileModal
│   ├── product/              # ProductCard, NutritionFacts, ProductGallery
│   └── ui/                   # Button, Badge, Modal, Toast, SectionHeader
└── pages/
    ├── HomePage.tsx          # Bosh sahifa (Hero 3D, Kategoriyalar, Sifat, Statistika)
    ├── ProductsPage.tsx      # Katalog (Filtrlar: Yog'liligi, Hajm, Laktozasiz, Narx)
    ├── ProductDetailPage.tsx # Mahsulot tafsiloti, hajm tanlash, ozuqa faktlari
    ├── ProductionPage.tsx    # Ishlab chiqarish jarayoni, laboratoriya nazorati
    ├── AboutPage.tsx         # Kompaniya tarixi, qadriyatlar, jamoa
    ├── CertificatesPage.tsx  # ISO 9001, HACCP, Halol sertifikatlari
    ├── RecipesBlogPage.tsx   # Retseptlar va yangiliklar blogi
    ├── ContactBranchesPage.tsx # Filiallar xaritasi, aloqa formasi
    └── FavoritesPage.tsx     # Sevimlilar ro'yxati
```

---

## 01. Savat va To'lov Jarayoni (Cart & Checkout Flow)
1. **Hajm tanlash:** Har bir mahsulotda turli xil hajm variantlari (masalan, 250ml, 500ml, 1L, 1.5L) mavjud bo'lib, har birining narxi alohida hisoblanadi.
2. **Savat drawer:** Miqdorni oshirish/kamaytirish, umumiy narxni hisoblash, yetkazib berish chegarasi (150 000 so'mdan yuqoriga bepul).
3. **To'lov usullari:** Click, Payme, Naqd pul va Bank kartasi orqali to'lov integratsiyasi maketi.

---

## 02. Ko'p Tillilik (i18n: UZ / RU / EN)
- Har qanday yangi matn `src/constants/translations.ts` fayliga kiritilishi shart.
- Barcha sahifa va komponentlar `useLanguage()` hook orqali joriy tilni dinamik o'qiydi.
- Mahsulot nomlari va tavsiflari 3 tilda (`product.name[language]`, `product.shortDescription[language]`) to'liq taqdim etiladi.
