# 01 — Audit va inventarizatsiya

## Maqsad
Mavjud kodni tushunish, haqiqiy holatni o‘lchash va xavflarni tartiblash. Birinchi qadam — yangi kod yozish emas.

## Tekshiriladigan fayllar
- Root: `README.md`, `TASKS.md`, `package.json`, lockfile, `.gitignore`, `.env.example`, `docker-compose.yml`.
- `frontend/`: `package.json`, `src/app` yoki `app/`, API client, theme, i18n, metadata.
- `backend/`: `package.json`, `prisma/schema.prisma`, `src/main.ts`, `app.module.ts`, auth/guards, payment modules.
- `backend/admin/`: `package.json`, route/layout, auth state, API client, dashboard, CRUD.
- CI workflow, Dockerfiles, migration history, seed script, tests, Sentry config.

## Audit bosqichlari
1. `git status`, branch va so‘nggi commitlarni ko‘rish; foydalanuvchi o‘zgarishlarini saqlash.
2. Papka daraxtini chiqarish; `.env`, `node_modules`, build va secret fayllarni hisobotga qo‘shmaslik.
3. Har bir app uchun `package.json` va lockfile mosligini tekshirish.
4. Install, lint, typecheck, unit test, e2e test va production build'ni alohida ishga tushirish.
5. API endpoint, auth, role, validation, error handling va rate limiting'ni tekshirish.
6. Prisma model, migration, index, unique constraint, relation, soft delete va audit trail'ni tekshirish.
7. To‘lov sandbox oqimini tekshirish; production secretlarini ishlatmaslik.
8. UI: responsive, Light/Dark, i18n, accessibility, SEO, broken image, console error.
9. Deployment: health check, DB migration, Redis, backups, logs, monitoring.
10. Natijani `docs/AUDIT_REPORT.md` ga yozish.

## Audit hisobot formati
Har bir topilma:
- ID: `AUD-001`
- Severity: Critical / High / Medium / Low
- Joy: fayl va qator
- Muammo va ta’siri
- Takrorlash qadamlari
- Tavsiya etilgan yechim
- Test/tekshiruv
- Holat: Open / In progress / Fixed / Verified

## Birinchi 24 soatdagi ustuvorlik
1. Secret yoki autentifikatsiya muammolari.
2. Buyurtma summasi va payment callback xavflari.
3. DB migration/data loss xavfi.
4. Build va runtime xatolari.
5. Asosiy checkout oqimi.
6. Theme, responsive va kontentdagi kamchiliklar.

## Taqiqlar
- `rm -rf`, `git reset --hard`, force-push, production DB reset yoki destructive migration'ni roziliksiz ishlatmaslik.
- `package.json` va lockfile'ni sababsiz qayta yaratmaslik.
- Mavjud funksiyani o‘chirib tashlab, testni “yashil” qilish mumkin emas.
- `.env` mazmunini terminal logi, prompt, screenshot yoki Git'ga chiqarish mumkin emas.
