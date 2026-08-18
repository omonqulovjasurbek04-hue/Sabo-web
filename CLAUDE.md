# SABO — Claude Code Guidelines

## Project Overview
SABO is a high-end corporate & e-commerce digital experience for a premium organic dairy brand.
Stack: React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Canvas/WebGL, Node.js/REST API.

## Brand Colors (Source of Truth)
- Primary CTA & Price: `#C71925` (Dark: `#E32935`)
- Secondary & Info: `#1684C4` (Dark: `#2498D1`)
- Accent & Freshness: `#73B832` (Dark: `#82C744`)
- Light Surface: `#F8FAFC` / `#FFFFFF` / `#EFF7FB`
- Dark Surface: `#0D1117` / `#151B22` / `#1C242D`
- Realism: Never apply CSS hue/color filters to original product packaging images.

## Build and Test Commands
- Dev Server: `npm run dev` (Vite port 3000)
- Backend Server: `npm run server` (Express port 5000)
- Build: `npm run build`
- Type Check: `npm run typecheck` or `npx tsc --noEmit`

## Loaded Skills in `.agents/skills/`
- `puremilk-design-fidelity`: Strict design tokens and layout fidelity.
- `puremilk-fact-integrity`: Absolute ban on AI hallucinated stats/certificates/claims.
- `puremilk-performance-seo`: Core Web Vitals (<2.5s LCP), JSON-LD Schema, WebP images.
- `puremilk-animations-3d`: Three.js / WebGL 3D Milk Glass Hero, scroll reveals, counter animations.
- `puremilk-senior-qa-review`: 10-year Senior dev code audit, 0 TypeScript errors, WCAG AA accessibility.
- `puremilk-ecommerce-architecture`: Multi-language (UZ/RU/EN), Cart, Checkout, Auth, Wishlist.
- `puremilk-backend-database`: REST API, SQLite/Supabase schema, JWT auth, Click/Payme webhooks.
- `puremilk-agent-orchestrator`: AI sub-agent task breakdown, prompt templates, loop prevention.
- `puremilk-modern-stack-guide`: Language % breakdown (85% TS, 10% CSS, 3% HTML, 2% JSON), 100% free hosting.

## Code Style & Architectural Conventions
1. **Design Fidelity**: Follow SABO color system. Do not perform unauthorized redesigns.
2. **Fact Integrity**: Never hallucinate company metrics, production volume, or certifications.
3. **Multi-language**: All UI text must be routed through `useLanguage()` and `src/constants/translations.ts`.
4. **Theme**: Support both light (`#F8FAFC`) and dark (`#0D1117`) modes via Tailwind CSS.
5. **State Management**: Use React Contexts located in `src/context/` (Cart, Auth, Favorites, Language, Theme).
6. **Accessibility**: All interactive elements require ARIA attributes, semantic HTML, and keyboard accessibility.
