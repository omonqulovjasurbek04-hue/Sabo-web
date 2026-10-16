# PROMPT 04 — Cart, checkout va order lifecycle

Mavjud cart/order/payment modelini o‘qib, xavfsiz checkout implementatsiyasini rejalashtir.
- Server product/variant/price/stock/delivery fee/discountni qayta hisoblasin.
- Duplicate submit va retry uchun idempotency.
- Stock reservation/adjustment parallel requestlarda atomar bo‘lsin.
- Buyurtma item'larida checkout paytidagi name/SKU/price snapshot.
- Validated order state machine va status history.
- Contact/address validation, PII minimization.
- Delivery zone/slot faqat konfiguratsiyada mavjud bo‘lsa.
- Error recovery va notification failure order yaratishni bekor qilmasin.
Parallel checkout, out-of-stock, price tampering, duplicate submit va order ownership testlarini yoz. Avval plan + fayl ro‘yxati, so‘ng minimal diff.
