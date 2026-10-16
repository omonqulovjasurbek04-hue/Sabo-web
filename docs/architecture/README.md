# SABO Dairy Platform — To‘liq loyiha blueprinti

> Maqsad: SABO tabiiy sut va sut mahsulotlari brendi uchun uch tilli e-commerce, korporativ sayt, CMS va admin boshqaruv tizimini xavfsiz, testlangan va production'ga tayyor holatga keltirish.

## 1. Ushbu hujjat nima uchun?
Bu hujjat mavjud loyihani qayta yozmasdan, tekshirishdan boshlab ishga tushirishgacha olib borish uchun asosiy yo‘l xaritasi, texnik arxitektura, sahifalar ro‘yxati, dizayn tizimi, ma’lumotlar modeli, xavfsizlik talablari, test rejasi va AI coding promptlarini beradi.

**Muhim:** repo'dagi haqiqiy fayllar, dependency versiyalari, `TASKS.md`, Prisma schema va amaldagi API tekshirilmaguncha, bu blueprint loyihaning barcha qismlari tayyorligini anglatmaydi. Avval audit qilinadi; ishlayotgan kodni sababsiz almashtirish taqiqlanadi.

## 2. Tavsiya etilgan texnologiyalar
- Public storefront: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Three.js (3D layer).
- API: NestJS 10, TypeScript, Prisma 5, PostgreSQL, Redis.
- Admin: React 19, Vite 6, TypeScript, Tailwind CSS v4, Recharts, Lucide Icons.
- Test: Jest/Vitest, Supertest, Playwright; lint/typecheck/build.
- DevOps: Docker Compose, CI, production hosting, Sentry yoki muqobil monitoring.
- Integratsiyalar: Click, Payme, naqd to‘lov; Telegram bot; SMS provayderi (Eskiz/PlayMobile — shartnoma va API hujjatlari tekshirilgach).

Dependency'larni yangilashdan oldin `package.json`, lockfile va rasmiy moslik hujjatlari tekshirilsin. Bir ishda framework major versiyasini o‘zgartirmang.

## 3. Bajarish tartibi
1. [Audit va inventarizatsiya](01-audit.md)
2. [Arxitektura va papkalar](02-architecture.md)
3. [Sahifalar va funksiyalar](03-pages-and-features.md)
4. [Dizayn tizimi va Light/Dark](04-design-system.md)
5. [Database va API](05-data-and-api.md)
6. [Admin panel](06-admin-panel.md)
7. [Xavfsizlik va maxfiylik](07-security.md)
8. [Test va sifat nazorati](08-testing.md)
9. [Deployment va monitoring](09-deployment.md)
10. [Bosqichma-bosqich yo‘l xaritasi](10-roadmap.md)
11. [AI coding promptlar](../prompts/README.md)
12. [Frontend yo‘riqnomasi](frontend-guidelines.md)

Amaldagi holat (blueprint emas): [API](../API.md), [Xavfsizlik](../SECURITY.md), [Audit](../AUDIT_REPORT.md), [Deployment](../DEPLOYMENT.md).

## 4. Loyiha tamoyillari
- Bitta haqiqat manbai: mahsulot, narx, ombor va buyurtma ma’lumoti API/database'da bo‘ladi.
- Admin frontend API xavfsizligini almashtirmaydi: har bir ruxsat backend'da tekshiriladi.
- Pul qiymatlari floating-point bilan hisoblanmaydi; valyuta va minor units/Decimal qoidasi aniq belgilanadi.
- Buyurtma summasi serverda qayta hisoblanadi. Brauzer yuborgan narxga ishonilmaydi.
- To‘lov callback/webhook'lari imzo, summa, buyurtma va takroriy so‘rov bo‘yicha tekshiriladi.
- Har bir foydalanuvchiga faqat zarur ruxsat beriladi.
- Tarjima matnlari kod ichiga sochib tashlanmaydi; `uz`, `ru`, `en` uchun izchil strategiya bo‘ladi.
- Maxfiy kalitlar Git'ga kiritilmaydi; `.env.example` faqat nomlar va xavfsiz placeholder'lardan iborat.
- Real sertifikat, tarkib, ozuqaviy qiymat, saqlash muddati va sifat da’volari tasdiqlanmagan bo‘lsa, uydirib yozilmaydi.
- Accessibility, mobil dizayn, tezlik, SEO va xatolik holatlari “keyin qilinadi” deb qoldirilmaydi.

## 5. Definition of Done
Har bir vazifa quyidagilardan o‘tadi:
- Acceptance criteria bajarilgan.
- Lint, typecheck, tegishli testlar va build muvaffaqiyatli.
- Loading, empty, error va success holatlari mavjud.
- Mobil va desktop ko‘rinishi tekshirilgan.
- Ruxsat va input validation tekshirilgan.
- Hujjatlar/`.env.example` yangilangan.
- Loglarda token, parol, karta ma’lumoti yoki maxfiy shaxsiy ma’lumot yo‘q.
- PR/commit kichik, izohli va qaytarish mumkin.
