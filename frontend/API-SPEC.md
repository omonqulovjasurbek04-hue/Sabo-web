# API-SPEC.md — SABO (kelajakdagi backend uchun)

Hozircha frontend `src/data/` dan o'qiydi. Backend ulanganda ushbu spec bo'yicha
API yoziladi va `src/lib/api.ts` qatlami ma'lumot manbasini almashtiradi.
Barcha endpointlar `/api/v1` prefix ostida.

## Auth

| Method | Endpoint          | Izoh                          |
| ------ | ----------------- | ----------------------------- |
| POST   | /api/v1/auth/register | Ro'yxatdan o'tish           |
| POST   | /api/v1/auth/login    | Kirish (JWT)                |
| POST   | /api/v1/auth/refresh  | Token yangilash             |
| POST   | /api/v1/auth/logout   | Chiqish                     |

## Products

| Method | Endpoint                | Izoh                        |
| ------ | ----------------------- | --------------------------- |
| GET    | /api/v1/products        | Ro'yxat (search, category, pagination) |
| GET    | /api/v1/products/:slug  | Detal (nutrition, storage, ingredients, price, availability) |
| GET    | /api/v1/categories      | Kategoriyalar              |

So'rov misoli: `GET /api/v1/products?category=kefir&q=sabo&page=1&limit=12`

Javob formati (bitta mahsulot):
```json
{
  "id": "sabo-kefir",
  "slug": "sabo-kefir-1l",
  "name": { "uz": "...", "ru": "...", "en": "..." },
  "description": { "uz": "...", "ru": "...", "en": "..." },
  "category": "kefir",
  "images": ["/images/products/kefir-1l.jpg"],
  "volumes": ["1 L"],
  "fat": "3.2%",
  "price": null,
  "availability": null,
  "nutrition": null,
  "storage": null,
  "ingredients": null
}
```
Qoida: `price`, `nutrition`, `ingredients`, `storage`, `availability` — faqat
tasdiqlangan ma'lumot bo'lsa jo'natiladi, aks holda `null` (frontend yashiradi).

## Contact (kelajakda)

| Method | Endpoint               | Izoh                     |
| ------ | ---------------------- | ------------------------ |
| POST   | /api/v1/contact        | Xabar yuborish (validatsiya serverda) |

## Orders (e-commerce bosqichida)

| Method | Endpoint                  | Izoh                    |
| ------ | ------------------------- | ----------------------- |
| GET    | /api/v1/orders            | Foydalanuvchi buyurtmalari |
| POST   | /api/v1/orders            | Buyurtma yaratish       |
| GET    | /api/v1/orders/:id        | Buyurtma detali         |
| POST   | /api/v1/payments/click    | Click create/prepare/complete |
| POST   | /api/v1/payments/payme    | Payme yaratish          |

To'lov holatlari: `created → paid → delivered → cancelled`.
Payment callback'larida SIGNATURE tekshiriladi, frontendga "fake success" yuborilmaydi.

## Xavfsizlik

- Barcha kirishlar serverda validatsiya (frontend validatsiyasiga ishonilmaydi)
- Kalitlar faqat `.env` da; frontend hech qachon maxfiy narsa olmaydi
- Umumiy xato formati: `{ "error": { "code": "...", "message": "..." } }`
