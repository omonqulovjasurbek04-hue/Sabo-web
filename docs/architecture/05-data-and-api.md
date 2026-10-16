# 05 — Database, domain modeli va API

## Model guruhlari
Mavjud 48 ta Prisma modelni (`backend/prisma/schema.prisma`) auditdan keyin quyidagi domain guruhlari bilan solishtiring. Keraksiz dublikat model yaratmang.

### Identity & access
- `User`: id, name, email/phone, passwordHash yoki tashqi auth identifikatori, status, timestamps.
- `Role`, `Permission`, `UserRole`, `RolePermission`: RBAC; loyiha mavjud enum/relations'iga moslash.
- `RefreshToken`/session: token hash, expiry, revokedAt, device metadata xavfsiz minimum.
- `AuditLog`: actor, action, entity type/id, timestamp, request ID; secret yoki ortiqcha PII saqlamaslik.

### Catalog
- `Category`, `CategoryTranslation`
- `Product`, `ProductTranslation`
- `ProductVariant`: SKU, size/weight, unit, price, currency, status.
- `ProductImage`/`MediaAsset`
- `ProductIngredient`, allergen ma’lumoti, nutrition facts, storage instructions
- `ProductSEO`: slug, meta title/description, canonical/structured metadata ehtiyojiga qarab.
- 3D model URL/asset: format, file size, poster, accessibility fallback.
- `Price`/promotion: faqat murakkab pricing bo‘lsa; tarix va amal qilish vaqti aniqlansin.

### Inventory
- `InventoryLocation` (agar bir nechta ombor bo‘lsa)
- `InventoryStock`
- `InventoryMovement`: purchase/adjustment/order reserve/return; actor va sabab.
- Stock o‘zgarishi atomar tranzaksiyada; parallel checkout oversell'ga olib kelmasin.

### Cart & order
- `Cart`, `CartItem` (yoki guest cart strategiyasi).
- `Order`, `OrderItem` — buyurtma paytidagi product name, SKU, unit price va quantity snapshot saqlanadi.
- `Address` yoki order ichidagi yetkazish snapshot'i.
- `DeliveryZone`, `DeliverySlot`, `Shipment` kerak bo‘lsa.
- `OrderStatusHistory`.
- Buyurtma holatlari va o‘tish qoidalari hujjatlashtiriladi.

### Payment
- `Payment`: provider, amount, currency, status, provider transaction ID, order relation.
- `PaymentEvent`/callback log: idempotency key, provider event ID, receivedAt, processing result; maxfiy imzo/tokenlarni ochiq loglamaslik.
- `Refund` agar refund oqimi qo‘llab-quvvatlansa.
- Provider request/response'dan faqat zarur, redacted ma’lumot saqlash.

### CMS
- `Page`, `PageTranslation`, `BlogPost`, `BlogPostTranslation`, `BlogCategory`, `Tag`.
- `Certificate`: title, issuer, number, valid dates, file asset, verified status. Faqat haqiqiy sertifikat.
- `GalleryItem`, `TeamMember`, `ProductionStep`, `FAQItem`.
- `SiteSetting`, `NavigationItem`, `FooterLink`, `Redirect` ehtiyojga qarab.

### Notifications & operations
- `NotificationTemplate` per locale/channel.
- `NotificationLog`: provider status, retry count, sanitized error.
- `WebhookEvent`/integration event.
- `Job` queue uchun faqat alohida queue tizimi ishlatilsa.
- `AnalyticsEvent` faqat consent/privacy siyosatiga muvofiq va zarur bo‘lsa.

## API endpoint taklifi
Haqiqiy controller'lar auditdan keyin moslashtiriladi. **Amaldagi endpointlar ro‘yxati: [docs/API.md](../API.md).** Farqlar: profil `/users/me` va `/auth/me` da; buyurtmalar `/orders` (`/me/orders` emas); `/pages/:slug` va `/settings/public` o‘rniga `/home`, `/about`, `/production`, `/settings/theme`; to‘lov callback'lari bitta `POST /payments/:provider/webhook` orqali.

### Public
- `GET /api/v1/products`
- `GET /api/v1/products/:slug`
- `GET /api/v1/categories`
- `GET /api/v1/blog`
- `GET /api/v1/blog/:slug`
- `GET /api/v1/pages/:slug`
- `GET /api/v1/settings/public`
- `POST /api/v1/contact`
- `POST /api/v1/orders` yoki checkout flow endpoint'i

### Auth / account
- `POST /api/v1/auth/register` (agar kerak bo‘lsa)
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`
- `GET /api/v1/me/orders`
- `GET /api/v1/me/orders/:id`

### Admin
- `GET/POST /api/v1/admin/products`
- `GET/PATCH/DELETE /api/v1/admin/products/:id` (delete o‘rniga archive afzal bo‘lishi mumkin)
- Shu pattern: categories, orders, users, inventory, blog, media, translations, certificates, settings, reports.
- `GET /api/v1/admin/analytics/overview`

### Payment
- `POST /api/v1/payments/click/prepare`
- `POST /api/v1/payments/click/complete`
- Payme uchun provider talab qilgan JSON-RPC endpoint va metodlar.
- Callbacklar providerning amaldagi rasmiy integratsiya hujjatlariga qat’iy mos bo‘lsin; yuqoridagi nomlar faqat ichki dizayn namunasi.

## Order state machine namunasi
`pending` → `confirmed` → `processing` → `ready_for_delivery` → `shipped` → `delivered`
Qo‘shimcha: `cancelled`, `payment_failed`, `refunded` (faqat kerakli holatlar).

Amaldagi Prisma enum (`OrderStatus`): `PENDING`, `CONFIRMED`, `PROCESSING`, `READY`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`, `FAILED`; to‘lov holati alohida `paymentStatus` maydonida. O‘tish qoidalari hali kodda tekshirilmaydi — AUD-010.
Holat o‘tishlari validatsiya qilinadi; `delivered` dan `processing` ga oddiy PATCH bilan qaytish mumkin emas.

## Payment state machine
`created` → `pending` → `paid` yoki `failed`; refund qo‘llansa `refund_pending` → `refunded`.
Amaldagi enum (`PaymentStatus`): `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`; provider qadamlari `PaymentTransaction` (`INITIATE`, `PREPARE`, `COMPLETE`, `CANCEL`, `REFUND`) da saqlanadi.
- Callback autentifikatsiyasi/signature tekshiruvi.
- Summa va currency order bilan tengligi.
- Provider transaction ID unique constraint.
- Takroriy callback idempotent qayta ishlanadi.
- Callback order/paymentni DB transaction ichida yangilaydi.
- Client redirect hech qachon to‘lovning yagona isboti emas.

## Analytics
- Buyurtmalar soni, gross sales, refund, net sales, AOV, payment success rate, top products, low-stock.
- Sana oralig‘i va timezone aniq.
- Test/sandbox order production hisobotiga qo‘shilmaydi.
- Dashboard hisoblari DB query yoki materialized aggregate orqali; mijozning o‘zi yuborgan raqamlarga ishonilmaydi.
