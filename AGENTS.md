# SABO Dairy Platform — AI Agent Yo'riqnomasi (AGENTS.md)

Ushbu fayl har qanday AI yordamchisi (Antigravity, Claude, Codex, Gemini) ushbu loyihada ishlashni boshlaganda amal qilishi kerak bo'lgan asosiy qo'llanma hisoblanadi.

---

## 1. Loyiha Haqida Qisqacha
- **Nomi:** SABO Dairy Platform (Tabiiy sut mahsulotlari ekotizimi).
- **Arxitektura:** Monorepo (`frontend/`, `backend/`, `backend/admin/`).
- **Stack:**
  - Frontend: **Next.js 15 (App Router)**, React 19, Tailwind CSS v4, i18n (UZ, RU, EN), SEO.
  - Backend: **NestJS 10**, Prisma ORM, PostgreSQL, Redis, JWT Auth, Click/Payme.
  - Admin Panel: **React 19 + Vite 6**, Tailwind CSS v4, Recharts, Lucide Icons.

---

## 2. Ishni boshlashdan oldin o'qing
1. [`README.md`](README.md) — ishga tushirish va tuzilma.
2. [`TASKS.md`](TASKS.md) — vazifalar va holati.
3. [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) — ma'lum muammolar va ularning holati.
4. [`docs/prompts/00-master.md`](docs/prompts/00-master.md) va vazifaga tegishli fokus prompt (`docs/prompts/01…09`).
5. API va xavfsizlik: [`docs/API.md`](docs/API.md), [`docs/SECURITY.md`](docs/SECURITY.md).
6. Tegishli arxitektura hujjati: [`docs/architecture/`](docs/architecture/README.md).
7. Frontend ishida: [`docs/architecture/frontend-guidelines.md`](docs/architecture/frontend-guidelines.md).

---

## 3. AI Orchestrator Skill Bog'lanishlari

| Yo'nalish | Tavsiya etilgan Skill | Qayerda qo'llaniladi |
|:---|:---|:---|
| **TypeScript / Kod Sifati** | `mattpocock-development-skills` | Barcha backend va frontend kodlari, Type-safety |
| **Dizayn & UI/UX** | `ui-ux-pro-max-skill` | Frontend va Admin panel stillari, animatsiyalar |
| **Xavfsizlik & Audit** | `Claude-BugHunter` / `gemini-security-skills` | Auth, Rollar, To'lov webhooklari, API himoyasi |
| **SEO & Marketing** | `Agentic-SEO-Skill` | Meta teglar, JSON-LD, Sitemap, ko'p tillilik |
| **Test & QA** | `playwright-best-practices-skill` | Savat, checkout va admin formalarini sinash |
| **DevOps & Muhit** | `nanoclaw` | Docker, Railway va Vercel sozlamalari |

---

## 4. Qat'iy Qoidalar (Agent Protocols)
1. **Hech qachon mavjud ishlagan funksiyani buzmang** — o'zgartirishdan oldin barcha chaqiruvchilarni tekshiring.
2. **Build tekshiruvini bajaring** — o'zgartirish kiritgandan so'ng `npm run build:all` buyrug'i 0 xato bilan o'tishi shart.
3. **Toza kod va Type-safety** — `any` turlaridan saqlaning, TypeScript interfeyslaridan to'liq foydalaning.
4. **Xatoni yashirmang** — barcha loglar va test natijalarini shaffof ko'rsating. Faqat haqiqatan ishga tushirilgan testni "o'tdi" deng.
5. **Mavjud arxitektura va foydalanuvchi o'zgarishlarini saqlang**; vazifadan tashqari refactor qilmang.
6. **Secretlar** (`.env`, tokenlar, production ma'lumotlari, mijoz PII) hech qachon ko'rsatilmaydi, loglanmaydi va commit qilinmaydi.
7. **Destructive buyruqlar** (`git reset --hard`, force push, DB reset, destructive migration) faqat aniq ruxsat bilan.
8. **Server — yagona haqiqat manbai:** narx, yetkazish, chegirma, stock va ruxsatlar backend'da tekshiriladi/hisoblanadi.
9. **To'lov callback'lari** autentifikatsiya qilinadi, summa tekshiriladi va idempotent bo'ladi.
10. **Tillar:** `uz`, `ru`, `en` to'liq saqlanadi; mahsulot, sifat yoki sertifikat haqida da'volar uydirilmaydi.
11. **Theme:** screenshot uchun vaqtinchalik CSS bilan haqiqiy theme almashtirilmaydi.
12. **Testlar:** xulq o'zgarsa, test qo'shiladi/yangilanadi. Diff kichik, izohli va qaytariladigan bo'lsin.
13. **Talab yoki provider hujjati yo'q bo'lsa** — taxmin qilmasdan aniq savol bering.

---

## 5. Hujjatlar xaritasi

```text
AGENTS.md                 # shu fayl
README.md                 # ishga tushirish
TASKS.md                  # vazifalar va bosqichlar
docs/
├── AUDIT_REPORT.md       # audit topilmalari (AUD-xxx)
├── API.md                # amaldagi API endpointlar
├── SECURITY.md           # xavfsizlik modeli va tekshiruvlar
├── DEPLOYMENT.md         # deployment indeksi → docs/deployment/*
├── architecture/         # blueprint: 01-audit … 10-roadmap, frontend-guidelines
├── prompts/              # AI coding promptlari (00-master … 09-production)
├── deployment/           # RAILWAY.md, ORACLE.md, FREE.md
├── screenshots/          # README uchun ekran rasmlari
└── archive/              # eski hisobotlar (tarix uchun, amaldagi qoida emas)
```
