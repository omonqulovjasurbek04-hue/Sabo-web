# SABO Dairy Platform — Fullstack Monorepo

SABO tabiiy sut va sut mahsulotlari platformasi. Loyiha **Frontend** (Next.js 15) va **Backend** (NestJS + Prisma) qismlariga ajratilgan monorepo ko'rinishida tuzilgan.

---

## 📁 Loyiha tuzilmasi (Project Structure)

```
Sabo-web/
├── frontend/                   # Next.js 15 Frontend
│   ├── src/                    # UI Komponentlar, sahifalar va xizmatlar
│   │   ├── app/                # App Router (uz, ru, en ko'p tillilik)
│   │   ├── components/         # 3D, Cart, Layout, UI elementlar
│   │   ├── lib/                # API client, yordamchi utilslar
│   │   └── locales/            # Til lug'atlari
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── .env.example
│
├── backend/                    # NestJS 10 Backend API
│   ├── src/                    # Modullar (Auth, Products, Orders, Payments va h.k.)
│   ├── prisma/                 # PostgreSQL ma'lumotlar bazasi sxemasi va seed
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .github/workflows/          # CI/CD avtomatlashtirish
├── docker-compose.yml          # Mahalliy infratuzilma (Postgres, Redis, MinIO, Mailpit)
├── package.json                # Root boshqaruv skriptlari
└── README.md
```

---

## 🚀 Tezkor ishga tushirish (Quick Start)

### 1. Bog'liqliklarni o'rnatish
Loyiha ildizidan barcha frontend va backend paketlarini o'rnatish:
```bash
npm run install:all
```

yoki alohida:
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Infratuzilmani ishga tushirish (Docker)
PostgreSQL va Redis ni Docker orqali ko'tarish:
```bash
npm run docker:up
```

---

### 3. Backendni sozlash va ishga tushirish

1. Muhit parametrlarini nusxalash:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Prisma ma'lumotlar bazasi sxemasini generatsiya qilish va migratsiyalarni yurgizish:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run prisma:seed # (boshlang'ich mahsulotlar va toifalarni yuklash)
   ```
3. Backend serverini ishga tushirish:
   ```bash
   npm run start:dev
   ```
   Backend API: `http://localhost:4000/api/v1`  
   Swagger API Hujjatlari: `http://localhost:4000/docs`

---

### 4. Frontendni sozlash va ishga tushirish

1. Muhit parametrlarini nusxalash:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
2. Frontend ishlab chiqish serverini ishga tushirish:
   ```bash
   npm run dev
   ```
   Frontend Web sahifa: `http://localhost:3000`

---

## 🛠 Ildizdagi qulay skriptlar (Root NPM Scripts)

Loyiha ildizidan turib quyidagi buyruqlarni ishlatishingiz mumkin:

| Buyruq | Tavsif |
|---|---|
| `npm run dev:frontend` | Faqat frontendni ishga tushirish (port 3000) |
| `npm run dev:backend` | Faqat backendni ishga tushirish (port 4000) |
| `npm run build:frontend` | Frontendni production uchun yig'ish |
| `npm run build:backend` | Backendni production uchun yig'ish |
| `npm run prisma:generate` | Prisma clientini generatsiya qilish |
| `npm run prisma:migrate` | Yangi DB migratsiyalarini yurgizish |
| `npm run prisma:studio` | Prisma Studio vizual DB boshqaruvini ochish |
| `npm run docker:up` | PostgreSQL va Redis konteynerlarini ishga tushirish |
| `npm run docker:down` | Docker konteynerlarini to'xtatish |

---

## 🔐 Asosiy imkoniyatlar
- **Foydalanuvchi interfeysi**: Next.js 15, Three.js 3D sut tomchisi va mahsulot namoyishi, Tailwind CSS, Responsive dizayn.
- **Ko'p tillilik**: O'zbek, Rus va Ingliz tillari to'liq qo'llab-quvvatlanadi.
- **Xavfsiz Autentifikatsiya**: JWT Access va Refresh tokenlar, Argon2 parollarni shifrlash.
- **E-tijorat tizimi**: Mahsulotlar katalogi, Savat, Buyurtmalarni rasmiylashtirish va hisoblash.
- **To'lov tizimlari**: Click va Payme integratsiyalari tayyorlangan.
- **Kesh va Cheklovlar**: Redis orqali Rate-Limiting va keshlash.
