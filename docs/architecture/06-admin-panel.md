# 06 — Admin panel

## Navigatsiya
> Amaldagi holat: admin'da Dashboard, Buyurtmalar, Xabarlar va Login API'ga ulangan; boshqa sahifalar hozircha lokal demo ma'lumot bilan ishlaydi (AUD-001).
1. Dashboard
2. Buyurtmalar
3. Mahsulotlar
4. Kategoriyalar
5. Ombor
6. Mijozlar
7. To‘lovlar
8. Yetkazib berish
9. Blog
10. Media kutubxonasi
11. Sertifikatlar
12. Ishlab chiqarish va galereya
13. Sahifalar/CMS
14. Tarjimalar
15. Menyu va footer
16. SEO va redirectlar
17. Kupon/aksiyalar (agar biznes qoidalari belgilansa)
18. Hisobotlar
19. Foydalanuvchilar, rollar va ruxsatlar
20. Audit log
21. Sayt sozlamalari
22. Integratsiyalar va bildirishnomalar
23. Admin profil va xavfsizlik

## Dashboard
- Bugungi/haftalik/oylik buyurtmalar.
- Gross/net sales va refund.
- Buyurtma statuslari.
- Eng ko‘p sotilgan mahsulotlar.
- Low-stock va out-of-stock ogohlantirishlari.
- Payment success/failure.
- So‘nggi audit voqealari.
- Filtr: vaqt oralig‘i, valyuta, status.
- Recharts tooltip, responsive, empty/loading/error state.

## CRUD standartlari
- Table: qidiruv, server pagination, filter, sort allowlist, column visibility faqat kerak bo‘lsa.
- Create/edit form: schema validation, field-level error, dirty form warning.
- Delete: default hard delete emas; archive/soft delete va confirmation.
- Bulk action: natija va xatolar alohida ko‘rsatiladi.
- Media upload: MIME + magic bytes tekshiruvi, max size, ruxsat etilgan format, tasodifiy storage key, malware scanning imkoniyati.
- Product edit: tarjimalar, variantlar, nutrition, ingredients, allergens, storage, SEO, images, 3D asset.
- Order detail: timeline, customer snapshot, item snapshot, payment events, delivery, internal note (PII siyosatiga muvofiq).
- Inventory adjustment: quantity, reason, actor, timestamp; audit yozuvi shart.
- Settings: riskli o‘zgarishlar uchun permission va audit.

## RBAC rollari — boshlang‘ich taklif
> Amaldagi `RoleType` enum: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `EDITOR`, `MODERATOR`, `CUSTOMER` (bitta enum + `Role`/`Permission`/`RolePermission`/`UserRole` modellari). Quyidagi rollar — kelajak uchun taklif; qo‘shishdan oldin migratsiya va mavjud `@Roles()` chaqiruvlari ko‘rib chiqilsin. Endpoint–rol jadvali: [docs/API.md](../API.md).
- `SUPER_ADMIN`: tizim va rol boshqaruvi.
- `ADMIN`: biznes sozlamalari, umumiy boshqaruv; yuqori xavfli amallar alohida ruxsat.
- `PRODUCT_MANAGER`: mahsulot, kategoriya, narx, media.
- `ORDER_MANAGER`: buyurtma va yetkazish.
- `WAREHOUSE_MANAGER`: stock va inventory movement.
- `CONTENT_MANAGER`: blog, sahifa, tarjima, galereya.
- `ANALYST`: faqat hisobot o‘qish.
- `SUPPORT`: cheklangan mijoz/buyurtma ko‘rish.
- Har bir rol backend'da tekshiriladi; default deny. Bir foydalanuvchiga bir nechta rol kerak bo‘lishi mumkin.

## Xavfli amallar
- Role/permission o‘zgartirish.
- Refund va order cancel.
- Narxlarni bulk o‘zgartirish.
- Stock adjustment.
- API keys/integration sozlamalari.
- Export yoki ko‘p mijoz ma’lumotini yuklab olish.
Bular uchun permission, audit log, qayta tasdiqlash va kerak bo‘lsa re-authentication qo‘llanadi.
