# PROMPT 07 — Telegram bot va SMS

Order lifecycle event'lariga notification adapter yaratishni rejalashtir.
- Telegram bot tokeni secret manager'da; chat ID allowlist/consent biznes talabiga mos.
- SMS provider sifatida Eskiz yoki PlayMobile faqat tanlangan provayderning rasmiy API hujjatiga ko‘ra.
- Event: order received, payment confirmed/failed, processing, delivery, cancellation.
- `uz/ru/en` template; PII minimal.
- Queue/retry/backoff, provider timeout, deduplication, delivery status.
- Notification failure order transaction'ni rollback qilmasin; dead-letter/retry monitoring bo‘lsin.
- SMS xarajat va rate limit nazorati.
Mock provider bilan test yoz; real token/OTP'ni promptga kiritma.
