# 03 — Public sayt sahifalari va funksiyalar

## Public route xaritasi
Har bir sahifa `/uz/...`, `/ru/...`, `/en/...` lokaliga mos bo‘lishi kerak; tarjima strategiyasiga qarab root redirect qilinadi.

| Route | Sahifa | Asosiy elementlar |
|---|---|---|
| `/` | Bosh sahifa | Hero, kategoriya, bestseller, brend ishonchi, ishlab chiqarish, galereya, CTA |
| `/products` | Katalog | Qidiruv, filter, sort, pagination |
| `/products/[slug]` | Mahsulot | Galereya, narx, variant, tarkib, allergen, ozuqaviy qiymat, saqlash, stock, related products |
| `/categories/[slug]` | Kategoriya | Kategoriya tavsifi, tegishli mahsulotlar |
| `/search` | Qidiruv natijasi | Lokal til bo‘yicha qidiruv, empty/error state |
| `/cart` | Savat | Miqdor, narx, stock, promo code agar mavjud bo‘lsa |
| `/checkout` | Buyurtma | Kontakt, manzil, yetkazish vaqti, payment method, order summary |
| `/checkout/success` | Buyurtma qabul qilindi | Order number, holat, keyingi qadamlar; shaxsiy ma’lumotni URL'ga qo‘ymaslik |
| `/orders/track` | Buyurtmani kuzatish | Xavfsiz token yoki autentifikatsiya bilan holat |
| `/about` | Biz haqimizda | Tarix, missiya, jamoa, ishlab chiqarish quvvati faqat tasdiqlangan faktlar |
| `/production` | Ishlab chiqarish | Sut qabul qilish, pasterizatsiya, qadoqlash, sifat nazorati |
| `/quality` | Sifat nazorati | Jarayon va laboratoriya siyosati |
| `/certificates` | Sertifikatlar | Haqiqiy hujjat, beruvchi tashkilot, raqam, amal qilish muddati |
| `/gallery` | Galereya | Rasm/video, alt text, lazy load |
| `/blog` | Blog | Kategoriya, teg, pagination |
| `/blog/[slug]` | Maqola | Muallif, sana, cover, SEO, related posts |
| `/contact` | Aloqa | Telefon, email, xarita, ish vaqti, kontakt forma |
| `/delivery` | Yetkazib berish | Hududlar, narx, vaqt, minimal buyurtma — real qoidalar |
| `/faq` | Savol-javob | Yetkazish, saqlash, buyurtma, to‘lov |
| `/privacy` | Maxfiylik siyosati | Ma’lumot yig‘ish va ishlatish |
| `/terms` | Foydalanish shartlari | Buyurtma, qaytarish, nizolar |
| `/returns` | Qaytarish/qayta aloqa | Mahalliy qonun va mahsulot xususiyatiga mos tasdiqlangan siyosat |
| `/404` | Topilmadi | Qidiruv/katalogga qaytish |

## Bosh sahifa bo‘limlari
1. Header: logo, navigatsiya, til, theme, qidiruv, savat.
2. Hero: sifatli real mahsulot rasmi/video; H1; 1–2 CTA.
3. Kategoriyalar.
4. Bestseller/featured products.
5. Brendning tasdiqlangan afzalliklari.
6. Ishlab chiqarish jarayoniga kirish.
7. Galereya yoki fermer xo‘jaligi hikoyasi.
8. Sifat va sertifikatlar — faqat haqiqiy dalil bilan.
9. Blogdan so‘nggi maqolalar.
10. CTA.
11. Footer: aloqa, navigatsiya, ijtimoiy tarmoqlar, huquqiy sahifalar.

## E-commerce talablar
- Mahsulot holatlari: draft, active, archived.
- Stock holati: in stock, low stock, out of stock; real inventar qoidalari bilan.
- Variantlar: hajm/og‘irlik/qadoq turi; har variantning SKU, narx va stock'i.
- Savat serverda yoki guest cart + server reconciliation modeli bilan.
- Checkout'da server barcha narx va chegirmalarni qayta hisoblaydi.
- Buyurtma yuborishda idempotency/duplicate-submit himoyasi.
- Yetkazish hududi, to‘lovi va mavjud vaqt slotlari serverdan keladi.
- To‘lov statusi mijozning success URL'iga qarab emas, provider tasdig‘iga qarab belgilanadi.
- Order tracking faqat taxmin qilish qiyin token yoki autentifikatsiya bilan.

## Har bir sahifada bo‘lishi shart
- Loading skeleton yoki progress.
- Empty state.
- Xatolik va qayta urinish.
- Mobil ko‘rinish.
- Keyboard navigation va focus state.
- Tegishli metadata, title/description, canonical.
- Tarjima to‘liqligi va kerakli alt text.
