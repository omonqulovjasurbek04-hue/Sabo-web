# 02 — Arxitektura va repository strukturasi

## Tavsiya etilgan monorepo ko‘rinishi
Mavjud tuzilma farq qilsa, ko‘chirib tashlashdan oldin sabab va migration rejasi yozilsin.

> **Amaldagi holat (2026-10-16):** backend modullari `backend/src/modules/` ostida emas, to‘g‘ridan-to‘g‘ri `backend/src/<modul>/` da (`auth`, `users`, `products`, `categories`, `cart`, `orders`, `payments`, `media`, `blog`, `about`, `production`, `certificates`, `contact`, `home`, `settings`, `admin`, `health`). Frontend'da `src/features/`, `src/styles/`, `src/tests/` yo‘q; i18n `src/locales/{uz,ru,en}.ts`, API client `src/lib/api-client.ts`. `packages/` yo‘q. Quyidagi daraxt — maqsadli ko‘rinish; ishlab turgan modullarni faqat shu daraxtga moslash uchun ko‘chirmang.

```text
sabo-dairy/
├── frontend/                     # Next.js storefront + corporate site
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── models/
│   ├── src/
│   │   ├── app/[locale]/         # uz, ru, en route segmentlari
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   ├── product/
│   │   │   ├── cart/
│   │   │   └── marketing/
│   │   ├── features/
│   │   ├── lib/
│   │   │   ├── api/
│   │   │   ├── i18n/
│   │   │   ├── seo/
│   │   │   └── analytics/
│   │   ├── styles/
│   │   └── tests/
│   └── ...
├── backend/
│   ├── admin/                    # Vite React admin app
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── common/               # filters, pipes, guards, decorators
│   │   ├── config/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── catalog/
│   │   │   ├── inventory/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── delivery/
│   │   │   ├── content/
│   │   │   ├── media/
│   │   │   ├── translations/
│   │   │   ├── settings/
│   │   │   ├── notifications/
│   │   │   ├── analytics/
│   │   │   └── audit/
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── ...
├── packages/                     # faqat real ehtiyoj bo‘lsa shared package
├── docs/
│   ├── AUDIT_REPORT.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   ├── architecture/
│   ├── deployment/
│   ├── prompts/
│   ├── archive/
│   └── screenshots/
├── .github/workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Mas’uliyat chegaralari
- Frontend: UI, route, form validation UX, API so‘rovi; biznes qoidalarining yagona manbai emas.
- API: auth, authorization, server validation, biznes qoidalari, tranzaksiyalar, audit.
- Database: doimiy ma’lumot va yaxlitlik constraint'lari.
- Redis: cache, rate-limit yoki queue uchun; asosiy buyurtma ma’lumoti faqat Redis'da saqlanmaydi.
- Admin: API iste’molchisi. Admin'dagi yashirin tugma ruxsat tekshiruvi hisoblanmaydi.
- Worker/queue: SMS, Telegram, media processing kabi kechikishi mumkin bo‘lgan vazifalar, agar loyiha hajmi talab qilsa.

## API standartlari
- Prefix: `/api/v1`.
- Swagger/OpenAPI: development/staging'da yoqiladi; production'da kirish nazorat qilinadi yoki cheklanadi.
- Pagination: `page`, `limit` yoki cursor; `limit` serverda cheklanadi.
- Filter/sort allowlist orqali.
- Xatolar bir xil formatda, request/correlation ID bilan.
- Sana: API'da ISO 8601; biznes vaqt zonasi aniq belgilansin.
- Narx: valyuta va aniqlik siyosati barcha qatlamlarda bir xil.

## Konfiguratsiya
`NODE_ENV`, `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGINS`, `APP_URL`, `API_URL`, payment sandbox sozlamalari va media storage konfiguratsiyasi `.env.example` da hujjatlashtiriladi. Haqiqiy qiymatlar faqat secret manager yoki server environment'da bo‘ladi.
