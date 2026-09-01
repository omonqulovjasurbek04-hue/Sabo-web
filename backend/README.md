# SABO Dairy Platform — Backend API

Production-ready REST API for the SABO Dairy Platform, built with **NestJS** and
**Prisma ORM** (PostgreSQL). Serves the public website, the admin panel, and
future mobile clients: product catalog, categories, cart/checkout, orders,
Click/Payme payments, media storage, CMS content (home, about, production,
blog, certificates), contact, RBAC-protected admin endpoints, and site
settings.

## Tech stack

- NestJS 10 (Express platform)
- Prisma ORM 5 + PostgreSQL
- Redis (ioredis) for caching
- JWT auth (access + refresh tokens) with role- and permission-based guards
- class-validator / class-transformer for request validation
- Swagger (OpenAPI) for API documentation
- Pino for structured logging, Helmet for security headers

## Local setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in `backend/` (there is no `.env.example` checked in
   yet — see `src/config/configuration.ts` and `src/config/validation.ts` for
   the full list of variables and their defaults). At minimum you need:

   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/sabo
   REDIS_URL=redis://localhost:6379
   JWT_ACCESS_SECRET=change_me_to_a_random_32_char_min_secret
   JWT_REFRESH_SECRET=change_me_to_a_different_32_char_min_secret
   ```

   In production, `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must each be at
   least 32 characters and different from the built-in development defaults —
   startup will fail validation otherwise.

3. **Generate the Prisma client**

   ```bash
   npm run prisma:generate
   ```

4. **Apply the database schema**

   ```bash
   npm run prisma:migrate        # creates/applies migrations (dev)
   # or, for a quick non-migration sync:
   npx prisma db push
   ```

5. **Seed initial data** (RBAC roles/permissions, default site settings,
   product categories/products, and optionally a super admin via
   `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` env vars)

   ```bash
   npm run prisma:seed
   ```

6. **Run the API**

   ```bash
   npm run start:dev
   ```

   The API listens on `http://localhost:4000` by default, under the
   `/api/v1` prefix (configurable via `PORT` / `API_PREFIX`).

## Scripts

| Script | Description |
|---|---|
| `npm run start:dev` / `npm run dev` | Run in watch mode |
| `npm run start` | Run without watch |
| `npm run start:prod` | Run the compiled `dist/main.js` |
| `npm run build` | Compile with `nest build` |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run lint` | ESLint with autofix |
| `npm test` / `test:watch` / `test:cov` | Unit tests (Jest) |
| `npm run test:e2e` | End-to-end tests |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Create/apply a dev migration |
| `npm run prisma:migrate:deploy` | Apply migrations in production |
| `npm run prisma:seed` | Run `prisma/seed.ts` |
| `npm run prisma:studio` | Open Prisma Studio |

## API documentation

Interactive Swagger docs are served at **`/docs`** (e.g.
`http://localhost:4000/docs`) whenever `NODE_ENV !== "production"`, or in
production if `ENABLE_SWAGGER=true` is set.
