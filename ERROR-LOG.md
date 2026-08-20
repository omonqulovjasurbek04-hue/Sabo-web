# ERROR-LOG.md — SABO

Qurilish jarayonida topilgan va tuzatilgan xatoliklar tarixi.

## 1. npm.ps1 — execution policy bloklangan (yuqori)

- Muammo: `npm` buyrug'i `npm.ps1` bloklanganligi sabab ishlamaydi
- Yechim: `npm.cmd` ishlatiladi

## 2. Root layout params tipi mos kelmayapti (yuqori)

- Muammo: `params: Promise<{ locale: string }>` root layout uchun `LayoutProps<"/">` bilan
  tip xatosi — root layout `params` tipi `Promise<{}>` kutiladi
- Yechim: `params: Promise<Record<string, string>>` + `const { locale = "uz" } = await params`

## 3. Dictionary literal tip (yuqori)

- Muammo: `as const` dict'lar `typeof uz` ga tenglashtirilganda ru/en literal tiplari
  uz'nikiga mos kelmaydi
- Yechim: `DeepStringify<T>` tipi — literal string'larni `string` ga, massivlarni readonly
  massivga aylantiradi

## 4. Root `page.tsx` (redirect) build'da "Cannot find module for page: /" (o'rta)

- Muammo: `/` uchun redirect-page turbopack build'da ENOENT
- Yechim: root page olib tashlandi — `/` ni middleware `defaultLocale` ga redirect qiladi

## 5. Footer social link'larda onClick — Server Component (yuqori)

- Muammo: `onClick` event handler server componentda yuborilganda prerender xatosi
- Yechim: real social URL yo'qligi uchun span (nointeraktiv) qilindi — soxta link yaratilmadi

## 6. not-found.tsx params undefined (yuqori)

- Muammo: `[locale]/not-found.tsx` da `const { locale } = await params` — dinamik segment
  uchun not-found'ga params `undefined` keladi, "Cannot destructure property 'locale'"
- Yechim: `const resolved: { locale?: string } = (await params) ?? {}` + fallback "uz"

## 7. isLocale(undefined) — tip xato (past)

- Muammo: `isLocale(resolved.locale)` ga `string | undefined` o'tganda TS xato
- Yechim: `isLocale(value: string | undefined): value is Locale`

## 9. notFound() on-demand route'da HTTP 200 qaytardi (yuqori)

- Muammo: Turbopack build + `next start` da mavjud route (products/[slug]) ichida
  `notFound()` chaqirilsa sahifa to'g'ri render bo'lsa ham HTTP status 200 keladi
- Yechim: `export const dynamicParams = false` — generateStaticParams'da yo'q slug'lar
  routing darajasida 404 qaytaradi (tekshirildi)

## 10. Yog'lilik labeli "Hajmi" bilan chalkashgan (o'rta)

- Muammo: product detail'da `product.fat` (yog'lilik %) `dict.product.volume` labeli bilan
  ko'rsatilgan
- Yechim: `dict.product.fat` qo'shildi (3 tilda) va ishlatildi

## 11. checkout-form textarea/aria-invalid tip xatolari (o'rta)

- Muammo: `fieldProps` onChange'i faqat `ChangeEvent<HTMLInputElement>` — textarea'ga
  spread qilinganda TS xato; `aria-invalid` string tipda
- Yechim: `ChangeEvent<HTMLInputElement | HTMLTextAreaElement>` + boolean `aria-invalid`

## 12. EmptyState CTA'lari locale prefikssiz (past)

- Muammo: `/products` kabi linklar tilga qarab prefixlanmagan — middleware defaultga
  redirect qilardi
- Yechim: EmptyState'ga `locale` prop + `getLocalizedPath`

## 13. 7 sahifada h1 yo'q (yuqori, 2-QA)

- Muammo: products/cart/checkout/account/orders/blog/blog[slug] da bitta h1 bo'lmagan
- Yechim: SectionHeading va EmptyState'ga `as` prop; sahifalarda `as="h1"`

## 14. Drawer linklarida tabIndex={index} (yuqori, 2-QA)

- Muammo: tabIndex>0 fokus tartibini buzardi
- Yechim: olib tashlandi; drawer ochilganda close fokuslanadi, Tab-trap qo'shildi

## 15. Skip-link va color-scheme yo'q (o'rta, 2-QA)

- Muammo: WCAG 2.4.1 (skip-link) va dark rejimda form/scrollbar ko'rinishi
- Yechim: skip-link + #main-content; `color-scheme` light/dark

## 16. Turbopack build — pages-manifest.json ENOENT race (yuqori, 3-QA)

- Muammo: `next build --turbopack` Windows'da har safar `ENOENT .next/server/pages-manifest.json`
  bilan ishlamaydi (tashqi migratsiya vaqtida yuzaga keldi; build fayllari yozilsa ham keyingi
  bosqichda o'qiy olmaydi — VS Code indekslash/antivirus fayl lock'iga bog'liq transient)
- Yechim: `package.json` build script → `next build` (webpack). Turbopack faqat dev'da.
  Ba'zan webpack ham birinchi urinishda xato beradi — `.next` tozalab qayta build ishlaydi.

## 17. 3D komponentlar spec'ga zid (yuqori, 3-QA)

- Muammo: tashqi migratsiya hero/product-card/product-detail'ga Three.js 3D layer qo'shgan —
  dizayn spec (§11 card hover=scale, §25 minimal motion) va performance'ga zid; fayllarda
  `cn` import yo'q, ishlatilmagan o'zgaruvchilar bor (build buzildi)
- Yechim: foydalanuvchi qarori bilan `src/components/3d/` to'liq olib tashlandi; hero/nature/
  product-card/product-detail toza statik premium dizaynga qaytarildi

## 18. PowerShell Set-Content UTF-8 mojibake (past, 3-QA)

- Muammo: `data/categories.ts` ni PS 5.1 `Set-Content` bilan qayta yozganda kirill matnlari
  buzildi (PS 5.1 default ANSI encoding yozadi)
- Yechim: fayl Write (UTF-8) bilan qayta yozildi. Qoida: UTF-8 fayllarni PS bilan
  Set-Content/Out-File qilib yozma, `-Encoding utf8` ham BOM qo'shadi — Write tool ishlat

## 19. next start: "routesManifest.dataRoutes is not iterable" (yuqori, 4-QA)

- Muammo: `next build --turbopack` bilan qurilgan `.next/routes-manifest.json` da
  `dataRoutes` maydoni bo'lmaydi; `next start` shu sabab crash qiladi
  (`TypeError: routesManifest.dataRoutes is not iterable`). Turbopack build ichida
  SSG sahifalar to'g'ri chiqsa ham production start'da ishlamaydi
- Yechim: build doim webpack (`next build`) — manifest `dataRoutes` bilan chiqadi,
  `next start` normal ishlaydi. Bu ERROR-LOG #16 dagi qarorni mustahkamlaydi:
  **Turbopack faqat dev**, production = webpack build + `next start`

## 20. Zombi `next start` port 3100'da 404 (o'rta, 4-QA)

- Muammo: port 3100'da eski server jarayoni qolgan — yangi server EADDRINUSE bilan
  boshlana olmaydi, javoblar eski (buzilgan .next holatidan) keladi: barcha product
  detail sahifalar 404, root esa 200
- Yechim: barcha node jarayonlarini o'ldirish, `.next` tozalash, qayta build, qayta start.
  Qoida: smoke test oldidan `Get-Process node | Stop-Process -Force` + port tozaligini
  tekshirish

## 21. Hero3D/Viewer texture xato → cheksiz render loop (o'rta, 4-QA)

- Muammo: texture yuklanmasa (404/format) `setFailed(true)` bilan komponent `null`
  qaytaradi, lekin WebGL render loopi to'xtamaydi (cleanup faqat unmount'da) — yashirin
  canvas + CPU sarfi
- Yechim: `hasFailed` flag + `animate` boshida `if (hasFailed) return;` (loop to'xtaydi);
  `mesh.visible = false`. Wrapper'lar endi statik rasmni doim tagda render qiladi —
  canvas muvaffaqiyatsiz bo'lsa statik rasm ko'rinib qoladi (graceful fallback)