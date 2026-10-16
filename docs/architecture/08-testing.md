# 08 — Test strategiyasi va sifat nazorati

## Test piramidasi
1. Unit: price calculator, order state transitions, permissions, locale fallback.
2. Integration: Prisma repository, inventory reservation, payment callback idempotency.
3. API/e2e: login, product list, checkout, order lifecycle, admin RBAC.
4. Browser e2e: Playwright'da uz/ru/en, light/dark, mobile/desktop, purchase flow.
5. Security: unauthorized access, IDOR, input validation, rate limits, upload.
6. Visual smoke: screenshot diff faqat barqaror test ma’lumotlari bilan.

## Muhim test holatlari
- Mahsulot yo‘q yoki archived.
- Stock 0; ikki parallel buyurtma oxirgi mahsulotni olmoqchi.
- Browser narxi o‘zgartirib yuborilgan.
- Double-click checkout.
- Payment callback takror keladi yoki noto‘g‘ri signature/summa bilan keladi.
- User boshqa foydalanuvchi orderini ID almashtirib ko‘radi.
- Content tarjimasi yo‘q — fallback va SEO xulqi.
- Theme refresh va server-side render'da noto‘g‘ri flash.
- Mobil navigatsiya, focus, keyboard, reduced motion.
- 404, API timeout, 500, empty list.
- SMS/Telegram provider ishlamaydi: buyurtma saqlanishi va notification retry.
- DB backup'dan restore.

## Release gate
- Lint pass.
- Typecheck pass.
- Unit/integration/e2e kerakli to‘plami pass.
- Production build pass.
- High/Critical security issue yo‘q.
- Migration review va backup tasdiqlangan.
- Payment sandbox acceptance test pass.
- Staging smoke test pass.
- Rollback rejasi mavjud.
