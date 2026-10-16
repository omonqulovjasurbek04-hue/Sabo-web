# PROMPT 05 — Click va Payme

To‘lov modulini faqat providerning amaldagi rasmiy hujjatlari asosida implementatsiya/tekshir.
- Sandbox va production credentials alohida.
- Provider talab qilgan auth/signature/JSON-RPC semantics aniq.
- Amount, currency, order/payment state va provider transaction ID tekshir.
- Callback idempotent, replay/duplicate-safe va parallel request-safe.
- DB transaction; provider callback order statusni yagona ishonchli tarzda yangilaydi.
- Browser success redirect payment proof emas.
- Timeout, malformed payload, invalid signature, wrong amount, duplicate callback, already paid/cancelled order, provider retry testlari.
- Karta ma’lumotini saqlama; secrets loglama.
Provider docs mavjud bo‘lmasa, taxminiy implementatsiya qilma: kerakli rasmiy hujjatni so‘ra va sandbox plan tuz. Production kalitlarini chatga so‘rama.
