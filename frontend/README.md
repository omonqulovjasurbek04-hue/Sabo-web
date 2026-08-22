# SABO Web — Frontend (Next.js 15)

SABO tabiiy sut va sut mahsulotlari platformasining foydalanuvchi interfeysi (Frontend).

## Texnologiyalar
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: Tailwind CSS, CSS Animations
- **3D Graphics**: Three.js / React Three Fiber
- **Icons**: Lucide React
- **Ko'p tillilik (i18n)**: Uzbek (`uz`), Russian (`ru`), English (`en`)
- **Holat boshqaruvi**: React Context (Cart, Theme)

## Ishga tushirish (Local Run)

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Muhit o'zgaruvchilarini sozlash
`.env.example` dan `.env.local` nusxa oling:
```bash
cp .env.example .env.local
```

`.env.local` faylida backend API manzilini ko'rsating:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### 3. Serverni ishga tushirish
```bash
npm run dev
```

Brauzerda: [http://localhost:3000](http://localhost:3000)

## Skriptlar
- `npm run dev` — Mahalliy ishlab chiqish serverini ishga tushiradi (port 3000)
- `npm run build` — Production uchun yig'ish (build)
- `npm run start` — Production serverini ishga tushirish
- `npm run lint` — ESLint orqali kod sifatini tekshirish
