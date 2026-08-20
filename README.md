# SABO — Dairy Products Website

Premium dairy brand platform built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Turbopack**.

## Stack

- Next.js 15.5 (App Router, Server Components)
- React 19
- TypeScript (strict)
- **Tailwind CSS v4** (`@tailwindcss/postcss`, CSS-first config via `@theme`)
- **shadcn/ui** (Button, Card, Badge, Input, Textarea, Label, Skeleton, Sheet, DropdownMenu, Sonner)
- Custom i18n (UZ / RU / EN) — no external dependency
- Custom theme system (Light / Dark)

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve production build
npm run lint      # eslint
```

Set the production URL before deploy:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

If unset, `https://sabo.example.com` is used as placeholder.

## Responsive Design

Desktop-to-Mobile media queries covering:
- **Desktop**: 1660px, 1440px, 1320px, 1290px, 1170px, 1140px
- **Tablet**: 1024px, 992px, 850px, 768px, 684px
- **Mobile**: 576px, 480px, 412px, 375px, 320px

## Structure

```
src/
├── app/
│   ├── [locale]/               # /uz, /ru, /en
│   │   ├── page.tsx            # Home
│   │   ├── products/           # Catalog
│   │   │   └── [slug]/         # Product detail (SSG + JSON-LD)
│   │   ├── production/
│   │   ├── about/
│   │   ├── certificates/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── account/
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── layout.tsx              # Root layout (fonts, theme, locale)
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                     # shadcn/ui: Button, Card, Badge, Input, Skeleton...
│   ├── layout/                 # Navbar, Footer, theme, locale switcher
│   ├── product/                # ProductCard, ProductGrid, ProductCatalog
│   ├── sections/               # Hero, Categories, Featured, Trust, CTA...
│   ├── forms/                  # ContactForm (validated)
│   └── cart/                   # CartClient, CartProvider, AddToCartButton
├── data/
│   ├── categories.ts
│   └── products.ts             # PRODUCT DATA — REPLACE WITH REAL DATA
├── lib/
│   ├── i18n/                   # locales, dictionary, navigation
│   ├── seo.ts                  # metadata + hreflang alternates
│   ├── site.ts                 # site URL
│   ├── types.ts                # Product / Category types
│   └── utils.ts                # cn() (clsx + twMerge), formatPrice
├── locales/                    # uz.ts, ru.ts, en.ts (UI strings)
└── middleware.ts               # locale detection & redirect
```

## IMPORTANT — Data integrity rule

SABO facts are **not invented**. Everything not confirmed by a real source is
either hidden or shown as a placeholder note:

- **Product data** (`src/data/products.ts`) — currently sample placeholders
  (`isPlaceholder: true`). Replace with verified data. Set `price`,
  `availability`, `nutrition`, `ingredients`, `storage` only when real.
- **Certificates** — empty state shown until official documents exist.
- **Contact** — phone/address/email shown only after company confirmation.
- **Production / About** — generic sections with honest notes; verified facts
  can be added later.
- No fake ISO / HACCP / Halal / statistics / reviews.

## Design tokens

Light and dark themes are driven by CSS variables in `src/app/globals.css`
(`:root` and `[data-theme="dark"]`) integrated into Tailwind CSS v4 `@theme`. Brand colors:

- Primary red `#C71925` (dark `#E32935`)
- Secondary blue `#1684C4` (dark `#2498D1`)
- Accent green `#73B832` (dark `#82C744`)

Typography: **Playfair Display** (headings) + **Inter** (body), loaded via
`next/font` with only the weights used.

## i18n

- Default locale: `uz`
- URLs: `/uz`, `/ru`, `/en`
- Middleware detects locale from `Accept-Language` and redirects bare paths
- `hreflang` alternates + `x-default` are emitted on every page
- UI strings live in `src/locales/{uz,ru,en}.ts` — never hardcoded in components

## E-commerce readiness

Cart page and client-side cart provider with localStorage exist. Checkout, orders and payment (Click / Payme)
are designed as next-phase additions; no fake payment success is implemented.

## Scripts

| Command            | Action                    |
| ------------------ | ------------------------- |
| `npm run dev`      | Start dev server          |
| `npm run build`    | Production build          |
| `npm run start`    | Serve production build    |
| `npm run lint`     | Run ESLint                |
