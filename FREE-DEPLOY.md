# 🆓 SABO'ni Butunlay Bepul Serverga Qo'yish (Vercel + Render + Neon)

Bu qo'llanma **kredit karta shart emas**, **muddatsiz bepul** uchta xizmatdan foydalanadi:

| Qism | Xizmat | Nega bepul qoladi |
|---|---|---|
| Frontend (Next.js) | **Vercel** — [vercel.com](https://vercel.com) | Hobby plan muddatsiz bepul |
| Backend (NestJS API) | **Render** — [render.com](https://render.com) | Free Web Service muddatsiz bepul (750 soat/oy — bitta servis uchun 24/7 yetadi) |
| Ma'lumotlar bazasi (PostgreSQL) | **Neon** — [neon.tech](https://neon.tech) | Free tier muddatsiz bepul |

⚠️ **Railway bu qo'llanmada ishlatilmaydi** — u faqat $5 trial credit tugagunча bepul, keyin pullik bo'lib qoladi.

**Muhim cheklovlar (bepul bo'lgani uchun):**
- Render backend 15 daqiqa hech kim so'rov yubormasa "uxlab qoladi" — keyingi birinchi so'rov ~30-50 soniya kutadi (keyin tez ishlaydi). Sayt kam tashrif buyursa buni his qilasiz.
- Neon bazasi harakatsizlikda avtomatik "uyquga ketadi", lekin so'rov kelganda o'zi tez (odatda <1s) uyg'onadi — ma'lumot o'chib qolmaydi.
- Redis va S3 (media/fayl yuklash) hozircha ulanmaydi — backend ularsiz ham ishlayveradi (rasm yuklash funksiyasi keyinroq Cloudflare R2 bilan qo'shiladi).

---

## 1-QADAM: Neon — PostgreSQL bazasi ochish

1. [neon.tech](https://neon.tech) ga kiring, **"Sign up"** — GitHub akkountingiz bilan ro'yxatdan o'ting (kredit karta so'ralmaydi).
2. **"Create a project"** tugmasini bosing. Nomi: `sabo-db`, Region: eng yaqinini tanlang (masalan Europe/Frankfurt).
3. Loyiha yaratilgach, Dashboard'da **"Connection string"** ko'rinadi — bu `DATABASE_URL` qiymati. Formati taxminan:
   ```
   postgresql://user:password@ep-xxxx.eu-central-1.aws.neon.tech/sabo?sslmode=require
   ```
4. Bu qatorni nusxalab, xavfsiz joyga saqlab qo'ying — 2-qadamda kerak bo'ladi.

---

## 2-QADAM: Render — Backend (NestJS) deploy qilish

Repo ildizida `render.yaml` fayli allaqachon tayyorlab qo'yilgan — Render uni avtomatik o'qiydi.

1. [render.com](https://render.com) ga kiring, **"Get Started"** — GitHub akkountingiz bilan ro'yxatdan o'ting.
2. Dashboard'da **"New +"** → **"Blueprint"** ni tanlang.
3. GitHub'ni ulang va **`Sabo-web`** omborini tanlang → Render `render.yaml` faylini avtomatik topib, `sabo-backend` nomli Web Service taklif qiladi.
4. **"Apply"** bosishdan oldin, quyidagi Environment Variable'larni kiriting (`sync: false` deb belgilanganlar — Render sizdan qo'lda so'raydi):

| Kalit (Key) | Qiymat | Izoh |
|---|---|---|
| `DATABASE_URL` | 1-qadomda Neon'dan olingan connection string | |
| `JWT_ACCESS_SECRET` | `TMHjv1LBaMwk3eLbiyU/zn3p0oRuPK3POpTBzU8u0t0=` | Tayyorlab qo'ydim, xohlasangiz o'zgartiring |
| `JWT_REFRESH_SECRET` | `DVPZ16U1XZEQeaNuSXEOTwO5fPSpNbrWBkUvTrMQK20=` | Access'dan farqli bo'lishi shart |
| `ADMIN_BOOTSTRAP_EMAIL` | O'zingizning emailingiz, masalan `admin@sabo.uz` | Birinchi SUPER_ADMIN login |
| `ADMIN_BOOTSTRAP_PASSWORD` | `XwMeOidhBEdn3jHmAa1!` | Tayyorlab qo'ydim, birinchi kirishdan keyin o'zgartiring |
| `CORS_ORIGINS` | hozircha `*` qoldiring | 3-qadomdan keyin haqiqiy Vercel domenga almashtiramiz |
| `FRONTEND_URL` | hozircha `http://localhost:3000` qoldiring | 3-qadomdan keyin yangilaymiz |

5. **"Apply"** ni bosing — Render birinchi build'ni boshlaydi (5-10 daqiqa cho'zilishi mumkin).
6. Build tugagach, Render sizga domen beradi, masalan: `https://sabo-backend.onrender.com`. Buni saqlab qo'ying.
7. Tekshiring: brauzerda `https://sabo-backend.onrender.com/api/v1/health` ni oching — `{"status":"ok"}` kabi javob ko'rinishi kerak (birinchi so'rov sekin bo'lishi mumkin, kuting).

> **Agar "Blueprint" topilmasa** — qo'lda yaratsangiz ham bo'ladi: "New +" → "Web Service" → repo tanlang → Root Directory bo'sh qoldiring → Build Command: `npm ci --workspace=backend --include-workspace-root && npm run build:backend` → Start Command: `cd backend && npx prisma db push --accept-data-loss && npx ts-node prisma/seed.ts; node dist/main.js` → Plan: Free → yuqoridagi environment variable'larni qo'lda qo'shing.

---

## 3-QADAM: Vercel — Frontend (Next.js) deploy qilish

1. [vercel.com](https://vercel.com) ga kiring, GitHub akkountingiz bilan ro'yxatdan o'ting.
2. **"Add New..."** → **"Project"** → **`Sabo-web`** omborini import qiling.
3. **"Root Directory"** maydonida **`frontend`** ni tanlang (muhim — aks holda Vercel noto'g'ri papkani deploy qiladi). Framework avtomatik "Next.js" deb aniqlanadi.
4. **"Environment Variables"** bo'limiga quyidagilarni qo'shing:

| Kalit (Key) | Qiymat |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://sabo-backend.onrender.com/api/v1` (2-qadomdagi Render domeningiz) |
| `NEXT_PUBLIC_SITE_URL` | hozircha bo'sh qoldiring, deploy tugagach Vercel domenini qo'yamiz |
| `INTERNAL_API_URL` | `https://sabo-backend.onrender.com/api/v1` |

5. **"Deploy"** tugmasini bosing (2-3 daqiqa).
6. Deploy tugagach Vercel domeningiz chiqadi, masalan: `https://sabo-web.vercel.app`. Shu domenni **"Settings" → "Environment Variables"** ichida `NEXT_PUBLIC_SITE_URL` ga qo'shib, **"Redeploy"** qiling.

---

## 4-QADAM: Backendga Frontend domenini bog'lash (CORS)

1. Render Dashboard'ga qayting → `sabo-backend` servisi → **"Environment"**.
2. `CORS_ORIGINS` qiymatini `*` dan haqiqiy Vercel domeningizga almashtiring: `https://sabo-web.vercel.app`
3. `FRONTEND_URL` ni ham xuddi shunga o'zgartiring: `https://sabo-web.vercel.app`
4. Saqlang — Render avtomatik qayta deploy qiladi (~1-2 daqiqa).

---

## 5-QADAM: Tekshirish

| Nima | Manzil |
|---|---|
| Sayt | `https://sabo-web.vercel.app` |
| Admin panel | `https://sabo-web.vercel.app/uz/admin` |
| Backend health | `https://sabo-backend.onrender.com/api/v1/health` |
| Swagger API docs | `https://sabo-backend.onrender.com/docs` |

Admin panelga 2-qadomda o'rnatgan `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` bilan kiring.

---

## Muammolar

- **Sayt ochilganda backend javob bermayapti** → Render bepul plan 15 daqiqa harakatsizlikdan keyin uxlaydi, birinchi so'rov sekin. Bir necha soniya kutib qayta urinib ko'ring.
- **CORS xatosi (brauzer konsolida)** → Render'dagi `CORS_ORIGINS` haqiqiy Vercel domeningiz bilan bir xil ekanligini tekshiring (oxirida `/` bo'lmasligi kerak).
- **Admin bilan kira olmayapti** → Render Logs bo'limida seed muvaffaqiyatli ishlaganini tekshiring; kerak bo'lsa Render "Shell" orqali qo'lda ishga tushiring: `cd backend && npx ts-node prisma/seed.ts`.
- **Rasm/fayl yuklash ishlamayapti** → S3/media hozircha ulanmagan, bu kutilgan holat — keyinroq Cloudflare R2 (10GB bepul) bilan qo'shamiz.
