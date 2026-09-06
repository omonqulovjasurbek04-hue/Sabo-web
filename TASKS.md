# 🥛 SABO Dairy Platform — Loyiha Tasklari va Yo'l Xaritasi (Roadmap)

> **Standart:** Ushbu hujjat Jasurbekning `AI Orchestrator` agentlik protokoli (`A0-A10`) va task state machine qoidalariga moslashtirilgan.  
> **Loyiha turi:** Fullstack Monorepo (Next.js 15 + NestJS 10 + React Vite Admin Panel + PostgreSQL + Prisma + Redis).  
> **Oxirgi tekshiruv va sinov:** 2026-09-01 (Barcha frontend, backend va admin yig'ilishi `build:all` — PASS ✅ 0 xato).

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
| **PHASE 3** | React + Vite Standalone Admin Boshqaruv Paneli | ✅ DONE | 7 / 7 |
| **PHASE 4** | To'lov Tizimlari (Click, Payme, Naqd) & Buyurtma Jarayoni | 🟡 IN_PROGRESS | 3 / 5 |
| **PHASE 5** | Haqiqiy Ma'lumotlar & Media Aktivlari (Real Assets & Content) | 🔵 PENDING | 0 / 4 |
| **PHASE 6** | Tashqi Integratsiyalar (SMS Gateway, Telegram Bot xabarnomalari) | 🔵 PENDING | 0 / 3 |
| **PHASE 7** | Production Deployment, CI/CD va Monitoring | 🟡 IN_PROGRESS | 4 / 6 |

---

## 📑 Batafsil Tasklar Ro'yxati

### PHASE 0 — Arxitektura & Monorepo Asosi
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-001** | Monorepo tuzilmasi (Root, Frontend, Backend, Admin) sozlash | `A1 PLANNER` | `Understand-Anything` | `package.json`, workspaces | ✅ DONE |
| **T-002** | PostgreSQL + Prisma DB sxemasi (20+ model, Enumlar, Relatsiyalar) | `A5 DATABASE` | `mattpocock-development-skills` | `backend/prisma/schema.prisma` | ✅ DONE |
| **T-003** | Docker Compose muhiti (Postgres 16, Redis 7, MinIO, Mailpit) | `A9 DEVOPS` | `nanoclaw` | `docker-compose.yml` | ✅ DONE |
| **T-004** | TypeScript & ESLint konfiguratsiyalari to'liq moslashtirish | `A3 FRONTEND` | `mattpocock-development-skills` | `tsconfig.json`, `eslint.config` | ✅ DONE |
| **T-005** | API Spesifikatsiyasi va Ma'lumotlar shartnomalari | `A10 DOCS` | `Product-Manager-Skills` | `frontend/API-SPEC.md` | ✅ DONE |

---

### PHASE 1 — NestJS Backend Asosi & API Modullari
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-010** | JWT Authentication & Refresh Token mexanizmi | `A6 SECURITY` | `Claude-BugHunter` | `backend/src/auth/*` | ✅ DONE |
| **T-011** | Foydalanuvchilar va RBAC rollar boshqaruvi (Super Admin, Manager) | `A6 SECURITY` | `Claude-BugHunter` | `backend/src/users/*` | ✅ DONE |
| **T-012** | Mahsulotlar (Products) & Kategoriyalar CRUD API (Filter, Search, Sort) | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/products/*`, `categories/*` | ✅ DONE |
| **T-013** | Ko'p tilli mahsulot tarjimalari (Uzbek, Russian, English) | `A4 BACKEND` | `Agentic-SEO-Skill` | `backend/src/products/translations` | ✅ DONE |
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
| **T-029** | To'liq SEO, Schema.org (JSON-LD), OpenGraph va Accessibility (WCAG) | `A8 SEO-PM` | `Agentic-SEO-Skill` | `frontend/src/lib/site.ts`, `QA-REPORT.md` | ✅ DONE |

---

### PHASE 3 — React + Vite Standalone Admin Panel
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-030** | Vite + React 18 + Tailwind Admin infratuzilmasi | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/vite.config.ts` | ✅ DONE |
| **T-031** | Dashboard Analitikasi va Recharts grafiklari (Daromad, Buyurtmalar) | `A2 UI-UX` | `ui-ux-pro-max-skill` | `backend/admin/src/pages/Dashboard.tsx` | ✅ DONE |
| **T-032** | Mahsulotlar boshqaruvi (Qo'shish, Tahrirlash, O'chirish, Yog'lilik) | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Products.tsx` | ✅ DONE |
| **T-033** | Buyurtmalar boshqaruvi (Status yangilash, To'lov ko'rish) | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Orders.tsx` | ✅ DONE |
| **T-034** | Xabarlar va Qayta aloqa murojaatlari monitoringi | `A3 FRONTEND` | `mattpocock-development-skills` | `backend/admin/src/pages/Messages.tsx` | ✅ DONE |
| **T-035** | Media Kutubxonasi (Fayl yuklash, Papkalar, Albomlar) | `A3 FRONTEND` | `payloadcms-skill` | `backend/admin/src/pages/Media.tsx` | ✅ DONE |
| **T-036** | Dizayn, Ranglar va Sayt sozlamalari interfeysi | `A2 UI-UX` | `ui-ux-pro-max-skill` | `backend/admin/src/pages/Design.tsx` | ✅ DONE |

---

### PHASE 4 — To'lov Tizimlari (Payment Gateways)
| TASK_ID | Sarlavha | Agent | Tegishli Skill | Natija / Fayllar | Holat |
|:---|:---|:---:|:---|:---|:---:|
| **T-040** | Click Merchant API integratsiyasi (Prepare, Complete webhooklari) | `A4 BACKEND` | `Claude-BugHunter` | `backend/src/payments/click.service.ts` | ✅ DONE |
| **T-041** | Payme Merchant API integratsiyasi (CheckPerformTransaction, Create) | `A4 BACKEND` | `Claude-BugHunter` | `backend/src/payments/payme.service.ts` | ✅ DONE |
| **T-042** | Naqd to'lov (Cash on Delivery) mexanizmi | `A4 BACKEND` | `mattpocock-development-skills` | `backend/src/payments/cash.service.ts` | ✅ DONE |
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
| **T-071** | Vercel Deployment konfiguratsiyasi (`vercel.json`) | `A9 DEVOPS` | `nanoclaw` | `vercel.json`, `frontend/vercel.json` | ✅ DONE |
| **T-072** | Railway Cloud 1-Click Deploy konfiguratsiyasi | `A9 DEVOPS` | `nanoclaw` | `railway.json`, `RAILWAY-DEPLOY.md` | ✅ DONE |
| **T-073** | GitHub Actions CI/CD (Lint, Typecheck, Test, Build) | `A9 DEVOPS` | `nanoclaw` | `.github/workflows/backend-ci.yml` | ✅ DONE |
| **T-074** | Sentry / Log monitoring xatoliklarni qayd etish tizimi | `A6 SECURITY` | `Claude-BugHunter` | Error Tracking modul | 🔵 PENDING |
| **T-075** | Domen ulash va SSL sertifikatini sozlash (`sabo.uz`) | `A9 DEVOPS` | `Agentic-SEO-Skill` | DNS & Caddy / Cloudflare | 🔵 PENDING |

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
