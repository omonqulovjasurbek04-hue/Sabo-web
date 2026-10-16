# SABO — Xavfsizlik modeli

> Talablar: [architecture/07-security.md](architecture/07-security.md). Ochiq muammolar: [AUDIT_REPORT.md](AUDIT_REPORT.md).
> Bu fayl hozir kodda **amalda** nima borligini qayd etadi.

## Amaldagi himoyalar
| Soha | Holat | Joy |
|---|---|---|
| Parol hash | ✅ argon2 | `backend/src/auth/auth.service.ts`, `users/users.service.ts` |
| JWT | ✅ access 15m / refresh 7d, refresh rotation; production'da `dev_secret_*` kalitlari rad etiladi | `config/configuration.ts`, `config/validation.ts` |
| RBAC | ✅ `JwtAuthGuard` + `RolesGuard` + `@Roles()`; public endpointlar `@Public()` bilan aniq belgilanadi | `common/guards/*`, controller'lar |
| Input validation | ✅ global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`) | `main.ts` |
| HTTP headerlar | ✅ `helmet` | `main.ts` |
| CORS | ✅ allowlist, `credentials: true` | `main.ts`, `CORS_ORIGINS` |
| Request ID | ✅ `X-Request-ID` | `common/middleware/request-id.middleware.ts` |
| Login brute-force | ✅ Redis hisoblagich (IP + identifier) | `auth/auth.service.ts` |
| Contact spam | ✅ Redis rate limit + honeypot | `contact/contact.service.ts` |
| Global rate limit | ✅ 120/daq/IP; register, refresh, `POST /orders` qattiqroq; webhook va health ozod | `common/throttle/throttle.config.ts` |
| Mijoz IP (proxy ortida) | ✅ `TRUST_PROXY` (production'da 1 hop) | `main.ts` |
| Fayl yuklash | ✅ tur fayl mazmunidan aniqlanadi, kengaytma/Content-Type shundan; tur bo'yicha o'lcham limiti | `media/file-signature.ts`, `media/media.service.ts` |
| Buyurtma narxi | ✅ serverda qayta hisoblanadi | `orders/services/order-pricing.service.ts` |
| Click callback | 🟡 imzo (timing-safe), summa, idempotentlik — qayta yozilmoqda | `payments/providers/click-payment.provider.ts` |
| Payme callback | 🟡 Basic auth, JSON-RPC holatlari — qayta yozilmoqda | `payments/providers/payme-payment.provider.ts` |
| Swagger | ✅ production'da o'chiq (`ENABLE_SWAGGER=true` bo'lmasa) | `main.ts` |

## Ma'lum bo'shliqlar
- Admin token `localStorage`da (AUD-004).
- Rate limit bucket'lari xotirada — API bir nechta instance'da ishlasa Redis storage kerak.
- Buyurtma holati o'tishlari va admin amallari audit log'ga yozilmaydi (AUD-010).
- MFA yo'q; Sentry/PII scrubbing ulanmagan (T-074).

## Secretlar
- Haqiqiy `.env`, `.env.production` hech qachon commit qilinmaydi. Namunalar: `backend/.env.example`, `frontend/.env.example`, `.env.production.example` — faqat nom va placeholder.
- Birinchi `SUPER_ADMIN`: `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD`; birinchi kirishdan keyin parolni almashtiring.
- Click/Payme production kalitlari sandbox testlari o'tgandan keyin hosting secret manager'iga qo'yiladi (T-044).

## Zaiflik haqida xabar berish
Muammo topilsa, ommaviy issue ochmang — loyiha egasiga to'g'ridan-to'g'ri yozing. Secret oshkor bo'lsa: darhol bekor qiling (rotate), ta'sir doirasini aniqlang, `AUDIT_REPORT.md`ga yozing.
