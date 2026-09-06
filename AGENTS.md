# SABO Dairy Platform — AI Agent Yo'riqnomasi (AGENTS.md)

Ushbu fayl har qanday AI yordamchisi (Antigravity, Claude, Codex, Gemini) ushbu loyihada ishlashni boshlaganda amal qilishi kerak bo'lgan asosiy qo'llanma hisoblanadi.

---

## 1. Loyiha Haqida Qisqacha
- **Nomi:** SABO Dairy Platform (Tabiiy sut mahsulotlari ekotizimi).
- **Arxitektura:** Monorepo (`frontend/`, `backend/`, `backend/admin/`).
- **Stack:**
  - Frontend: **Next.js 15 (App Router)**, React 19, Tailwind CSS, i18n (UZ, RU, EN), SEO.
  - Backend: **NestJS 10**, Prisma ORM, PostgreSQL, Redis, JWT Auth, Click/Payme.
  - Admin Panel: **React 18 + Vite**, Tailwind CSS, Recharts, Lucide Icons.

---

## 2. Vazifalar va Yo'l Xaritasi (Tasks & Roadmap)
Barcha vazifalar, bosqichlar va ularning bajarilish holati [TASKS.md](file:///c:/Users/Admin/Documents/GitHub/Sabo-web/TASKS.md) faylida to'liq keltirilgan:
- `PHASE 0` — Arxitektura & Monorepo Asosi (✅ DONE)
- `PHASE 1` — NestJS API & Prisma Modullari (✅ DONE)
- `PHASE 2` — Next.js 15 Frontend Do'kon & Ko'p Tillilik (✅ DONE)
- `PHASE 3` — Vite Admin Boshqaruv Paneli (✅ DONE)
- `PHASE 4` — To'lov Tizimlari (Click, Payme, Naqd) (🟡 IN_PROGRESS)
- `PHASE 5` — Real Kontent & Rasmlar (🔵 PENDING)
- `PHASE 6` — SMS & Telegram Integratsiyalari (🔵 PENDING)
- `PHASE 7` — Deployment & CI/CD (🟡 IN_PROGRESS)

---

## 3. AI Orchestrator Skill Bog'lanishlari

Loyihada ishlashda Jasurbekning `AI Orchestrator` skillaridan quyidagi tartibda foydalaniladi:

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
4. **Xatoni yashirmang** — barcha loglar va test natijalarini shaffof ko'rsating.
