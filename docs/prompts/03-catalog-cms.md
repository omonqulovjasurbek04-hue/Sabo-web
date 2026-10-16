# PROMPT 03 — Catalog va CMS

Product/category/media/blog/page/certificate CMS'ni mavjud schema bilan moslashtir.
- Admin CRUD va backend authorization.
- Product translations `uz/ru/en`, slug uniqueness locale strategiyasi, metadata.
- Variant SKU, currency/price, stock; price client'dan ishonilmasin.
- Ingredients, allergens, nutrition, storage: faqat tasdiqlangan qiymatlar.
- Upload MIME+magic bytes, size allowlist, safe storage.
- Archive/soft-delete; order snapshot'larini buzma.
- CMS publish/draft workflow, author/date, preview.
- Sertifikatni verified bo‘lmaguncha public'da “sertifikatlangan” deb ko‘rsatma.
API integration/unit tests va admin e2e yoz. Keraksiz yangi Prisma model yaratishdan oldin mavjudini tekshir.
