# PROMPT 02 — UI, theme va i18n

Mavjud public Next.js saytni audit qil va faqat tasdiqlangan scope doirasida yaxshila.
- `system`, `light`, `dark` theme; design token/CSS variables.
- Ranglar: Light bg #F7F6F0, surface #FFFFFF, muted green #E8F0E5, text #18352A, primary #286342, accent #D91F32. Dark bg #0D1B16, surface #14251E, muted #1D3329, text #F1F5EF, primary #79B783, accent #F04452. Contrast test bilan tekshir; zarur bo‘lsa tokenlarni o‘zgartir.
- Theme refresh, SSR hydration, first paint va local preference/system preference.
- `uz`, `ru`, `en` barcha route va UI matnlari.
- Responsive header/menu/footer, card, form, loading/empty/error.
- Accessibility: semantic HTML, keyboard, focus, labels, reduced motion.
- 3D asset sekin qurilmada statik poster fallback.
Avval mavjud i18n/theme mexanizmini top; ikkinchi tizim qo‘shma. Test, build va screenshot smoke test natijasini ko‘rsat.
