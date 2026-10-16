# 🥛 SABO Dairy Platform — Loyiha Tasklari va Yo'l Xaritasi (Roadmap)

> **Standart:** Ushbu hujjat Jasurbekning `AI Orchestrator` agentlik protokoli (`A0-A10`) va task state machine qoidalariga moslashtirilgan.  
> **Loyiha turi:** Fullstack Monorepo (Next.js 15 + NestJS 10 + React Vite Admin Panel + PostgreSQL + Prisma + Redis).  
> **Oxirgi build tekshiruvi:** 2026-09-01 (`build:all` — PASS ✅ 0 xato).  
> **Hujjatlar audit bilan solishtirildi:** 2026-10-16 — holatlar [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md) ga moslashtirildi.

---

## 🤖 Agent Rollari (Agent Roster)
- **`A0 ORCHESTRATOR`** — Umumiy jarayon boshqaruvi va integratsiya
- **`A1 PLANNER / PM`** — Arxitektura, talablar va yo'l xaritasi
- **`A2 UI-UX`** — Dizayn tizimi, animatsiyalar va foydalanuvchi tajribasi (`ui-ux-pro-max-skill`)
- **`A3 FRONTEND`** — Next.js 15, React, Tailwind CSS, i18n (`mattpocock-development-skills`)
- **`A4 BACKEND`** — NestJS, REST API, Caching, Services
- **`A5 DATABASE`** — PostgreSQL, Prisma ORM, Migratsiyalar va Seeding
- **`A6 SECURITY`** — JWT Auth, RBAC, Data Validation, Audit Logs (`Claude-BugHunter`)
- **`A7 QA-TESTER`** — Unit, E2E testlar, Build va Lint tekshiruvi (`playwright-best-practices-skill`)
- **`A8 SEO-PM`** — SEO, OpenGraph, Schema.org, i18n metama'lumotlar (`Agentic-SEO-Skill`)
- **`A9 DEVOPS`** — Docker, Railway, Vercel, CI/CD GitHub Actions
- **`A10 DOCS`** — Texnik hujjatlar, API spesifikatsiyalari va qo'llanmalar

---

## 📊 Umumiy Holat (Summary Status)

| Bosqich | Tavsif | Holat | Bajarildi / Jami |
|:---|:---|:---:|:---:|
| **PHASE 0** | Arxitektura, Ma'lumotlar Bazasi Sxemasi & Monorepo Sozlamalari | ✅ DONE | 5 / 5 |
| **PHASE 1** | NestJS Backend Asosi (Auth, Users, RBAC, Media, Products, Orders) | ✅ DONE | 8 / 8 |
| **PHASE 2** | Next.js 15 Zamonaviy Frontend Do'kon & Ko'p Tillilik (UZ, RU, EN) | ✅ DONE | 10 / 10 |
| **PHASE 3** | React + Vite Standalone Admin Boshqaruv Paneli | 🟡 IN_PROGRESS | 4 / 7 |
| **PHASE 4** | To'lov Tizimlari (Click, Payme, Naqd) & Buyurtma Jarayoni | 🟡 IN_PROGRESS | 1 / 5 |
| **PHASE 5** | Haqiqiy Ma'lumotlar & Media Aktivlari (Real Assets & Content) | 🔵 PENDING | 0 / 4 |
| **PHASE 6** | Tashqi Integratsiyalar (SMS Gateway, Telegram Bot xabarnomalari) | 🔵 PENDING | 0 / 3 |
| **PHASE 7** | Production Deployment, CI/CD va Monitoring | 🟡 IN_PROGRESS | 4 / 6 |
| **AUDIT** | Audit topilmalarini yopish (AUD-xxx) | 🟡 IN_PROGRESS | 3 / 7 |

---

## 📈 Loyiha tayyorligi (2026-10-16 baholash)

> Taxminiy baho, ish hajmi bo'yicha og'irlik berilgan. Oddiy task soni bo'yicha: 35 / 55 (≈64%). Lekin task'lar hajmi teng emas, shuning uchun quyidagi og'irlikli baho aniqroq.

| Soha | Og'irlik | `main` holati | Branch'lar qo'shilgach* | Qolgan asosiy ish |
|:---|:---:|:---:|:---:|:---|
| Backend asosi (auth, katalog, savat, buyurtma) | 15% | 90% | 92% | Buyurtma holati o'tishlarini ulash, audit log (AUD-010) |
| Public sayt (Next.js) | 15% | 75% | 75% | `/search`, `/orders/track`, `/delivery`, `/faq`, `/privacy`, `/terms`, `/returns`, `/gallery`, `/quality` sahifalari |
| Admin panel | 15% | 25% | 50% | Blog, About, Sertifikat, Production, Mijozlar, Users, Payments, Audit, SEO, Tarjimalar sahifalarini API'ga ulash |
| CMS admin API | 5% | 0% | 100% | — |
| To'lovlar (Click/Payme/naqd) | 15% | 45% | 45% | Qayta yozishni tugatish, sandbox testlari (T-043), production kalitlari (T-044) |
| Haqiqiy kontent (Phase 5) | 10% | 0% | 0% | Mahsulot, narx, rasm, sertifikat skanlari, blog — faqat tasdiqlangan ma'lumot |
| Bildirishnomalar (Telegram/SMS) | 5% | 0% | 0% | T-060…T-062 |
| Xavfsizlik | 5% | 70% | 70% | Admin token → HttpOnly cookie (AUD-004), MFA, secret rotate (AUD-012) |
| Testlar / QA | 5% | 25% | 30% | RBAC, checkout e2e, Playwright |
| Deployment / monitoring | 10% | 60% | 60% | Sentry (T-074), domen + SSL (T-075), production secretlar |
| **Jami tayyor** | **100%** | **≈46%** | **≈55%** | |
| **Qolgan** | | **≈54%** | **≈45%** | |

\* Branch'lar `refs/heads/claude/amazing-borg-bb0d15` (admin sahifalari + `GET /admin/products`, to'liq PATCH; `claude/jolly-lederberg-03e572` ni o'z ichiga oladi) va `refs/heads/claude/dazzling-ritchie-a0b78e` (CMS admin endpointlari). Ular hali `main` ga merge qilinmagan.

**Production'ga chiqishni to'sib turganlar:** to'lov sandbox testlari, haqiqiy kontent va narxlar, secret rotate (AUD-012), domen/SSL.

---

## 📑 Batafsil Tasklar Ro'yxati

### PHASE 0 — Arxitektura & Monorepo Asosi
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-001** | Monorepo tuzilmasi (Root, Frontend, Backend, Admin) sozlash | `A1 PLANNER` | `Understand-Anything` | `package.json`, workspaces | ✅ DONE |
| **T-002** | PostgreSQL + Prisma DB sxemasi (48 model, Enumlar, Relatsiyalar, versiyalangan migratsiyalar) | `A5 DATABASE` | `mattpocock-development-skills` | `backend/prisma/schema.prisma`, `backend/prisma/migrations/` | ✅ DONE |
| **T-003** | Docker Compose muhiti (Postgres 16, Redis 7, MinIO, Mailpit) | `A9 DEVOPS` | `nanoclaw` | `docker-compose.yml` | ✅ DONE |
| **T-004** | TypeScript & ESLint konfiguratsiyalari to'liq moslashtirish | `A3 FRONTEND` | `mattpocock-development-skills` | `tsconfig.json`, `eslint.config` | ✅ DONE |
| **T-005** | API Spesifikatsiyasi va Ma'lumotlar shartnomalari | `A10 DOCS` | `Product-Manager-Skills` | `docs/API.md` (eski: `docs/archive/API-SPEC-legacy.md`) | ✅ DONE |

---

### PHASE 1 — NestJS Backend Asosi & API Modullari
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-010** | JWT Authentication & Refresh Token mexanizmi | `A6 SECURITY` | `Claude-BugHunter` | `backend/src/auth/*` | ✅ DONE |
| **T-011** | Foydalanuvchilar va RBAC rollar boshqaruvi (Super Admin, Manager) | `A6 SECURITY` | `Claude-BugHunter` | `backend/src/users/*` | ✅ DONE |
| **T-012** | Mahsulotlar (Products) & Kategoriyalar CRUD API (Filter, Search, Sort) | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/products/*`, `categories/*` | ✅ DONE |
| **T-013** | Ko'p tilli mahsulot tarjimalari (Uzbek, Russian, English) | `A4 BACKEND` | `Agentic-SEO-Skill` | `backend/src/products/*`, `ProductTranslation` modeli | ✅ DONE |
| **T-014** | Media Fayllar boshqaruvi (Local, S3 / MinIO storage yuklash va keshlash) | `A4 BACKEND` | `payloadcms-skill` | `backend/src/media/*` | ✅ DONE |
| **T-015** | Buyurtmalar (Orders) & Savat (Cart) API tizimi | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/orders/*`, `cart/*` | ✅ DONE |
| **T-016** | CMS Modullari (Biz haqimizda, Ishlab chiqarish, Sertifikatlar, Blog) | `A4 BACKEND` | `payloadcms-skill` | `backend/src/about/*`, `production/*` | ✅ DONE |
| **T-017** | Global Sozlamalar & Ranglar (Theme Settings) API | `A4 BACKEND` | `ui-ux-pro-max-skill` | `backend/src/settings/*` | ✅ DONE |

---

### PHASE 2 — Next.js 15 Frontend Do'kon
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-020** | Next.js 15 App Router va i18n Routing (`/uz`, `/ru`, `/en`) | `A3 FRONTEND` | `mattpocock-development-skills` | `frontend/src/middleware.ts`, `app/[locale]` | ✅ DONE |
| **T-021** | Premium UI/UX Dizayn Tizimi (Sut mavzusi, Oq-Ko'k ranglar, Dark rejim) | `A2 UI-UX` | `ui-ux-pro-max-skill` | `frontend/src/app/globals.css` | ✅ DONE |
| **T-022** | Bosh sahifa (Hero, 3D Canvas, Mahsulotlar karuseli, Sifat kafolati) | `A3 FRONTEND` | `ui-ux-pro-max-skill` | `frontend/src/app/[locale]/page.tsx` | ✅ DONE |
| **T-023** | Mahsulotlar katalogi, Qidiruv, Filter va Toifalar ko'rinishi | `A3 FRONTEND` | `ui-ux-pro-max-skill` | `frontend/src/app/[locale]/products/page.tsx` | ✅ DONE |
| **T-024** | Mahsulot tafsilotlari sahifasi (`/products/[slug]`), Ozuqaviy qiymati | `A3 FRONTEND` | `mattpocock-development-skills` | `frontend/src/app/[locale]/products/[slug]` | ✅ DONE |
| **T-025** | Savatcha (Cart Drawer) va Buyurtma berish (Checkout) sahifasi | `A3 FRONTEND` | `mattpocock-development-skills` | `frontend/src/app/[locale]/checkout` | ✅ DONE |
| **T-026** | Ishlab chiqarish jarayoni (`/production`) va Zavod bosqichlari | `A3 FRONTEND` | `ui-ux-pro-max-skill` | `frontend/src/app/[locale]/production` | ✅ DONE |
| **T-027** | Sertifikatlar (`/certificates`) & Kompaniya haqida (`/about`) sahifalari | `A3 FRONTEND` | `ui-ux-pro-max-skill` | `frontend/src/app/[locale]/about` | ✅ DONE |
| **T-028** | Bog'lanish formasi (`/contact`) va Xabarlarni yuborish | `A3 FRONTEND` | `mattpocock-development-skills` | `frontend/src/app/[locale]/contact` | ✅ DONE |
| **T-029** | To'liq SEO, Schema.org (JSON-LD), OpenGraph va Accessibility (WCAG) | `A8 SEO-PM` | `Agentic-SEO-Skill` | `frontend/src/lib/site.ts`, `frontend/src/lib/seo.ts`, `docs/archive/QA-REPORT-frontend.md` | ✅ DONE |

---

### PHASE 3 — React + Vite Standalone Admin Panel
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-030** | Vite 6 + React 19 + Tailwind v4 Admin infratuzilmasi | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/vite.config.ts` | ✅ DONE |
| **T-031** | Dashboard Analitikasi va Recharts grafiklari (Daromad, Buyurtmalar) | `A2 UI-UX` | `ui-ux-pro-max-skill` | `backend/admin/src/pages/Dashboard.tsx` | ✅ DONE |
| **T-032** | Mahsulotlar boshqaruvi (Qo'shish, Tahrirlash, O'chirish, Yog'lilik) — UI tayyor, API'ga ulanmagan (AUD-001) | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Products/ProductsList.tsx`, `CategoriesPage.tsx` | 🟡 IN_PROGRESS |
| **T-033** | Buyurtmalar boshqaruvi (Status yangilash, To'lov ko'rish) | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Orders/OrdersPage.tsx` | ✅ DONE |
| **T-034** | Xabarlar va Qayta aloqa murojaatlari monitoringi | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Messages/MessagesAdminPage.tsx` | ✅ DONE |
| **T-035** | Media Kutubxonasi (Fayl yuklash, Papkalar, Albomlar) — UI tayyor, `/media/upload` ga ulanmagan (AUD-001) | `A3 FRONTEND` | `payloadcms-skill` | `backend/admin/src/pages/Media/MediaAdminPage.tsx` | 🟡 IN_PROGRESS |
| **T-036** | Dizayn, Ranglar va Sayt sozlamalari interfeysi — UI tayyor, `/settings/theme` ga ulanmagan (AUD-001) | `A2 UI-UX` | `ui-ux-pro-max-skill` | `backend/admin/src/pages/Settings/SettingsAdminPage.tsx` | 🟡 IN_PROGRESS |

---

### PHASE 4 — To'lov Tizimlari (Payment Gateways)
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-040** | Click Merchant API integratsiyasi (Prepare, Complete webhooklari) — qayta yozilmoqda (AUD-003) | `A4 BACKEND` | `Claude-BugHunter` | `backend/src/payments/providers/click-payment.provider.ts` | 🟡 IN_PROGRESS |
| **T-041** | Payme Merchant API integratsiyasi (JSON-RPC: CheckPerform, Create, Perform, Cancel, Check, GetStatement) — qayta yozilmoqda (AUD-003) | `A4 BACKEND` | `Claude-BugHunter` | `backend/src/payments/providers/payme-payment.provider.ts` | 🟡 IN_PROGRESS |
| **T-042** | Naqd to'lov (Cash on Delivery) mexanizmi | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/orders/orders.service.ts`, `payments/payments.service.ts` (`CASH` provider) | ✅ DONE |
| **T-043** | Click / Payme test xaridlarini amalga oshirish va tekshirish | `A7 QA-TESTER` | `playwright-best-practices-skill` | E2E to'lov sinovlari | 🟡 IN_PROGRESS |
| **T-044** | Haqiqiy ishlab chiqarish (Production) Click/Payme kalitlarini ulash | `A6 SECURITY` | `gemini-security-skills` | `.env.production` | 🔵 PENDING |

---

### PHASE 5 — Haqiqiy Kontent & Brend Aktivlari (Real Content)
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-050** | Real SABO mahsulotlari ro'yxati, narxlari va tavsiflarini kiritish | `A1 PLANNER` | `Product-Manager-Skills` | `backend/prisma/seed.ts` | 🔵 PENDING |
| **T-051** | Mahsulotlarning yuqori sifatli fotosuratlari va 3D modellarini yuklash | `A2 UI-UX` | `ui-ux-pro-max-skill` | `backend/uploads/products/*` | 🔵 PENDING |
| **T-052** | Blog maqolalari (Foydali maslahatlar, Sutning foydasi) kontentini yozish | `A10 DOCS` | `Agentic-SEO-Skill` | `backend/prisma/seed.ts` (Blog) | 🔵 PENDING |
| **T-053** | Haqiqiy sertifikatlar (Halol, ISO 22000, Gigiyena) skanlarini yuklash | `A10 DOCS` | `Product-Manager-Skills` | `backend/uploads/certificates/*` | 🔵 PENDING |

---

### PHASE 6 — Tashqi Xizmatlar & Xabarnomalar (External Services)
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-060** | Telegram Bot orqali yangi buyurtmalarni adminlarga yuborish | `A4 BACKEND` | `n8n-as-code` | `backend/src/notifications/telegram.service.ts` | 🔵 PENDING |
| **T-061** | SMS Gateway (Eskiz.uz / PlayMobile) orqali OTP kod yuborish | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/notifications/sms.service.ts` | 🔵 PENDING |
| **T-062** | Buyurtma holati o'zgarganda mijozga SMS / Telegram xabarnoma | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/orders/events.ts` | 🔵 PENDING |

---

### PHASE 7 — Deployment, CI/CD & Monitoring
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-070** | Docker va Dockerfile (Frontend, Backend, Admin) sozlash | `A9 DEVOPS` | `nanoclaw` | `backend/Dockerfile`, `frontend/Dockerfile` | ✅ DONE |
| **T-071** | Vercel Deployment konfiguratsiyasi (`vercel.json`) | `A9 DEVOPS` | `nanoclaw` | `frontend/vercel.json` | ✅ DONE |
| **T-072** | Railway Cloud 1-Click Deploy konfiguratsiyasi | `A9 DEVOPS` | `nanoclaw` | `railway.json`, `docs/deployment/RAILWAY.md` | ✅ DONE |
| **T-073** | GitHub Actions CI/CD (Lint, Typecheck, Test, Build) | `A9 DEVOPS` | `nanoclaw` | `.github/workflows/backend-ci.yml`, `frontend-ci.yml` | ✅ DONE |
| **T-074** | Sentry / Log monitoring xatoliklarni qayd etish tizimi | `A6 SECURITY` | `Claude-BugHunter` | Error Tracking modul | 🔵 PENDING |
| **T-075** | Domen ulash va SSL sertifikatini sozlash (`sabo.uz`) | `A9 DEVOPS` | `Agentic-SEO-Skill` | DNS & Caddy / Cloudflare | 🔵 PENDING |

---

### AUDIT — Audit topilmalarini yopish ([docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md))
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-080** | Admin CRUD sahifalarini mavjud API'ga ulash (mahsulot, kategoriya, media, theme) — AUD-001 | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/*` | 🔵 PENDING |
| **T-081** | CMS uchun admin endpointlari (blog, about, sertifikat, production, users, payments, audit) — AUD-002 | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/*/` | 🔵 PENDING |
| **T-082** | `render.yaml`ni `prisma migrate deploy` ga o'tkazish (baseline bilan) — AUD-011 | `A9 DEVOPS` | `nanoclaw` | `render.yaml`, `docs/deployment/FREE.md` | ✅ DONE |
| **T-083** | Admin token'ni HttpOnly cookie + refresh oqimiga o'tkazish — AUD-004 | `A6 SECURITY` | `Claude-BugHunter` | `backend/admin/src/api/client.ts`, `backend/src/auth/*` | 🔵 PENDING |
| **T-084** | Global rate limiting (checkout, register, refresh, webhook) — AUD-005 | `A6 SECURITY` | `Claude-BugHunter` | `backend/src/common/throttle/*`, `app.module.ts`, `main.ts` | ✅ DONE |
| **T-085** | Upload magic-bytes tekshiruvi — AUD-006 | `A6 SECURITY` | `gemini-security-skills` | `backend/src/media/file-signature.ts`, `media.service.ts` | ✅ DONE |
| **T-086** | Buyurtma holati o'tish qoidalari + audit log — AUD-010 | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/admin/admin.service.ts` | 🔵 PENDING |

---

## 🛠 Ishlatish va Ishga Tushirish Buyruqlari

```bash
# 1. Barcha paketlarni o'rnatish
npm run install:all

# 2. Butun loyihani sinovdan o'tkazish va yig'ish (Build verification)
npm run build:all

# 3. Dasturlarni alohida ishga tushirish:
npm run dev:frontend   # Next.js Do'kon: http://localhost:3000
npm run dev:backend    # NestJS API:     http://localhost:4000
npm run dev:admin      # Vite Admin:     http://localhost:5173
```
