# PROMPT 01 — Repository audit

Repository'ni o‘zgartirmasdan audit qil:
1. Root va har app'ning papka daraxti, package/lockfile.
2. `TASKS.md`, README, Prisma schema/migrations, Docker/CI.
3. Install, lint, typecheck, tests, build (faqat xavfsiz local muhitda).
4. Public routes, admin routes, API modules, auth/RBAC, payments, media, i18n/theme.
5. Xavfsizlik va data integrity xavflari.
`docs/AUDIT_REPORT.md` uchun topilmalarni Critical/High/Medium/Low bo‘yicha, fayl va qator, ta’sir, fix, test bilan yoz. Secret qiymatlarini hech qachon chiqarmagin. Foydalanuvchi o‘zgarishlarini saqla. Destructive command ishlatma. Audit tugagach, P0/P1/P2 rejasini ber; ruxsatsiz kod o‘zgartirma.
