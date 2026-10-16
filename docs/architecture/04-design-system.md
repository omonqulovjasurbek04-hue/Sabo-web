# 04 — Dizayn tizimi: Light/Dark, ranglar va UI

## Brend yo‘nalishi
Tabiiy, ishonchli, toza, premium, lekin ortiqcha bezaksiz. Sut mahsulotlari fotosurati asosiy vizual element; ranglar matn o‘qilishini buzmasligi kerak.

## Rang tokenlari
Ranglarni component ichida tasodifiy yozish o‘rniga CSS variables/design tokens ishlating. Quyidagi qiymatlar boshlang‘ich taklif; contrast test bilan tasdiqlansin.

### Light mode
```css
:root,
[data-theme="light"] {
  --bg: #F7F6F0;
  --surface: #FFFFFF;
  --surface-muted: #E8F0E5;
  --text: #18352A;
  --text-muted: #5D6E63;
  --primary: #286342;
  --primary-hover: #1E5035;
  --accent: #D91F32;
  --border: #DCE5DB;
  --success: #26734D;
  --warning: #A86613;
  --danger: #C62835;
  --focus: #2F80ED;
}
```

### Dark mode
```css
[data-theme="dark"] {
  --bg: #0D1B16;
  --surface: #14251E;
  --surface-muted: #1D3329;
  --text: #F1F5EF;
  --text-muted: #B1C1B5;
  --primary: #79B783;
  --primary-hover: #91C99A;
  --accent: #F04452;
  --border: #294136;
  --success: #83D3A0;
  --warning: #F2C078;
  --danger: #FF737D;
  --focus: #8ABEFF;
}
```

## Rang ishlatish qoidalari
- `--bg`: sahifa foni.
- `--surface`: card, modal, input.
- `--surface-muted`: ikkilamchi bloklar.
- `--text` va `--text-muted`: asosiy/ikkinchi darajali matn.
- `--primary`: asosiy CTA va linklar.
- `--accent`: faqat muhim CTA, chegirma yoki brend urg‘usi; hamma joyga qizil ishlatmang.
- `--border`: divider va input chegaralari.
- Rangning o‘zi bilan status bildirilmasin; ikonka/matn ham ishlatilsin.

## Theme xulqi
- Uch holatni qo‘llash tavsiya: `system`, `light`, `dark`.
- Birinchi tashrifda system preference; foydalanuvchi tanlasa local preference saqlanadi.
- Flash of wrong theme bo‘lmasligi uchun Next.js theme script/strategy mavjud stack'ga mos qo‘llansin.
- Theme tugmasi accessible label va `aria-pressed` yoki mos semantika bilan.
- Admin panelning theme'i storefront'dan alohida bo‘lishi mumkin, lekin tokenlar umumiy bo‘lsin.
- Screenshot olish uchun vaqtinchalik CSS bilan haqiqiy theme'ni aralashtirmang.

## Typography va layout
- O‘qilishi oson sans-serif matn; heading uchun brendga mos serif ishlatish mumkin.
- H1 bitta; heading ierarxiyasi to‘g‘ri.
- Desktop content max-width taxminan 1200–1320 px; mobil padding 16–20 px.
- 4/8 px spacing tizimi.
- Card radius 12–16 px; shadow yengil; animatsiya qisqa va kamaytirilishi mumkin (`prefers-reduced-motion`).
- 3D model faqat haqiqiy qiymat qo‘shsa; mobil, sekin qurilma va reduced-motion holatida statik rasm fallback.
- Rasm formatlari: AVIF/WebP afzal; responsive `sizes`; hero LCP rasmi keraksiz lazy-load qilinmasin, pastdagi rasmlar lazy-load qilinsin.

## Accessibility
- WCAG 2.2 AA maqsad: matn kontrasti, focus, klaviatura, form label, error association, alt text.
- Modal focus trap va Escape; drawer ochilganda focus boshqaruvi.
- 44×44 CSS px atrofidagi qulay touch target.
- Rang kontrastini automated test + qo‘lda tekshirish.
