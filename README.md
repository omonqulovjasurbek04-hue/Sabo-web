# SABO Dairy Platform — Fullstack Monorepo

SABO tabiiy sut va sut mahsulotlari platformasi. Loyiha **Frontend** (Next.js 15), **Admin Panel** (Vite + React + Tailwind + Recharts) va **Backend** (NestJS + Prisma) qismlariga ajratilgan to'liq ekotizimdir.

---

## 🔑 Admin Boshqaruv Tizimiga Kirish

| Maydon | Qiymat |
|---|---|
| **Admin Panel URL** | **`http://localhost:5173`** yoki **`http://localhost:3000/admin`** |
| **Login / Parol** | `backend/.env` dagi `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` qiymatlari (haqiqiy qiymatlar hech qachon git'ga commit qilinmaydi) |
| **Rol** | `SUPER_ADMIN` (Bosh Administrator) |

---

## 📁 Loyiha tuzilmasi (Project Structure)

```text
Sabo-web/
├── frontend/                   # Next.js 15 Public Veb-sayt va do'kon
│   ├── src/                    # UI Komponentlar, sahifalar va xizmatlar
│   │   ├── app/                # App Router (uz, ru, en toza URL'lar)
│   │   ├── components/         # 3D, Cart, Layout, UI elementlar
│   │   ├── lib/                # API client, yordamchi utilslar
│   │   └── locales/            # Til lug'atlari (UZ, RU, EN)
│   ├── package.json
│   ├── vercel.json             # Vercel deploy sozlamasi
│   └── next.config.ts
│
├── backend/                    # NestJS API + Admin Panel
│   ├── admin/                  # 🚀 React + TypeScript + Vite Admin Panel
│   │   ├── src/                # Dashboard, Mahsulotlar, Buyurtmalar, Recharts grafikalari
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── src/                    # NestJS Modullar (Admin, Products, Orders, Payments va h.k.)
│   ├── prisma/                 # PostgreSQL ma'lumotlar bazasi sxemasi va seed
│   ├── package.json
│   └── .env.example
│
├── docs/                       # Hujjatlar: API, xavfsizlik, audit, arxitektura, deployment, promptlar
├── docker-compose.yml          # Lokal PostgreSQL, Redis, MinIO, Mailpit
├── docker-compose.prod.yml     # VM uchun production stack (Caddy bilan)
├── railway.json, render.yaml   # Railway / Render deploy konfiguratsiyasi
├── TASKS.md                    # 📋 Loyihaning to'liq vazifalar yo'l xaritasi (Roadmap)
├── AGENTS.md                   # 🤖 AI agentlari va skillar bo'yicha yo'riqnoma
├── package.json                # Root monorepo boshqaruv skriptlari
└── README.md
```

---

## 🚀 Tezkor ishga tushirish (Quick Start)

### 1. Bog'liqliklarni o'rnatish
Loyiha ildizidan barcha frontend, admin va backend paketlarini o'rnatish:
```bash
npm run install:all
```

---

### 2. Dasturlarni ishga tushirish (Dev Servers)

Loyiha ildizidan turib:

```bash
# 1. Frontend do'konni ishga tushirish (Port: 3000)
npm run dev:frontend

# 2. Backend ichidagi Admin Panelni ishga tushirish (Port: 5173)
npm run dev:admin

# 3. Backend API serverni ishga tushirish (Port: 4000)
npm run dev:backend
```

---

## 🛠 Ildizdagi qulay skriptlar (Root NPM Scripts)

| Buyruq | Port / Manzil | Tavsif |
|---|---|---|
| `npm run dev:frontend` | `http://localhost:3000` | Frontend public do'konni ishga tushirish |
| `npm run dev:admin` | `http://localhost:5173` | React Admin Panelni ishga tushirish |
| `npm run dev:backend` | `http://localhost:4000` | NestJS API serverni ishga tushirish |
| `npm run build:frontend` | — | Next.js frontendni production uchun yig'ish |
| `npm run build:admin` | — | Vite Admin panelni production uchun yig'ish |
| `npm run build:backend` | — | NestJS backendni production uchun yig'ish |
| `npm run build:all` | — | Backend, frontend va admin'ni ketma-ket yig'ish (har o'zgarishdan keyin majburiy) |
| `npm run lint` / `npm run typecheck` | — | Lint (frontend + backend) / backend typecheck |
| `npm run prisma:migrate` | — | Lokal DB'ga migratsiya yaratish/qo'llash |
| `npm run prisma:studio` | `http://localhost:5555` | Prisma Studio vizual DB boshqaruvini ochish |
| `npm run docker:up` | — | PostgreSQL va Redis konteynerlarini ishga tushirish |

---

## 🛡️ Admin Panelda mavjud bo'limlar:
> Hozircha API'ga ulanganlari: Dashboard, Buyurtmalar, Xabarlar. Qolgan bo'limlar UI sifatida tayyor, lekin ma'lumotni saqlamaydi — [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md) (AUD-001).
1. **Dashboard** — Daromad dinamikasi, Recharts grafiklari, buyurtmalar statistikasi
2. **Mahsulotlar** — Katalog, yog'lilik, ombor miqdori va yangi mahsulot qo'shish
3. **Kategoriyalar** — Sut mahsulotlari toifalari
4. **Buyurtmalar** — Onlayn buyurtmalar va to'lov holatini boshqarish (Click/Payme)
5. **Mijozlar** — Xaridorlar bazasi
6. **Ishlab chiqarish** — Sut qabuli, pasterizatsiya va sifat nazorati partiyalari
7. **Biz haqimizda & Sertifikatlar** — Kompaniya ma'lumotlari, ISO va Halol standartlari
8. **Blog, Xabarlar & Media** — Maqolalar, qayta aloqa xabarlari va rasm galereyasi
9. **Tarjimalar (UZ, RU, EN) & SEO** — Ko'p tillilik va qidiruv tizimlari sozlamalari
10. **To'lovlar, Foydalanuvchilar & Audit Logs** — Xavfsizlik va tranzaksiyalar monitoringi



---

## 🌐 Serverga yuklash (Railway & Cloud Deployment)
- **Railway 1-Click / GitHub Deploy**: [railway.com/new/github](https://railway.com/new/github)
  - Batafsil bosqichma-bosqich yo'riqnoma: [docs/deployment/RAILWAY.md](docs/deployment/RAILWAY.md)
- **Bepul variant (Vercel + Render + Neon)**: [docs/deployment/FREE.md](docs/deployment/FREE.md)
- **Oracle Cloud VM (Docker + Caddy)**: [docs/deployment/ORACLE.md](docs/deployment/ORACLE.md)
  - Barcha Dockerfile va `railway.json` konfiguratsiyalari to'liq sozlangan (Postgres, Redis, NestJS, Next.js).
- **Vercel Frontend Deploy**: [vercel.com](https://vercel.com/) orqali `Sabo-web` omborini tanlab `frontend` ildizidan deploy qilish mumkin (`frontend/vercel.json`).
- **GitHub Repository**: `https://github.com/omonqulovjasurbek04-hue/Sabo-web.git`

---

## 📚 Hujjatlar
| Fayl | Mazmuni |
|---|---|
| [AGENTS.md](AGENTS.md) | AI agentlar uchun qoidalar |
| [TASKS.md](TASKS.md) | Vazifalar va holati |
| [docs/API.md](docs/API.md) | Amaldagi API endpointlar va rollar |
| [docs/SECURITY.md](docs/SECURITY.md) | Xavfsizlik modeli |
| [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md) | Ma'lum muammolar (AUD-xxx) |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment variantlari |
| [docs/architecture/](docs/architecture/README.md) | Blueprint va frontend yo'riqnomasi |
| [docs/prompts/](docs/prompts/README.md) | AI coding promptlari |
