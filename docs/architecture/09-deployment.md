# 09 — Deployment, domen, backup va monitoring

## Muhitlar
- Local: ishlab chiqish; test credentials.
- CI: lint, typecheck, test, build, dependency checks.
- Staging: production'ga yaqin, test data va sandbox payment.
- Production: real domen, TLS, production secret, real payment credentials.

## Deployment checklist
1. DNS domenni hosting'ga yo‘naltirish.
2. TLS sertifikat va HTTPS redirect.
3. Environment variables'ni hosting secret manager'da saqlash.
4. PostgreSQL private network, backup va connection pool.
5. Redis authentication/private networking va persistence ehtiyoji.
6. Migration'ni release jarayonida nazorat bilan bajarish; production'da `db push`ni avtomatik va ko‘r-ko‘rona ishlatmaslik.
7. Health endpoints: liveness va readiness.
8. API va frontend loglarida request ID.
9. Sentry yoki muqobil error monitoring; PII scrubbing.
10. Uptime monitoring va alert.
11. Backup schedule, retention, restore drill.
12. Rollback/redeploy ko‘rsatmasi.
13. SEO: sitemap, robots, canonical, locale alternate/hreflang, redirects.
14. Cache headers, image optimization va CDN ehtiyoji.
15. Click/Payme production credentials provider bilan tasdiqlangan testdan keyin.

## Docker
- Har app uchun multi-stage build, non-root user.
- Secrets image layer yoki build arg'ga qo‘yilmaydi.
- Health check va restart policy.
- DB/Redis production'da managed service bo‘lishi mumkin; lokal Compose production arxitekturasini avtomatik belgilamaydi.
- Log rotation va disk hajmini kuzatish.

## Monitoring metrikalari
- API latency p50/p95/p99, error rate.
- DB connections, slow queries, storage.
- Redis health/latency.
- Checkout conversion, payment success/failure.
- Notification queue retries.
- Disk, memory, CPU va uptime.
- Backup oxirgi muvaffaqiyatli va restore sinovi sanasi.

## Rollback
- Oldingi ishlaydigan image/build.
- Migration backward compatibility ko‘rib chiqiladi.
- DB rollback har doim xavfsiz deb hisoblanmaydi; backup/forward-fix strategiyasi oldindan yoziladi.
- Release paytida buyurtma/to‘lov yozuvlarini yo‘qotadigan rollback qilinmaydi.
