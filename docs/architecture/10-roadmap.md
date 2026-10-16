# 10 — Bosqichma-bosqich yo‘l xaritasi

## Phase 0 — Tayyorgarlik
- [ ] Repository backup/branch va `git status`.
- [ ] Arxitektura, dependency va fayl xaritasi.
- [ ] `.env.example` va secret hygiene.
- [ ] `docs/AUDIT_REPORT.md`.
**Qabul sharti:** loyiha holati va eng xavfli muammolar hujjatlashtirilgan.

## Phase 1 — Ishga tushirish barqarorligi
- [ ] Install reproduksiya qilinadi.
- [ ] Lint/typecheck/test/build.
- [ ] Runtime va console xatolari.
- [ ] Health endpoint, config validation.
**Qabul sharti:** local va CI'da qayta takrorlanadigan build.

## Phase 2 — UI, theme va i18n
- [ ] Light/Dark/System.
- [ ] Responsive header/footer, mobile menu.
- [ ] `uz`, `ru`, `en` route va translation completeness.
- [ ] Loading/error/empty state.
- [ ] Accessibility/contrast.
**Qabul sharti:** asosiy public route'lar 3 tilda va ikki theme'da ishlaydi.

## Phase 3 — Catalog/CMS
- [ ] Product/category CRUD.
- [ ] Variant, price, inventory.
- [ ] Media upload.
- [ ] Product translations/SEO.
- [ ] Blog/pages/certificates/gallery.
**Qabul sharti:** admin'da saqlangan ma’lumot public saytga to‘g‘ri chiqadi.

## Phase 4 — Cart/checkout/orders
- [ ] Cart reconciliation.
- [ ] Server-side price calculation.
- [ ] Delivery rules.
- [ ] Order creation idempotency.
- [ ] Status state machine.
- [ ] Customer order tracking.
**Qabul sharti:** test mahsulotdan buyurtma yaratish, boshqarish va kuzatish mumkin.

## Phase 5 — Payments
- [ ] Click sandbox, prepare/complete.
- [ ] Payme sandbox JSON-RPC/provider flow.
- [ ] Signature/auth, amount, currency, idempotency.
- [ ] Failure, timeout, duplicate callback testlari.
- [ ] Naqd to‘lov va payment reconciliation.
**Qabul sharti:** provider hujjatiga mos barcha asosiy sandbox case'lar o‘tadi.

## Phase 6 — Admin va analitika
- [ ] RBAC.
- [ ] Dashboard metrics.
- [ ] Inventory movements.
- [ ] Customer/order views.
- [ ] Audit log va export permissions.
**Qabul sharti:** rolga tegishli amallar ruxsat etiladi, boshqasi serverda rad etiladi.

## Phase 7 — Notifications
- [ ] Telegram bot xabar shablonlari.
- [ ] SMS provider adapter.
- [ ] Retry/backoff va rate limit.
- [ ] Notification logs.
**Qabul sharti:** provider xatosi buyurtmani buzmaydi; qayta urinish kuzatiladi.

## Phase 8 — SEO/content/performance
- [ ] Real tasdiqlangan kontent.
- [ ] Metadata, sitemap, robots, canonical, hreflang.
- [ ] Structured data (faqat mos va real ma’lumot bilan).
- [ ] Image optimization, 3D fallback.
- [ ] Lighthouse/Core Web Vitals tekshiruvi.
**Qabul sharti:** sahifalar indekslashga tayyor, kontent dalilli.

## Phase 9 — Production
- [ ] Staging acceptance test.
- [ ] Domain/TLS.
- [ ] Production secrets.
- [ ] Backup/restore.
- [ ] Monitoring/alerts.
- [ ] Production payment activation.
- [ ] Rollback va incident runbook.
**Qabul sharti:** release checklist egasi tomonidan tasdiqlangan.

## Tavsiya etilgan ustuvorlik
P0: security, data integrity, payment correctness.
P1: build stability, checkout, catalog, admin auth.
P2: CMS, translations, notifications, SEO.
P3: 3D enhancements, advanced analytics, promotions, personalization.
