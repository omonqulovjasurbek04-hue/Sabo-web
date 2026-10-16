# PROMPT 06 — Admin, RBAC va audit

Admin paneldagi har bir route/action uchun permission matrix tuz. Taklif etilgan rollar: SUPER_ADMIN, ADMIN, PRODUCT_MANAGER, ORDER_MANAGER, WAREHOUSE_MANAGER, CONTENT_MANAGER, ANALYST, SUPPORT. Mavjud rollar bo‘lsa, avval moslashtir.
- Default deny; backend guard/service qatlamida tekshir.
- UI elementini yashirish authorization o‘rnini bosmaydi.
- Resource ownership va IDOR testlari.
- High-risk action: refund, role change, bulk price, stock adjustment, export — alohida permission + audit.
- Admin login rate limit, secure session, MFA imkoniyati.
- Audit log actor/action/entity/time/request ID; secret va ortiqcha PII yo‘q.
- CSV/export formula injection va PII riskini tekshir.
Permission matrix, API tests va UI access tests chiqar.
