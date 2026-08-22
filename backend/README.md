# 🥛 SABO Dairy Platform — Production-Ready Backend

> Highly scalable, secure, multilingual, and API-first backend for the **SABO Dairy Platform**, built with **NestJS, TypeScript, PostgreSQL, Prisma, Redis, MinIO/S3, and Docker**.

---

## 🏛️ Architecture & Overview

```text
                 SABO WEBSITE (Next.js) / MOBILE APP
                               │
                               │ HTTPS / JSON
                               ▼
                    NESTJS REST API (/api/v1)
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
     PostgreSQL              Redis               S3/MinIO
     (Database)             (Cache)              (Media)
          │
          ▼
        PRISMA
          │
          ▼
    BUSINESS LOGIC
    ┌──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼
 Products    Orders      Auth       CMS      Payments
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
```

---

## 🚀 Tech Stack

- **Framework**: [NestJS 10](https://nestjs.com/) (Modular Architecture)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Database**: [PostgreSQL 16](https://www.postgresql.org/)
- **ORM**: [Prisma 5](https://www.prisma.io/)
- **Cache & Rate Limiting**: [Redis 7](https://redis.io/) + `ioredis`
- **Authentication**: JWT (Access Token) + Rotating Hashed Refresh Tokens in DB + [Argon2id](https://github.com/ranisalt/node-argon2)
- **Object Storage**: S3-compatible (MinIO for Local Dev / AWS S3 for Production)
- **API Documentation**: [Swagger / OpenAPI](https://swagger.io/) at `/docs`
- **Security**: [Helmet](https://helmetjs.github.io/), Whitelisted CORS, Class Validator, SHA-256 IP Hashing, Idempotency Keys
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose

---

## 🔒 Critical Business & Security Rules

1. **No Fake Data Rule**: The backend never invents prices, nutritional facts, company statistics, certificates, or ingredients. All fields are `null` unless entered and verified by an authorized administrator.
2. **Tamper-Proof Financial Engine**: Frontend prices and totals are completely ignored during checkout. The backend's `OrderPricingService` retrieves actual database prices and computes all financial totals in integer minor units (`priceMinor`).
3. **Order Snapshots**: When an order is placed, `OrderItem` captures a permanent snapshot of the product name, variant name, unit price, and SKU at the exact time of purchase. Future product edits do not affect historical orders.
4. **Multilingual Fallback**: Full support for `uz`, `ru`, and `en`. If a translation is missing for the requested locale, it automatically falls back to default (`uz`) or the next available locale.
5. **Payment Webhook Verification**: Click and Payme callbacks are cryptographically verified using signatures and amounts before marking orders as `PAID`.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 2. Start Infrastructure Containers
```bash
docker compose up -d
```
This starts:
- **PostgreSQL**: `localhost:5432` (`postgres/postgres`)
- **Redis**: `localhost:6379`
- **MinIO S3**: `http://localhost:9000` (Console: `http://localhost:9001`, `minioadmin/minioadmin`)
- **Mailpit**: `http://localhost:8025` (SMTP: `localhost:1025`)

### 3. Install Dependencies & Setup Environment
```bash
cd sabo-backend
npm install
cp .env.example .env
```

### 4. Run Migrations & Seed Database
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run start:dev
```
API will be running on `http://localhost:4000/api/v1`  
Swagger documentation available at `http://localhost:4000/docs`

---

## 📚 API Endpoints Summary

| Module | Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/v1/auth/register` | POST | Public | Register new customer |
| **Auth** | `/api/v1/auth/login` | POST | Public | Login with email/phone |
| **Auth** | `/api/v1/auth/refresh` | POST | Public | Rotate refresh token |
| **Auth** | `/api/v1/auth/logout` | POST | User | Revoke refresh tokens |
| **Users** | `/api/v1/users/me` | GET | User | Get logged-in user profile |
| **Users** | `/api/v1/users/me` | PATCH | User | Update user profile |
| **Products** | `/api/v1/products` | GET | Public | Catalog with search, filters & pagination |
| **Products** | `/api/v1/products/featured` | GET | Public | Featured products for home |
| **Products** | `/api/v1/products/:slug` | GET | Public | Product detail with nutrition & storage |
| **Categories**| `/api/v1/categories` | GET | Public | Category tree with translations |
| **Cart** | `/api/v1/cart` | GET | Public/User | Get user or guest cart |
| **Cart** | `/api/v1/cart/items` | POST | Public/User | Add item with stock validation |
| **Orders** | `/api/v1/orders` | POST | Public/User | Transactional checkout with pricing verification |
| **Orders** | `/api/v1/orders` | GET | User | Order history |
| **Payments** | `/api/v1/payments/checkout-url` | POST | User | Generate Click / Payme payment URL |
| **Payments** | `/api/v1/payments/:provider/webhook` | POST | Public | Webhook with signature verification |
| **Home CMS** | `/api/v1/home` | GET | Public | Cached aggregated homepage data |
| **Blog** | `/api/v1/blog` | GET | Public | Published blog posts & recipes |
| **Certificates**| `/api/v1/certificates` | GET | Public | Verified quality certificates |
| **Contact** | `/api/v1/contact` | POST | Public | Spam-protected contact form |
| **Admin** | `/api/v1/admin/dashboard` | GET | Admin | Real aggregated database metrics |
| **Health** | `/api/v1/health` | GET | Public | Liveness and readiness health checks |

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Strict TypeScript check
npm run typecheck

# Code formatting & linting
npm run lint
```
