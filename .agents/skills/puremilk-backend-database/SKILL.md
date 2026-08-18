---
name: puremilk-backend-database
description: >-
  Full-stack backend, REST API, database architecture, and payment gateway
  guidelines for PureMilk. Covers Node.js/Express in TypeScript, SQLite/PostgreSQL/Supabase,
  JWT Auth, Order management, and Click/Payme integration.
---

# 🗄️ PureMilk — Backend, Database & API Architecture Protocol

## 00. Asosiy Maqsad va Arxitektura
PureMilk platformasi 100% Type-Safe **TypeScript (Node.js + Express)** backendiga ega. Frontend (`src/`) va backend (`server/`) yagona `src/types/index.ts` tiplaridan foydalanadi, bu esa xatolarni 0 taga tushiradi.

```
server/
├── index.ts                  # Asosiy Express TypeScript serveri (Port 5000)
├── types.ts                  # Frontend va backend o'rtasidagi umumiy tiplar
├── db/
│   ├── database.ts           # In-memory va SQLite/Supabase data layer
│   └── schema.sql            # PostgreSQL / SQLite relational sxemalari
└── routes/
    ├── products.ts           # Mahsulotlar REST API (filtr, qidiruv, slug)
    ├── orders.ts             # Buyurtmalar va savat hisob-kitobi API
    ├── payments.ts           # Click (Prepare/Complete) va Payme (JSON-RPC) webhooklari
    ├── articles.ts           # Retseptlar va maqolalar blogi API
    └── contact.ts            # Aloqa formasi va filiallar API
```

---

## 01. Database Sxemasi (Relational SQL Schema)

### 1. Mahsulotlar Jadvali (`products`)
```sql
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,          -- 'milk', 'kefir', 'butter', 'cheese', 'yogurt'
    name_uz TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    name_en TEXT NOT NULL,
    short_desc_uz TEXT,
    short_desc_ru TEXT,
    short_desc_en TEXT,
    full_desc_uz TEXT,
    full_desc_ru TEXT,
    full_desc_en TEXT,
    base_price INTEGER NOT NULL,      -- Narx so'mda (masalan: 12000)
    badge TEXT,                      -- 'bestseller', 'new', 'organic', 'lactose_free'
    fat_content TEXT,                -- '3.2%', '1.5%', '82.5%'
    shelf_life TEXT,                 -- '7 kun', '14 kun'
    storage_temp TEXT,               -- '+2°C dan +6°C gacha'
    images JSON NOT NULL,            -- ["/assets/milk-1.webp", "/assets/milk-2.webp"]
    nutrition JSON NOT NULL,         -- {"calories": 60, "protein": 3.0, "fat": 3.2, "carbs": 4.7}
    sizes JSON NOT NULL,             -- [{"size": "1L", "price": 12000, "inStock": true}, ...]
    in_stock BOOLEAN DEFAULT TRUE,
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Buyurtmalar Jadvali (`orders`)
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL, -- Masalan: "PM-2026-0817-001"
    user_id TEXT,                     -- Agar ro'yxatdan o'tgan bo'lsa
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_time TEXT,
    payment_method TEXT NOT NULL,     -- 'click', 'payme', 'cash', 'card'
    payment_status TEXT NOT NULL,     -- 'pending', 'paid', 'failed', 'refunded'
    order_status TEXT NOT NULL,       -- 'new', 'processing', 'delivering', 'completed', 'cancelled'
    items JSON NOT NULL,              -- [{"productId": "milk-1l", "size": "1L", "qty": 2, "price": 12000}]
    subtotal INTEGER NOT NULL,
    delivery_fee INTEGER DEFAULT 0,
    total_price INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 02. Asosiy REST API Endpointlari

| Metod | Endpoint | Fayl | Vazifasi | Ruxsat |
|---|---|---|---|---|
| `GET` | `/api/products` | `routes/products.ts` | Barcha mahsulotlarni filtr, qidiruv va kategoriya bo'yicha olish | Public |
| `GET` | `/api/products/:id` | `routes/products.ts` | Bitta mahsulot tafsilotini slug yoki id bo'yicha olish | Public |
| `POST` | `/api/orders` | `routes/orders.ts` | Yangi buyurtma yaratish (Kassadan rasmiylashtirish) | Public / User |
| `GET` | `/api/orders/:id` | `routes/orders.ts` | Buyurtma holatini kuzatish (Tracking) | Public / SMS |
| `POST` | `/api/payments/click/prepare` | `routes/payments.ts` | Click to'lov tizimi Prepare webhook | Click IP |
| `POST` | `/api/payments/click/complete` | `routes/payments.ts` | Click to'lov tizimi Complete webhook | Click IP |
| `POST` | `/api/payments/payme` | `routes/payments.ts` | Payme JSON-RPC 2.0 webhook | Payme IP |
| `GET` | `/api/articles` | `routes/articles.ts` | Retseptlar va yangiliklar blogi | Public |
| `POST` | `/api/contact` | `routes/contact.ts` | Hamkorlik va murojaatlar arizasi | Public |

---

## 03. O'zbekiston To'lov Tizimlari Integratsiyasi (Click & Payme)
1. **Click Webhook Protokoli:** `Prepare` va `Complete` so'rovlarini qabul qilib, imzosi tekshiriladi va buyurtma holati `confirmed` ga o'zgartiriladi.
2. **Payme JSON-RPC Protokoli:** `CheckPerformTransaction`, `CreateTransaction`, `PerformTransaction`, `CancelTransaction`, `CheckTransaction` metodlari to'liq realizatsiya qilingan.
3. **Naqd / Karta (Kuryerga to'lash):** Buyurtma yaratilgach kuryer va operatorga SMS/Telegram orqali bildirishnoma boradi.
