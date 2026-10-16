# SABO — Amaldagi API

> Manba: `backend/src/**/*.controller.ts` (2026-10-16). Endpoint qo'shilsa/o'zgarsa, shu fayl yangilanadi.
> Interaktiv hujjat: `http://localhost:4000/docs` (Swagger; production'da faqat `ENABLE_SWAGGER=true` bilan).
> Kelajakdagi dizayn: [architecture/05-data-and-api.md](architecture/05-data-and-api.md). Eski spec: [archive/API-SPEC-legacy.md](archive/API-SPEC-legacy.md) (amalda emas).

## Umumiy
- **Base URL:** `http://localhost:4000/api/v1` (prefix `API_PREFIX` env bilan o'zgaradi).
- **Javob formati:** `ResponseInterceptor` → `{ success, data, ... }`. `@RawResponse()` bilan belgilangan handler'lar (to'lov provider callback'lari) bundan mustasno.
- **Validation:** global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) — noma'lum maydon 400 qaytaradi.
- **Auth:** `Authorization: Bearer <accessToken>`. Access 15 daqiqa, refresh 7 kun (env bilan sozlanadi).
- **Ruxsat etilgan headerlar:** `Content-Type`, `Authorization`, `X-Request-ID`, `X-Session-ID` (guest savat), `Idempotency-Key` (buyurtma).
- **Rate limit:** 120 so'rov/daqiqa/IP (429 qaytaradi); qattiqroq: `POST /auth/register` 10/15 daq, `POST /auth/refresh` 30/15 daq, `POST /orders` 10/daq. Webhook va `/health` ozod.
- **Rollar (`RoleType`):** `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `MODERATOR`, `CUSTOMER`.

Belgilar: 🌐 public · 🔑 login kerak · 🛡 rol kerak.

## Public kontent
| Method | Path | Auth | Izoh |
|---|---|:---:|---|
| GET | `/health` | 🌐 | liveness/readiness |
| GET | `/home` | 🌐 | bosh sahifa CMS (keshlangan) |
| GET | `/about` | 🌐 | |
| GET | `/production` | 🌐 | |
| GET | `/certificates` | 🌐 | |
| GET | `/certificates/:id` | 🌐 | |
| GET | `/blog` | 🌐 | ro'yxat |
| GET | `/blog/categories` | 🌐 | |
| GET | `/blog/:slug` | 🌐 | |
| POST | `/contact` | 🌐 | Redis rate limit (IP bo'yicha, 1 soat) |
| GET | `/contact/info` | 🌐 | |
| GET | `/settings/theme` | 🌐 | |

## Katalog
| Method | Path | Auth | Izoh |
|---|---|:---:|---|
| GET | `/products` | 🌐 | filter/search/sort/pagination |
| GET | `/products/featured` | 🌐 | |
| GET | `/products/:slug` | 🌐 | |
| GET | `/categories` | 🌐 | |
| GET | `/categories/:slug` | 🌐 | |

## Auth va profil
| Method | Path | Auth | Izoh |
|---|---|:---:|---|
| POST | `/auth/register` | 🌐 | |
| POST | `/auth/login` | 🌐 | Redis bilan noto'g'ri urinishlar cheklanadi |
| POST | `/auth/refresh` | 🌐 | refresh token rotation |
| GET | `/auth/me` | 🔑 | |
| POST | `/auth/logout` | 🔑 | |
| GET / PATCH | `/users/me` | 🔑 | |
| PATCH | `/users/me/password` | 🔑 | |
| GET | `/users/me/sessions` | 🔑 | |
| DELETE | `/users/me/sessions/:id` | 🔑 | |

## Savat, buyurtma, to'lov
| Method | Path | Auth | Izoh |
|---|---|:---:|---|
| GET | `/cart` | 🌐 | guest: `X-Session-ID`; login bo'lsa user savati |
| POST | `/cart/items` | 🌐 | |
| PATCH | `/cart/items/:id` | 🌐 | |
| DELETE | `/cart/items/:id` | 🌐 | |
| DELETE | `/cart` | 🌐 | savatni tozalash |
| POST | `/orders` | 🌐 | guest yoki user; narx serverda hisoblanadi; `Idempotency-Key` faqat login qilganlar uchun |
| GET | `/orders` | 🔑 | o'z buyurtmalari |
| GET | `/orders/:id` | 🔑 | |
| POST | `/orders/:id/cancel` | 🔑 | faqat `PENDING` holatda |
| POST | `/payments/checkout-url` | 🔑 | `{ orderId, provider, returnUrl }` → Click/Payme URL |
| POST | `/payments/:provider/webhook` | 🌐 | `click` yoki `payme`; imzo/Basic auth bilan tekshiriladi |

## Media
| Method | Path | Auth | Izoh |
|---|---|:---:|---|
| POST | `/media/upload` | 🛡 SUPER_ADMIN, ADMIN, EDITOR, MANAGER | multipart, 1 fayl; JPEG/PNG/WebP/AVIF ≤10 MB, PDF ≤25 MB, GLB/glTF ≤50 MB (mazmun bo'yicha tekshiriladi) |
| GET | `/media` | 🌐 | |
| GET | `/media/:id` | 🌐 | |
| GET | `/media/download/:id` | 🌐 | |
| GET | `/media/file/:folder/:fileName` | 🌐 | |
| DELETE | `/media/:id` | 🛡 SUPER_ADMIN, ADMIN | |

## Admin
| Method | Path | Rollar |
|---|---|---|
| GET | `/admin/dashboard` | SUPER_ADMIN, ADMIN, MANAGER |
| GET | `/admin/orders` | SUPER_ADMIN, ADMIN, MANAGER |
| PATCH | `/admin/orders/:id/status` | SUPER_ADMIN, ADMIN, MANAGER |
| GET | `/admin/messages` | SUPER_ADMIN, ADMIN, MANAGER |
| PATCH | `/admin/messages/:id/status` | SUPER_ADMIN, ADMIN, MANAGER |
| GET | `/admin/system` | SUPER_ADMIN, ADMIN, MANAGER |
| POST | `/admin/products` | SUPER_ADMIN, ADMIN |
| PATCH | `/admin/products/:id` | SUPER_ADMIN, ADMIN, EDITOR |
| POST | `/admin/products/:id/publish` | SUPER_ADMIN, ADMIN |
| POST | `/admin/products/:id/archive` | SUPER_ADMIN, ADMIN |
| DELETE | `/admin/products/:id` | SUPER_ADMIN, ADMIN |
| POST | `/admin/categories` | SUPER_ADMIN, ADMIN |
| PATCH / DELETE | `/admin/categories/:id` | SUPER_ADMIN, ADMIN |
| PUT / DELETE | `/settings/theme` | SUPER_ADMIN, ADMIN |

## Yo'q endpointlar (admin panel UI bor, API yo'q)
Quyidagilar uchun admin sahifasi mavjud, lekin backend yozish endpointi yo'q ([AUDIT_REPORT.md](AUDIT_REPORT.md) AUD-001/002):
blog, biz haqimizda, sertifikatlar, ishlab chiqarish, bosh sahifa CMS, mijozlar ro'yxati, foydalanuvchi/rollar, to'lovlar ro'yxati, audit log, tarjimalar, SEO, bildirishnomalar.
