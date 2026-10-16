# SABO — Audit hisoboti

> Format: [`architecture/01-audit.md`](architecture/01-audit.md). Oxirgi yangilanish: 2026-10-16.
> Topilmalar repository'dagi haqiqiy fayllar asosida yozilgan. Holat: Open / In progress / Fixed / Verified.

## Xulosa

| Severity | Open | In progress | Fixed |
|---|:---:|:---:|:---:|
| High | 2 | 2 | 1 |
| Medium | 2 | 1 | 3 |
| Low | 1 | 0 | 1 |

---

## AUD-001 — Admin panelning ko'p bo'limlari API'ga ulanmagan
- **Severity:** High
- **Joy:** `backend/admin/src/pages/Products/ProductsList.tsx`, `Products/CategoriesPage.tsx`, `Blog/`, `About/`, `Certificates/`, `Customers/`, `Media/`, `Production/`, `SEO/`, `Settings/`, `Translations/`, `Users/`, `Payments/`, `AuditLogs/`, `Notifications/`
- **Muammo:** bu sahifalar ma'lumotni komponent ichidagi `initial…` massivlardan oladi va o'zgarishlarni faqat React state'da saqlaydi. Sahifa yangilanganda o'zgarish yo'qoladi, public saytga chiqmaydi. API'ga faqat `Dashboard`, `Orders`, `Messages` va `Login` ulangan.
- **Ta'sir:** admin "saqlandi" deb ko'rsatadi, lekin hech narsa saqlanmaydi. `TASKS.md` T-032, T-035, T-036 noto'g'ri "DONE" deb belgilangan edi.
- **Yechim:** backend'da mavjud `admin/products`, `admin/categories`, `media/upload` endpointlariga ulash; qolgan CMS bo'limlari uchun avval backend endpointlari yozilsin ([API.md](API.md) → "Yo'q endpointlar").
- **Holat:** Open

## AUD-002 — CMS bo'limlari uchun admin yozish endpointlari yo'q
- **Severity:** High
- **Joy:** `backend/src/{blog,about,certificates,production,home,contact}/*.controller.ts`
- **Muammo:** bu modullarda faqat public `GET` bor. Blog, sertifikat, biz haqimizda, ishlab chiqarish, foydalanuvchi/rol, to'lovlar ro'yxati va audit log uchun admin API mavjud emas.
- **Yechim:** har bir modul uchun `admin/...` CRUD (RBAC + DTO validation + audit log) qo'shish.
- **Holat:** Open

## AUD-003 — Click/Payme callback'lari qayta yozilmoqda
- **Severity:** High
- **Joy:** `backend/src/payments/providers/click-payment.provider.ts`, `payme-payment.provider.ts`, `payment-settlement.ts`, `common/decorators/raw-response.decorator.ts`
- **Muammo:** avvalgi Click handler `merchant_prepare_id` ni imzoga qo'shmas, Prepare/Complete'ni ajratmas va `verifyPayment` doim `true` qaytarardi. Javob global `ResponseInterceptor` bilan o'ralib, provider kutgan formatda bo'lmasdi.
- **Yechim (jarayonda, commit qilinmagan):** Prepare/Complete alohida, timing-safe imzo tekshiruvi, summa tekshiruvi, idempotent settlement, `@RawResponse()` bilan provider formatidagi javob.
- **Tekshiruv:** `payment-webhook-security.spec.ts`, `payments.service.spec.ts`; sandbox acceptance test hali o'tkazilmagan (T-043).
- **Holat:** In progress

## AUD-011 — Render start buyrug'i `db push --accept-data-loss` ishlatadi
- **Severity:** High
- **Joy:** `render.yaml:11`
- **Muammo:** har deploy'da `prisma db push --accept-data-loss` ishlaydi. Sxema o'zgarsa (ustun o'chirilsa/turi o'zgarsa) production ma'lumotlari ogohlantirishsiz o'chadi. Repo esa versiyalangan migratsiyalarga o'tgan (`backend/prisma/migrations/`, `docker-entrypoint.sh` → `migrate deploy`).
- **Yechim:** `startCommand` ni `npx prisma migrate deploy` ga almashtirish. **Diqqat:** mavjud Render/Neon bazasi `db push` bilan yaratilgan bo'lsa, avval bir marta baseline qilinadi: `npx prisma migrate resolve --applied 20260901210000_initial_schema` (backup'dan keyin). Yangi bazada baseline kerak emas.
- **Bajarildi (2026-10-16):** `render.yaml` va `docs/deployment/FREE.md` → `prisma migrate deploy`; baseline yo'riqnomasi FREE.md'da. Mavjud Render bazasida baseline bajarilganini egasi tasdiqlashi kerak.
- **Holat:** Fixed

## AUD-012 — Deploy yo'riqnomasida tayyor secretlar ochiq yozilgan edi
- **Severity:** High
- **Joy:** `docs/deployment/FREE.md` (ilgari `FREE-DEPLOY.md`), git tarixi
- **Muammo:** `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` va `ADMIN_BOOTSTRAP_PASSWORD` uchun aniq qiymatlar hujjatda turgan va commit qilingan. Ular shu ko'rinishda ishlatilgan bo'lsa, repo'ni o'qigan har kim admin token yasashi mumkin.
- **Bajarildi:** hujjatdan olib tashlandi, o'rniga secret yaratish buyrug'i yozildi.
- **Egasi bajarishi kerak:** Render'dagi ikkala JWT secret'ni va admin parolini yangilash (rotate). Git tarixini tozalash ixtiyoriy — rotate qilish asosiy chora.
- **Holat:** In progress (rotate kutilmoqda)

## AUD-004 — Admin token `localStorage`da saqlanadi
- **Severity:** Medium
- **Joy:** `backend/admin/src/api/client.ts:14`, `context/AuthContext.tsx`
- **Muammo:** access token `localStorage`da; XSS bo'lsa token o'g'irlanishi mumkin. 401'da refresh qilinmaydi, foydalanuvchi chiqarib yuboriladi.
- **Yechim:** HttpOnly + Secure + SameSite cookie'dagi refresh token, xotirada qisqa umrli access token ([SECURITY.md](SECURITY.md)).
- **Holat:** Open

## AUD-005 — Global rate limiting yo'q
- **Severity:** Medium
- **Joy:** `backend/src/app.module.ts`
- **Muammo:** login (`auth.service.ts`, Redis hisoblagich) va contact formada alohida cheklov bor, lekin checkout, register, refresh va webhook endpointlarida umumiy rate limit yo'q.
- **Bajarildi (2026-10-16):** `@nestjs/throttler` global guard (`common/throttle/throttle.config.ts`, `app.module.ts`) — 120 so'rov/daqiqa/IP; `POST /auth/register` 10/15 daq, `POST /auth/refresh` 30/15 daq, `POST /orders` 10/daq. Click/Payme webhook va `/health` limitdan ozod. Bucket'lar xotirada — API bir nechta instance'ga kengaytirilsa Redis storage kerak.
- **Tekshiruv:** `throttle.config.spec.ts`.
- **Holat:** Fixed

## AUD-006 — Media upload faqat MIME bo'yicha tekshiriladi
- **Severity:** Medium
- **Joy:** `backend/src/media/media.service.ts:80-91`, `media.controller.ts:51`
- **Muammo:** `file.mimetype` client yuborgan qiymat; magic bytes tekshirilmasdi. Kengaytma client fayl nomidan olinardi, `application/octet-stream` ruxsat etilgan edi — `x.html`/`.svg` yuklab, public `/media/file/...` orqali tarqatish mumkin edi (stored XSS).
- **Bajarildi (2026-10-16):** tur fayl mazmunidan aniqlanadi (`media/file-signature.ts`: JPEG, PNG, WebP, AVIF, PDF, GLB, glTF JSON); e'lon qilingan MIME mos kelishi shart; saqlanadigan kengaytma va `Content-Type` aniqlangan turdan olinadi; o'lcham limiti tur bo'yicha (rasm 10 MB, PDF 25 MB, 3D 50 MB).
- **Tekshiruv:** `file-signature.spec.ts`.
- **Holat:** Fixed

## AUD-013 — Proxy ortida mijoz IP'si aniqlanmasdi
- **Severity:** Medium
- **Joy:** `backend/src/main.ts`
- **Muammo:** Express `trust proxy` o'rnatilmagan edi. Render/Railway/Caddy ortida `@Ip()` proxy manzilini qaytaradi — login bloki va contact limiti (soatiga 5) barcha foydalanuvchilar uchun bitta umumiy bucket bo'lib qolardi.
- **Bajarildi (2026-10-16):** `TRUST_PROXY` env (production'da standart 1 hop), `.env.example` va `.env.production.example` da hujjatlashtirildi.
- **Holat:** Fixed

## AUD-007 — Test qamrovi past
- **Severity:** Medium
- **Joy:** `backend/src/**/*.spec.ts` (3 fayl), `backend/test/` (faqat `jest-e2e.json`), frontend/admin'da test yo'q
- **Muammo:** buyurtma narxi va to'lov callback'lari uchun unit testlar bor; RBAC, checkout e2e, Playwright yo'q.
- **Yechim:** [architecture/08-testing.md](architecture/08-testing.md) dagi muhim holatlar.
- **Holat:** Open

## AUD-010 — Buyurtma holati o'tishlari tekshirilmaydi
- **Severity:** Medium
- **Joy:** `backend/src/admin/admin.service.ts:123` (`updateOrderStatus`)
- **Muammo:** admin istalgan holatni istalgan holatga o'rnatishi mumkin (masalan `DELIVERED` → `PENDING`); o'zgarish audit log'ga yozilmaydi va holat tarixi saqlanmaydi.
- **Yechim:** ruxsat etilgan o'tishlar jadvali ([architecture/05-data-and-api.md](architecture/05-data-and-api.md)), `AuditLog` yozuvi, unit test.
- **Jarayonda (commit qilinmagan):** `backend/src/orders/order-status.ts` — `ORDER_STATUS_TRANSITIONS` / `canTransitionOrder()`; `admin.service.ts` ga hali ulanmagan, audit log yo'q.
- **Holat:** In progress

## AUD-008 — Hujjatlar va kod mos emas edi
- **Severity:** Low
- **Muammo:** `AGENTS.md` mavjud bo'lmagan `docs/AUDIT_REPORT.md`, `API.md`, `SECURITY.md`, `DEPLOYMENT.md` va `prompts/` ga ishora qilardi; README eski `RAILWAY-DEPLOY.md` va root `vercel.json` ga havola berardi; `TASKS.md` mavjud bo'lmagan fayllarni (`cash.service.ts`, `click.service.ts`, `Design.tsx`) ko'rsatardi; Admin "React 18" deb yozilgan (aslida 19.1).
- **Holat:** Fixed (2026-10-16)

## AUD-009 — Admin dev serverida demo fallback ma'lumotlar
- **Severity:** Low
- **Joy:** `backend/admin/src/pages/Orders/OrdersPage.tsx:6`, `Dashboard.tsx`
- **Muammo:** API xato bersa, sahifa ichki demo ma'lumotni ko'rsatishi mumkin — admin haqiqiy buyurtmalar yo'q ekanini sezmasligi mumkin.
- **Yechim:** demo ma'lumot o'rniga aniq error/empty state.
- **Holat:** Open

---

## Ijobiy topilmalar (tekshirildi)
- Parollar `argon2` bilan hash qilinadi (`auth.service.ts`, `users.service.ts`).
- Production'da standart `dev_secret_*` JWT kalitlari rad etiladi (`config/validation.ts`).
- Global `ValidationPipe` — `whitelist` + `forbidNonWhitelisted` (`main.ts`).
- `helmet`, CORS allowlist, request ID middleware mavjud.
- Swagger production'da faqat `ENABLE_SWAGGER=true` bo'lsa yoqiladi.
- Buyurtma narxi serverda hisoblanadi (`orders/services/order-pricing.service.ts`, spec bilan).
- DB sxemasi migratsiyalar bilan versiyalangan (`backend/prisma/migrations/20260901210000_initial_schema`).
