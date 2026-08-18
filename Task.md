# 🥛 SABO — Loyiha Vazifalari, Dasturlash va Backend Tili Tizimi (Task.md)

## 🎯 1. Dasturlash Tili va Backend Tili Taqsimoti (Tech Stack Architecture)

Loyiha frontend va backend o'rtasida 100% Type-Safe va yagona ekotizimni ta'minlash uchun **TypeScript (Full-Stack)** arxitekturasida qurilgan:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SABO FULL-STACK DASTURLASH TILLARI                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🟦 TypeScript (Full-Stack) : 85%                                            │
│    • Frontend : React 19 + TypeScript (Vite, Contextlar, UI Komponentlar)    │
│    • Backend  : Node.js + Express (TypeScript, REST API, Webhooks, Auth)    │
│    • Shared   : src/types/index.ts (Barcha API va ma'lumotlar modellari)    │
│ 🟩 CSS / Tailwind CSS v4    : 10% (SABO Tokenlar, Responsive, Dark/Light)   │
│ 🟧 HTML5 Semantics          : 3%  (SEO JSON-LD, WCAG AA Accessibility)      │
│ 🟨 WebGL / Shader / JSON    : 2%  (3D Sut stakani Canvas, i18n tarjimalar)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ 2. Backend Arxitekturasi va REST API Tuzilishi (`server/`)

Backend to'liq **TypeScript + Express** asosida qurilgan bo'lib, `server/` papkasida joylashgan:

| Modul / Fayl | Vazifasi va Imkoniyatlari |
|---|---|
| [server/index.ts](file:///server/index.ts) | Asosiy Express server fayli (CORS, JSON parser, Port 5000) |
| [server/routes/products.ts](file:///server/routes/products.ts) | Mahsulotlar katalogi, kategoriya/narx bo'yicha filtrlar, qidiruv va tafsilot API |
| [server/routes/orders.ts](file:///server/routes/orders.ts) | Savat buyurtmalarini qabul qilish, hisob-kitob va buyurtma holatini kuzatish (Tracking) |
| [server/routes/payments.ts](file:///server/routes/payments.ts) | O'zbekiston milliy to'lov tizimlari (**Click** prepare/complete va **Payme** JSON-RPC) webhooklari |
| [server/routes/articles.ts](file:///server/routes/articles.ts) | Retseptlar va yangiliklar blogi API |
| [server/routes/contact.ts](file:///server/routes/contact.ts) | Hamkorlik arizalari va filiallar ro'yxati API |
| [server/db/database.ts](file:///server/db/database.ts) | SQLite / PostgreSQL / Supabase bilan mos in-memory & disk ma'lumotlar bazasi |

---

## 🛠️ 3. Loyihadagi 9 Ta Maxsus Skill (`.agents/skills/`)

| № | Skill Nomi | Fayl | Yo'nalishi va Vazifasi |
|---|---|---|---|
| 1 | `puremilk-backend-database` | [.agents/skills/puremilk-backend-database/SKILL.md](file:///.agents/skills/puremilk-backend-database/SKILL.md) | Node.js/Express + TypeScript REST API, SQLite/Supabase DB, Click/Payme to'lov shlyuzlari. |
| 2 | `puremilk-modern-stack-guide` | [.agents/skills/puremilk-modern-stack-guide/SKILL.md](file:///.agents/skills/puremilk-modern-stack-guide/SKILL.md) | 85% TypeScript Full-Stack, Tailwind v4, Motion va 100% bepul hosting (Vercel/Cloudflare). |
| 3 | `puremilk-agent-orchestrator` | [.agents/skills/puremilk-agent-orchestrator/SKILL.md](file:///.agents/skills/puremilk-agent-orchestrator/SKILL.md) | Claude, Gemini va Codex subagentlarini boshqarish, tsikllarning oldini olish, xatosiz promptlar. |
| 4 | `puremilk-design-fidelity` | [.agents/skills/puremilk-design-fidelity/SKILL.md](file:///.agents/skills/puremilk-design-fidelity/SKILL.md) | Dizayn aniqligi, maketlarni yagona haqiqat manbasi (Source of Truth) sifatida saqlash. |
| 5 | `puremilk-fact-integrity` | [.agents/skills/puremilk-fact-integrity/SKILL.md](file:///.agents/skills/puremilk-fact-integrity/SKILL.md) | AI tomonidan soxta statistika yoki sertifikatlar to'qib chiqarilishini qat'iy taqiqlash. |
| 6 | `puremilk-performance-seo` | [.agents/skills/puremilk-performance-seo/SKILL.md](file:///.agents/skills/puremilk-performance-seo/SKILL.md) | Core Web Vitals (<2.5s LCP), JSON-LD Structured Data, texnik SEO va WebP rasmlar. |
| 7 | `puremilk-animations-3d` | [.agents/skills/puremilk-animations-3d/SKILL.md](file:///.agents/skills/puremilk-animations-3d/SKILL.md) | Three.js / WebGL 3D sut stakani (`MilkGlass3D.tsx`), silliq scroll reveal, dinamik counterlar. |
| 8 | `puremilk-senior-qa-review` | [.agents/skills/puremilk-senior-qa-review/SKILL.md](file:///.agents/skills/puremilk-senior-qa-review/SKILL.md) | 10 yillik Senior Dev audit, `tsc --noEmit` 0 xato, WCAG AA accessibility, responsive testlar. |
| 9 | `puremilk-ecommerce-architecture` | [.agents/skills/puremilk-ecommerce-architecture/SKILL.md](file:///.agents/skills/puremilk-ecommerce-architecture/SKILL.md) | Savat, kassa (Checkout), ko'p tillilik (UZ/RU/EN), dark/light tema, sevimlilar (Wishlist). |

---

## 🌐 4. Tashqi Skill Resurslari va Repozitoriylar
- **Claude.ai / Claude Code:** [https://github.com/topics/claude-code-skills](https://github.com/topics/claude-code-skills) & [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills)
- **Gemini CLI / Antigravity:** [https://github.com/topics/gemini-skills](https://github.com/topics/gemini-skills) & [google-gemini/gemini-skills](https://github.com/google-gemini/gemini-skills)
- **ChatGPT / OpenAI Codex:** [https://github.com/topics/codex-skills](https://github.com/topics/codex-skills) & [troykelly/codex-skills](https://github.com/troykelly/codex-skills)

---

## 🚀 5. Ishga Tushirish Buyruqlari
```bash
# Frontend dev server (Port 3000)
npm run dev

# Backend API server (Port 5000 - TypeScript tsx)
npm run server

# TypeScript tekshiruvi (0 ta xato)
npm run typecheck

# Production build
npm run build
```