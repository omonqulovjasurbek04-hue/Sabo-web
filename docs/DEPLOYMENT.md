# SABO — Deployment

> Umumiy talablar va checklist: [architecture/09-deployment.md](architecture/09-deployment.md).

## Variantlar
| Yo'riqnoma | Platforma | Konfiguratsiya fayllari |
|---|---|---|
| [deployment/RAILWAY.md](deployment/RAILWAY.md) | Railway (Postgres, Redis, API, Next.js) | `railway.json`, `backend/railway.json`, `frontend/railway.json`, `nixpacks.toml` |
| [deployment/FREE.md](deployment/FREE.md) | Vercel (frontend) + Render (API) + Neon (Postgres) — bepul | `frontend/vercel.json`, `render.yaml` |
| [deployment/ORACLE.md](deployment/ORACLE.md) | Oracle Cloud Free VM, Docker Compose + Caddy (HTTPS) | `docker-compose.prod.yml`, `Caddyfile`, `oracle-bootstrap.sh`, `.env.production.example` |

Lokal ishlab chiqish: `docker-compose.yml` (PostgreSQL, Redis va boshqa xizmatlar) — [README](../README.md).

## Har bir deploy oldidan
1. `npm run build:all` — 0 xato.
2. `npm run lint` va `npm run typecheck`; backend testlari: `npm test --prefix backend`.
3. Migratsiyalar: `prisma migrate deploy` (backend start'da avtomatik). Production'da `db push` ishlatilmaydi.
4. Environment o'zgaruvchilari hosting secret manager'ida; `.env` fayllari image'ga kirmaydi.
5. `GET /api/v1/health` ishlashini tekshirish.

## CI
`.github/workflows/backend-ci.yml`, `.github/workflows/frontend-ci.yml` — install, prisma generate, lint, typecheck, test, build.
