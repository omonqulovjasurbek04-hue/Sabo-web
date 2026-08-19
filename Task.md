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
6. All Task.
# 🚀 Full-Stack Veb-Loyiha uchun AI Master-Prompt Shabloni

Bu — istalgan full-stack veb-loyihani (frontend + backend + ma'lumotlar bazasi) Claude yordamida to'liq va optimal darajada qurish uchun tayyorlangan universal shablon. Maqsad: loyiha haqida AI'ga bir marta, to'liq va tartibli tushuntirish — shundan keyin AI o'zi rejalashtiradi, bosqichma-bosqich quradi, kontekstdan tejamli foydalanadi va oxirida o'zini-o'zi tekshiradi.

## 🧭 Qanday foydalanish kerak

1. Pastdagi **MASTER PROMPT** ichidagi barcha `[ ]` qavslarni o'z loyihangizga mos to'ldiring. Aniq bilmagan joyni bo'sh qoldirish ham mumkin — promptda "noaniq bo'lsa o'zing tanla" degan ko'rsatma bor, AI mos variantni tavsiya qiladi.
2. To'liq matnni nusxalab, Claude'ga yuboring. Katta loyiha uchun oddiy chatdan ko'ra **Claude Code** tavsiya etiladi — sababi pastda, "Qo'shimcha maslahatlar" qismida.
3. AI har bosqichni tugatgach beradigan qisqa hisobotlarni o'qib boring.
4. Loyiha tugagach, alohida berilgan **"Yakuniy tekshiruv" promptini** (pastda) yangi xabar sifatida yuboring — shunda AI charchagan kontekst emas, "toza ko'z" bilan tekshiradi.

---

## ✂️ MASTER PROMPT (shu yerdan pastini to'liq nusxalang)

```
Sen — 10+ yillik tajribaga ega Senior Full-Stack Dasturchi va Dasturiy Arxitektorsan. Men senga to'liq ishlaydigan, professional darajadagi va optimal ishlaydigan veb-ilova qurishni topshiraman. Pastdagi barcha bo'limlarga qat'iy amal qil va hech bir qismni o'tkazib yuborma.

## 0. ISHNI BOSHLASHDAN OLDIN
- Agar muhitingda tegishli SKILL.md fayllar mavjud bo'lsa (masalan frontend dizayni yoki hujjat yaratish uchun) — ularni albatta oldin o'qib chiq va qoidalariga rioya qil.
- Loyiha ildizida CLAUDE.md faylini yarat va unga texnologik stack, kod uslubi qoidalari va papka strukturasini yoz. Bu fayl har yangi sessiya boshida avtomatik o'qiladi — meni har safar qayta tushuntirishga majburlama.
- Ishni boshlashdan oldin qisqa reja tuz va menga tasdiqlash uchun ko'rsat, tasdiqdan keyingina kod yozishga o't.
- Imkon qadar to'liq va ishlaydigan kod yoz — "keyinroq qo'shiladi" turidagi bo'sh joylarni minimal darajada qoldir; agar biror qism chindan ham keyinga qoldirilsa, buni PROGRESS.md'da ochiq yoz.

## 1. LOYIHA HAQIDA
- Nomi: [LOYIHA NOMI]
- Turi: [masalan: onlayn do'kon / ta'lim platformasi / CRM / portfolio / ijtimoiy tarmoq]
- Hal qiladigan muammo / maqsad: [...]
- Maqsadli foydalanuvchi: [...]
- Asosiy funksiyalar (3–10 ta, muhimlik tartibida):
  1. [...]
  2. [...]
- Interfeys tili(lari): [o'zbek / rus / ingliz]

## 2. FRONTEND
- Texnologiya: [React + Next.js / Vue + Nuxt / oddiy HTML+CSS+JS — noaniq bo'lsa, eng mos variantni o'zing tanla va 2–3 gapda sababini tushuntir]
- Dizayn yo'nalishi: [minimalist / zamonaviy glassmorphism / korporativ-jiddiy / o'yinsifat-rangdor — noaniq bo'lsa, loyiha turiga mos variant taklif qil]
- Brend ranglari/shrift: [bo'lsa yozing, bo'lmasa o'zing tanla]
- Barcha sahifalar mobil, planshet va desktopda mukammal ko'rinishi shart (mobile-first)
- Qayta ishlatiladigan komponentlar tuzilishidan foydalan, rang/oraliq/shrift o'lchamlarini alohida dizayn-token sifatida saqla
- Yuklanish (skeleton/loading), xato va bo'sh holatlar uchun ham alohida dizayn qil

## 3. ANIMATSIYA VA 3D
- Sahifa/komponent o'tishlari: Framer Motion (React) yoki GSAP (istalgan freymvork bilan)
- Scroll bilan bog'liq animatsiyalar: reveal-on-scroll, yengil parallaks effektlar
- Agar loyiha xarakteriga mos bo'lsa: Three.js / React Three Fiber orqali 3D elementlar (masalan bosh sahifadagi interaktiv 3D obyekt)
- Shart: hech qanday animatsiya sahifa tezligiga sezilarli zarar keltirmasin — og'ir 3D sahnalarni lazy-load qil, prefers-reduced-motion sozlamasini hurmat qil

## 4. BACKEND
- Texnologiya: [Node.js+Express / Laravel / Django yoki FastAPI — noaniq bo'lsa o'zing tanla]
- Autentifikatsiya: [JWT / Sanctum / OAuth / sessiya asosida]
- API arxitekturasi: REST (yoki GraphQL), izchil endpoint nomlash (masalan /api/v1/...)
- Har bir endpoint to'g'ri HTTP status kod va tushunarli xato xabari qaytarsin
- Barcha kirish ma'lumotlarini SERVER tomonida ham tekshir — frontend validatsiyasiga hech qachon ishonma
- Muhim harakatlar va xatoliklarni tuzilgan tarzda logla

## 5. MA'LUMOTLAR BAZASI
- DB turi: [PostgreSQL / MySQL / MongoDB / SQLite — noaniq bo'lsa loyiha xususiyatiga qarab o'zing tanla va sababini tushuntir]
- To'g'ri normallashtirilgan sxema, tez-tez so'raladigan ustunlarga indeks qo'y
- N+1 so'rov muammosidan qoch (eager loading/join'lardan foydalan)
- Migratsiya fayllarini va namunaviy (seed) ma'lumotlarni yarat

## 6. ARXITEKTURA VA LOYIHA STRUKTURASI
Quyidagi kuzatuv fayllarini yarat va ular orqali ishni boshqar:
- CLAUDE.md — texnologik qarorlar, kod uslubi, papka strukturasi
- PROGRESS.md — nima qilingani / nima qilinayapti / navbatdagi qadamlar (har bosqichdan keyin yangila)
- API-SPEC.md — barcha backend endpointlar va ularning so'rov/javob formati
- ERROR-LOG.md — ishlash jarayonida topilgan va tuzatilgan xatoliklar tarixi

Taxminiy papka strukturasi:
loyiha-nomi/
    frontend/     -> komponentlar, sahifalar, stillar
    backend/      -> controller, model, route
    CLAUDE.md
    PROGRESS.md
    API-SPEC.md
    ERROR-LOG.md
    README.md

Kelajakda yangi funksiya qo'shish oson bo'ladigan, kengaytiriladigan (extensible) arxitektura tanla — hammasini bir-biriga qattiq bog'lab qo'yma.

## 7. ISHNI BOSQICHLARGA BO'LISH VA KONTEKSTDAN TEJAMLI FOYDALANISH
Loyihani bittada emas, quyidagi tartibda, HAR BOSQICHNI ALOHIDA yakunlab bor:
1. Reja + CLAUDE.md
2. Ma'lumotlar bazasi sxemasi va migratsiyalar
3. Backend — asosiy API va autentifikatsiya
4. Frontend — asosiy sahifalar va komponentlar
5. Frontend↔backend integratsiyasi
6. Dizayn/animatsiya/3D sayqallash
7. Yakuniy sifat nazorati (8-bandga qarang)

Har bosqich oxirida PROGRESS.md faylini yangila va menga 3–5 qatorlik qisqa hisobot ber. Agar keyingi vazifa avvalgisiga bog'liq bo'lmasa — yangi, toza sessiyadan boshla. Xuddi shu vazifani davom ettirayotgan bo'lsang-u, suhbat uzayib ketsa — kontekst deyarli to'lguncha kutmasdan, taxminan 50–60% da uni siqib ol (compact) va nimani albatta saqlab qolish kerakligini aniq ayt (masalan: "arxitektura qarorlari va oxirgi kod o'zgarishlarini saqla"). Katta fayllarni suhbat ichiga joylashtirma — ularni to'g'ridan-to'g'ri o'qi. Bir nechta yordamchi agent (subagent)dan foydalanadigan bo'lsang: har biriga aniq va tor vazifa tavsifi ber, ruxsat etilgan vositalarni cheklab qo'y, va barchasi CLAUDE.md orqali umumiy qoidalarni bilishini ta'minla — shunda har bir agent bir-birini ko'rmasa ham bir xil standartga rioya qiladi.

## 8. YAKUNIY SIFAT NAZORATI — "SENIOR DASTURCHI" TEKSHIRUVI
Loyiha tugagach (yoki alohida so'ralganda), o'zingni juda talabchan, 10 yildan ortiq tajribaga ega senior dasturchi/arxitekt sifatida tasavvur qil va butun kodni boshidan-oxirigacha qayta ko'rib chiq:
- Xavfsizlik: SQL/NoSQL in'ektsiya, XSS, CSRF, ochiq saqlangan parol/kalitlar bormi?
- Mantiqiy xatolar: funksiyalar talabga to'liq mos ishlayaptimi?
- Performance: sekin so'rovlar, ortiqcha qayta render, optimallashtirilmagan rasmlar bormi?
- Responsive: mobil/planshet/desktopda sinovdan o'tdimi?
- Edge case'lar: bo'sh ma'lumot, noto'g'ri kiritilgan qiymat, tarmoq uzilishi hisobga olinganmi?
- Kod sifati: izchil nomlash, takrorlanmagan (DRY) kod, tushunarli struktura
- Hujjat: README to'liq va aniqmi?

Topilgan HAR BIR muammoni QA-REPORT.md fayliga muammo tavsifi va jiddiylik darajasi (yuqori/o'rta/past) bilan yoz, so'ng eng jiddiylaridan boshlab birma-bir tuzat va har birini tuzatgach qisqa xabar ber. Faqat "hammasi joyida" deb yopib qo'yma — kamida bitta haqiqiy zaiflik yoki yaxshilash imkoniyatini albatta top.

## 9. YETKAZIB BERISH
- To'liq ishga tushiriladigan loyiha, .env.example va o'rnatish/ishga tushirish yo'riqnomasi bilan README.md
- Kod izchil formatlashtirilgan (linter/formatter qoidalariga mos)
- Git uchun mantiqiy, bosqichlarga mos commit tarixi
```

---

## 🔍 Alohida yuboriladigan "Yakuniy tekshiruv" prompti

Loyiha tugagach, buni **yangi xabar** sifatida (imkoni bo'lsa yangi sessiyada) yuboring:

```
CLAUDE.md, PROGRESS.md va API-SPEC.md fayllarini o'qib, loyihaning joriy holatini to'liq tushunib ol. Shundan so'ng, 10+ yillik tajribaga ega, juda talabchan senior dasturchi sifatida butun kod bazasini xavfsizlik, mantiqiy xatolar, performance, responsive dizayn, edge case'lar va kod sifati bo'yicha tekshir. Har bir topilgan muammoni QA-REPORT.md fayliga jiddiylik darajasi bilan yoz, so'ng eng muhimlaridan boshlab birma-bir tuzat.
```

---

## 💡 Qo'shimcha maslahatlar

**Nega Claude Code?** Ko'p faylli va uzoq davom etadigan loyiha uchun oddiy chatdan ko'ra Claude Code qulayroq: fayllar to'g'ridan-to'g'ri diskda saqlanadi, CLAUDE.md har sessiya boshida avtomatik o'qiladi (xotira yo'qolmaydi), va kontekst to'lib qolganda `/compact` (qisqartirib davom ettirish) yoki `/clear` (bog'liq bo'lmagan yangi vazifa uchun toza boshlash) buyruqlaridan foydalanish mumkin.

**Tanlov uchun tayyor texnologik to'plamlar** ([ ] joylarni bo'sh qoldirsangiz, quyidagi qatorlardan birini yozib qo'yishingiz mumkin):

| Yo'nalish | Sizga tanish stack | To'liq JS/TS stack | Python asosidagi stack |
|---|---|---|---|
| Frontend | Next.js + Tailwind CSS | Next.js + Tailwind CSS | React + Tailwind CSS |
| Backend | Laravel (Sanctum) | Next.js API routes / Node+Express | Django yoki FastAPI |
| DB | MySQL | PostgreSQL | PostgreSQL |

Birinchi ustun — mavjud tajribangizga (Laravel + Sanctum + Next.js/React + Tailwind) eng yaqin variant. Uchinchisi — talabalar Python bilan tanish bo'lsa, dars uchun qulayroq bo'lishi mumkin.

**Realistik kutish:** AI katta loyihalarni ham qura oladi, lekin murakkab loyihani bir necha sessiyaga (bir necha kun davomida) bo'lib olib borish har doim "hammasini birdan" so'rashdan yaxshiroq natija beradi.