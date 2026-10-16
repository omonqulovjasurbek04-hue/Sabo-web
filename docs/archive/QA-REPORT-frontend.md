# QA-REPORT.md — Senior tekshiruv

## 2-tekshiruv (yangi sessiya, master prompt "Yakuniy tekshiruv" bo'yicha)

Sana: 2026-08-20 · Usul: kod review + grep-skan (faktlar) + build/lint + `next start` HTML tahlili (h1/skip-link)

### Xulosa
Soxta faktlar YO'Q ✓ · light/dark to'g'ri ✓ · responsive toza ✓ · performance o'lchamda (font/imglar/bundle) ✓.
Topilgan a11y/SEO muammolar tuzatildi:

| Jiddiylik | Muammo | Yechim | Holat |
|-----------|--------|--------|-------|
| Yuqori | 7 sahifada bitta h1 yo'q (`/products /cart /checkout /account /account/orders /blog /blog/[slug]`) — SEO + WCAG 1.3.1 | `SectionHeading` va `EmptyState` ga `as` prop (h1/h2/h3); sahifalarda `as="h1"` | ✅ tekshirildi: 13 sahifa × h1=1 |
| Yuqori | Skip-link yo'q (WCAG 2.4.1, Level A) | `skip-link` + `#main-content` (3 tilda `common.skipToContent`), CSS focus holati | ✅ |
| Yuqori | Drawer linklarida `tabIndex={index}` — fokus tartibini buzardi (WCAG 2.4.3) | `tabIndex` olib tashlandi | ✅ |
| O'rta | Drawer modal: ochilganda fokus ko'chmaydi, Tab bilan trap bo'lmaydi (WCAG 2.1.2) | Ochilganda close tugmasi fokuslanadi; Tab-trap qo'shildi; yopilganda fokus menu tugmasiga qaytadi | ✅ |
| O'rta | `color-scheme` yo'q — dark rejimda form/scrollbar noto'g'ri ko'rinishi mumkin | `:root { color-scheme: light }` + `[data-theme=dark] { color-scheme: dark }` | ✅ |
| Past | Locale menu: Escape/outside-click bilan yopilmaydi | Yopish logikasi qo'shildi | ✅ |

### Qaydlar
- CSP header framework darajasida yo'q (faqat image optimizer uchun). ThemeInit inline script bor — nonce/CSP hosting (nginx) qatlamida qo'shiladi; kodda maxfiy ma'lumot yo'q.
- `meta.themeColor` qo'shilishi mumkin (brauzer UI) — kelajakda, real brend rangi tasdiqlanganda.

## 1-tekshiruv (oldingi sessiya)

## Yakuniy xulosa

Sahifa: **PASS** — asosiy ssenariylar ishlaydi, soxta ma'lumot yo'q, SEO/i18n/404 to'g'ri.
`products/[slug]` va `blog/[slug]` turi: **PASS (qat'iy holatlar bilan)** — 404 holati tuzatildi.
Topilgan 6 muammoning 5 tasi tuzatildi; 1 tasi (SSR flash) keyingi bosqichga qoldirildi (halol, xavfli emas).

## Jiddiy (HIGH) — tuzatildi

| # | Muammo | Yechim |
|---|--------|--------|
| 1 | Turbopack build'da mavjud route ichida `notFound()` on-demand chiqsa **HTTP 200** qaytardi (404 emas) — `/uz/products/nonexistent` | `dynamicParams = false` qo'shildi: generateStaticParams'da yo'q slug'lar routing darajasida 404. Tekshirildi: `404` ✓, mavjud slug `200` ✓ |
| 2 | Product detail'da yog'lilik (%) belgisi noto'g'ri label bilan — "Hajmi/Volume" (yog' emas) ko'rsatilardi | `dict.product.fat` qo'shildi (uz: "Yog'liligi", ru: "Жирность", en: "Fat") va ishlatildi. 3 tilda tekshirildi ✓ |

## O'rtacha (MEDIUM) — tuzatildi

| # | Muammo | Yechim |
|---|--------|--------|
| 3 | `checkout-form` `fieldProps` tipi faqat `HTMLInputElement` — textarea'ga spread qilishda TS xatosi; `aria-invalid` string tipi xato | `ChangeEvent<HTMLInputElement \| HTMLTextAreaElement>` + `aria-invalid` boolean ✓ |
| 4 | Narx formatlash 3 joyda takrorlanib Intl.NumberFormat inline yozilgan | Yagona `formatPrice` (utils.ts) ishlatildi; utils.ts dagi noto'g'ri joydagi import boshiga ko'chirildi |

## Past (LOW) — tuzatildi

| # | Muammo | Yechim |
|---|--------|--------|
| 5 | `EmptyState` CTA linklari locale prefikssiz → noto'g'ri tilga yuborishi mumkin edi | `locale` prop qo'shildi + `getLocalizedPath`; barcha chaqiruvchilar yangilandi (cart, checkout, blog, orders) |
| 6 | O'lik CSS (cart-hero) va ishlatilmagan import (Reveal) | O'chirildi |

## Qaydlar (bekor qilinmadi, hujjatlashtirildi)

- **SSR flash (past):** cart/checkout serverda empty-state render qiladi, ma'lumot localStorage'dan faqat hydrate'dan keyin chiqadi — qisqa miltillash mumkin. Backend/API bosqichida yo'qoladi.
- **Blog/[slug]:** maqolalar yo'q — halol EmptyState (200) ko'rsatiladi; 404 o'rniga 200 qasddan (blog list ham 200). Maqolalar kelganda `generateStaticParams` + `notFound` qo'shiladi.
- **cart/account/checkout sitemap va robots'da yo'q** — qasddan (indexlanmaydi).
- **To'lov/backend yo'q** — checkout "real API ulanganda ishlaydi" xabari ko'rsatadi; "fake success" qilinmagan ✓.
- **Placeholder mahsulotlar** `isPlaceholder: true`; narx `null` — narx hech qayerda ko'rsatilmaydi ✓ (sweep: price element yo'q).
- **Real SABO fayllari** hali kelmagan — `data/products.ts` almashtirish kutilmoqda.

## Tekshiruv natijalari (sweep)

- 36 URL × 3 til (uz/ru/en): barchasi 200 ✓ (home '/uz/' da 308 — Next trailing-slash, normal)
- `/uz/products/nonexistent` → 404 ✓ · `/uz/does-not-exist-xyz` → 404 ✓ · `/uz/blog/<any>` → 200 (halol EmptyState)
- `/` → 200 (middleware → /en? yo'q, default /uz) · `/products` → 200 (locale redirect) · Accept-Language → locale ✓ (oldingi sessiyada)
- canonical ✓ · hreflang (`hrefLang`) ✓ · robots.txt → sitemap ✓ · sitemap.xml mahsulot URL'lari ✓
- JSON-LD: product detail'da 4 blok (Product + Breadcrumb + tashkilot) ✓ · katalogda yo'q (shart emas)
- Lint: 0 xato. Build: 22 sahifa, First Load JS 122 kB shared.

## Keyingi bosqichga qoldirilgan (real ma'lumot/backend bilan)

1. Real mahsulotlar/rasmlar integratsiyasi (foydalanuvchi fayl yo'lini berishi kerak)
2. Backend + haqiqiy buyurtma yuborish, Click/Payme
3. Blog maqolalari + `generateStaticParams`/`notFound`
4. Account auth (backend kelganda)
5. SSR flash bartaraf etish (cookie/server cart yoki backend)