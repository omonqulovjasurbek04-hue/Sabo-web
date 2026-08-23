# 🚀 SABO Loyihasini Railway (railway.com) ga Yuklash Qo'llanmasi

Ushbu qo'llanma orqali siz **SABO Dairy Platform** monoreposini [railway.com/new/github](https://railway.com/new/github) orqali to'liq, 0 dan boshlab xatosiz deploy qilasiz.

---

## 🏗️ Loyiha Arxitekturasi (Railway da)

Railway loyihangizda quyidagi 3 yoki 4 ta servis bo'ladi:
```text
Railway Project /
├── 1. PostgreSQL (Railway Database xizmati)
├── 2. Redis (Railway Database xizmati — ixtiyoriy)
├── 3. Sabo Backend (NestJS API — Root directory: /backend)
└── 4. Sabo Frontend (Next.js 15 Do'kon va Admin — Root directory: /frontend)
```

---

## 📋 Bosqichma-bosqich Deploy Qilish

### 1-QADAM: Railway da Yangi Loyiha Ochish
1. Brauzerda [https://railway.com/new/github](https://railway.com/new/github) havolasiga kiring.
2. GitHub profilingizni ulang va **`Sabo-web`** omborini tanlang.
3. Hozircha **"Deploy Later"** yoki bo'sh loyihani tanlang (yoki to'g'ridan-to'g'ri bo'sh loyiha yarating).

---

### 2-QADAM: PostgreSQL Ma'lumotlar Bazasini Qo'shish
1. Railway Dashboard ichida **`+ New`** tugmasini bosing.
2. **`Database`** -> **`Add PostgreSQL`** ni tanlang.
3. PostgreSQL bir necha soniyada ishga tushadi.
4. Database ustiga bosib **`Variables`** bo'limiga kiring: u yerda `DATABASE_URL` avtomatik paydo bo'ladi.

---

### 3-QADAM: Redis Kesh Bazasini Qo'shish (Ixtiyoriy)
1. Railway Dashboard ichida **`+ New`** tugmasini bosing.
2. **`Database`** -> **`Add Redis`** ni tanlang.
3. Redis bir necha soniyada ishga tushadi va `REDIS_URL` tayyor bo'ladi. *(Agar Redis ulanmasa ham tizim xotirada fallback rejimida barqaror ishlayveradi)*.

---

### 4-QADAM: Backend Xizmatini Sozlash (NestJS API)
1. Railway Dashboard ichida **`+ New`** -> **`GitHub Repo`** -> **`Sabo-web`** ni tanlang.
2. Servis nomini **`sabo-backend`** deb o'zgartiring.
3. Servisning **`Settings`** bo'limiga o'ting:
   - **Root Directory:** `/backend`
   - **Build Command:** *(bo'sh qoldiring, `backend/Dockerfile` avtomatik ishlaydi)*
   - **Healthcheck Path:** `/api/v1/health`
4. Servisning **`Variables`** bo'limiga o'tib, quyidagi o'zgaruvchilarni kiriting:

| O'zgaruvchi nomi (Key) | Qiymat (Value) | Izoh |
|---|---|---|
| `NODE_ENV` | `production` | Ishlab chiqarish muhiti |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Railway Postgres ulanish havolasi |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` | Railway Redis ulanish havolasi |
| `JWT_ACCESS_SECRET` | `sabo_production_jwt_access_secret_secure_key_32chars` | Kamida 32 ta belgili maxfiy kalit |
| `JWT_REFRESH_SECRET` | `sabo_production_jwt_refresh_secret_secure_key_32chars` | Kamida 32 ta belgili maxfiy kalit |
| `ADMIN_BOOTSTRAP_EMAIL` | `admin@sabo.uz` | Dastlabki Super Admin logini |
| `ADMIN_BOOTSTRAP_PASSWORD` | `Admin0525` | Dastlabki Super Admin paroli |
| `CORS_ORIGINS` | `https://*.up.railway.app,https://sabo.uz,http://localhost:3000` | Ruxsat etilgan domenlar |
| `FRONTEND_URL` | `https://sabo.uz` | Asosiy frontend havolasi |

5. **`Networking`** bo'limiga o'tib, **`Generate Domain`** tugmasini bosing (masalan: `sabo-backend-production.up.railway.app`).

---

### 5-QADAM: Frontend Xizmatini Sozlash (Next.js 15)
1. Railway Dashboard ichida yana **`+ New`** -> **`GitHub Repo`** -> **`Sabo-web`** ni tanlang.
2. Servis nomini **`sabo-frontend`** deb o'zgartiring.
3. Servisning **`Settings`** bo'limiga o'ting:
   - **Root Directory:** `/frontend`
   - **Healthcheck Path:** `/api/v1/health`
4. Servisning **`Variables`** bo'limiga o'tib, quyidagi o'zgaruvchilarni kiriting:

| O'zgaruvchi nomi (Key) | Qiymat (Value) | Izoh |
|---|---|---|
| `NODE_ENV` | `production` | Ishlab chiqarish muhiti |
| `NEXT_PUBLIC_API_URL` | `https://sabo-backend-production.up.railway.app/api/v1` | 4-qadamda olingan Backend URL |
| `NEXT_PUBLIC_SITE_URL` | `https://sabo-frontend-production.up.railway.app` | Frontend sayt domeni |
| `INTERNAL_API_URL` | `https://sabo-backend-production.up.railway.app/api/v1` | Server-side SSR uchun API |
| `NEXT_PUBLIC_ADMIN_USER` | `Bekzodbek` | Admin login |
| `NEXT_PUBLIC_ADMIN_PASS` | `Admin0525` | Admin parol |

5. **`Networking`** bo'limiga o'tib, **`Generate Domain`** tugmasini bosing (masalan: `sabo-frontend-production.up.railway.app`).

---

## 🔑 Tizimga Kirish va Tekshirish

| Xizmat | Manzil (Railway Domain) |
|---|---|
| **Asosiy Do'kon Veb-sayti** | `https://sabo-frontend-production.up.railway.app` |
| **Admin Boshqaruv Paneli** | `https://sabo-frontend-production.up.railway.app/uz/admin` |
| **Backend Swagger Hujjatlari** | `https://sabo-backend-production.up.railway.app/docs` |
| **API Health Status** | `https://sabo-backend-production.up.railway.app/api/v1/health` |

### Admin Kirish Ma'lumotlari:
- **Login:** `Bekzodbek` yoki `admin@sabo.uz`
- **Parol:** `Admin0525`
- **Rol:** `SUPER_ADMIN` (To'liq boshqaruv)

---

## 🛠️ Muammolar va Yechimlar (Troubleshooting)

1. **Database ulanmadi deb chiqsa:**
   - Backend `Variables` bo'limida `DATABASE_URL` qiymati `${{Postgres.DATABASE_URL}}` ekanligini tekshiring.
   - `backend/docker-entrypoint.sh` skripti PostgreSQL ulanganda avtomatik `prisma db push` va `seed` buyruqlarini xavfsiz ishga tushiradi.

2. **CORS Error (Brauzerda API bloklansa):**
   - Backend `CORS_ORIGINS` maydoniga Frontend domenini (yoki `*`) qo'shing.

3. **Rasmlar ochilmasa:**
   - `frontend/next.config.ts` ga `*.railway.app` va `*.up.railway.app` domenlari avtomatik kiritilgan.
