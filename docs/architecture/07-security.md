# 07 — Xavfsizlik, privacy va ishonchlilik

## Authentication
- Password hash: zamonaviy, sozlangan Argon2id yoki bcrypt; plain text hech qachon saqlanmaydi.
- Access token qisqa umrli; refresh token rotation/revocation siyosati bo‘ladi.
- Token storage xavfi baholanadi; browser'da `localStorage`da uzoq umrli token saqlashdan qochish.
- Cookie ishlatilsa `HttpOnly`, `Secure`, `SameSite` va CSRF strategiyasi to‘g‘ri bo‘lsin.
- Login/reset endpoint rate-limit; foydalanuvchi mavjudligini oshkor qiluvchi xabarlar cheklansin.
- Admin uchun MFA qo‘llash imkoniyatini rejalashtirish.

## API
- DTO validation (whitelist, transform, forbid unknown fields).
- RBAC + resource-level authorization.
- CORS faqat kerakli origin'lar; `*` bilan credentials ishlatmaslik.
- Security headers, TLS, request body size limit.
- Rate limiting: login, OTP/SMS, contact, checkout, payment callback.
- SQL injection/unsafe raw query, XSS, SSRF, path traversal, mass assignment tekshiruvi.
- File upload: allowlist, MIME va signature, size, storage isolation; executable upload yo‘q.
- Secret manager/environment; secret rotation va `.gitignore`.
- Production'da stack trace/secretni client'ga bermaslik.

## Checkout & payment
- Server narxni DB'dan oladi va qayta hisoblaydi.
- Idempotency va DB transaction.
- Provider signature/auth, provider transaction ID, summa/valyuta, order ownership tekshiruvi.
- Callback takrorlanishi va parallel kelishi sinovdan o‘tkaziladi.
- Timeout/retry'da ikki marta charge yoki ikki order bo‘lmasin.
- Test va production credentials ajratilgan.
- Karta ma’lumotini o‘zingiz saqlamang; providerning hosted checkout/tokenizatsiya oqimidan foydalaning.

## Privacy
- Faqat biznes uchun zarur PII yig‘ish.
- Retention va o‘chirish siyosati, foydalanuvchi so‘rovlarini ko‘rib chiqish jarayoni.
- Analytics/cookies uchun zarur consent va huquqiy tekshiruv.
- Loglarda telefon, manzil, token, parol, payment secret to‘liq yozilmasin.
- Backup ham maxfiy ma’lumot hisoblanadi: encryption, access control, retention.

## Operatsion himoya
- DB private network'da; public access kerak bo‘lmasa yopiq.
- Least privilege DB user.
- Migration backup/restore rehearsal bilan.
- Dependency audit va yangilash jarayoni.
- Sentry'da PII scrubbing.
- Incident response: secretni bekor qilish, ta’sir doirasini aniqlash, tiklash va hujjatlashtirish.
