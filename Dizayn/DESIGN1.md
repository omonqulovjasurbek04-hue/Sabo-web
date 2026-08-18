---
name: Lactis Premium
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#424844'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#727973'
  outline-variant: '#c2c8c2'
  surface-tint: '#466554'
  primary: '#052417'
  on-primary: '#ffffff'
  primary-container: '#1c3a2b'
  on-primary-container: '#83a490'
  inverse-primary: '#adceb9'
  secondary: '#286b3e'
  on-secondary: '#ffffff'
  secondary-container: '#acf3ba'
  on-secondary-container: '#2f7144'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cba72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ebd5'
  primary-fixed-dim: '#adceb9'
  on-primary-fixed: '#022113'
  on-primary-fixed-variant: '#2f4d3d'
  secondary-fixed: '#acf3ba'
  secondary-fixed-dim: '#91d6a0'
  on-secondary-fixed: '#00210c'
  on-secondary-fixed-variant: '#075228'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 16px
---

## Brand & Style

The design system is rooted in the concepts of purity, heritage, and uncompromising quality. It targets a discerning audience that values transparency in the food chain and a premium lifestyle aesthetic. 

The visual style is **Minimalist-Premium**. It leverages expansive whitespace to evoke the "purity" of milk, combined with sophisticated editorial flourishes. The interface acts as a quiet frame for high-end food photography. By mixing the timeless authority of classical serif typography with a utilitarian sans-serif foundation, the system communicates both artisanal tradition and modern safety standards. The emotional response should be one of calm, reliability, and "quiet luxury."

## Colors

The palette is inspired by organic landscapes and the raw materials of the dairy industry.

- **Primary (Deep Forest):** Used for primary branding, high-level headings, and main action buttons. It provides the grounding "anchor" for the brand.
- **Accent (Fresh Green):** Reserved for success states, certification badges, and secondary interactive elements that require a "natural" lift.
- **Surface (Milk White):** The core background color. It is a warm off-white that reduces eye strain and feels more premium than pure #FFFFFF.
- **Tertiary (Gold):** A subtle addition for "Elite" or "Premium" tier indicators and limited-run product badges.
- **Neutrals:** A range of grays with slight warm undertones to maintain the organic feel without becoming sterile.

## Typography

This system employs a dual-font strategy. **Playfair Display** is used for storytelling, editorial headlines, and product names to evoke trust and heritage. **Inter** handles all functional UI, body copy, and data-heavy components to ensure maximum readability and a modern, efficient feel.

- **Contrast:** Maintain a clear distinction between serif headers and sans-serif labels.
- **Scale:** Large display sizes should use tighter letter spacing for a more "locked-in" editorial look. 
- **Accessibility:** Never use font sizes below 12px. Ensure body copy maintains a 4.5:1 contrast ratio against the surface.

## Layout & Spacing

The system follows a strict **8px spacing rhythm** to ensure visual harmony across all components.

- **Desktop:** A 12-column fluid grid with 24px gutters. Use wide 64px outside margins to emphasize the premium whitespace.
- **Tablet:** 8-column grid with 16px gutters and 32px margins.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.
- **Content Blocks:** Use large vertical padding (80px to 120px) between major sections on landing pages to allow the high-end photography room to breathe.

## Elevation & Depth

This design system avoids heavy drop shadows in favor of **Tonal Layers** and **Soft Ambient Occlusion**.

- **Level 0 (Base):** The #F8F5F0 Surface.
- **Level 1 (Cards/Inputs):** Pure white (#FFFFFF) backgrounds with a 1px border in a soft neutral (#E5E1DA). No shadow.
- **Level 2 (Floating/Hover):** A very soft, diffused shadow (12% opacity of the Primary color) with a 16px blur to indicate interactivity.
- **Glassmorphism:** Use sparingly for navigation overlays or mobile menus. A 10px backdrop blur with a 60% opacity white fill keeps the "milky" aesthetic consistent.

## Shapes

The shape language is organic yet structured.
- **Base Components:** 8px radius (buttons, inputs, small chips).
- **Containers:** 16px radius (product cards, modal windows, large banners).
- **Decorative:** Occasional use of "organic blobs" or arched image masks to reference the fluid nature of the product.
- **Icons:** Use a medium-stroke weight (1.5px or 2px) with slightly rounded terminals to match the typography.

## Components

### Buttons
- **Primary:** Deep Forest background, Milk White text. 8px radius. On hover: Shift to 10% lighter green.
- **Secondary:** Transparent background, 1.5px Deep Forest border.
- **Ghost:** No border or background. Underline on hover or focus.

### Inputs
- **Form Fields:** White background, 1px neutral border. Labels use `label-md` style above the field. On focus: Border changes to Fresh Green with a 2px outer glow.

### Cards
- **Product Card:** 16px radius. Full-bleed imagery at the top. Use `headline-sm` for product names and `body-md` for descriptions. Price is always emphasized in `headline-sm` bold.

### Badges & Certifications
- Small, pill-shaped (`rounded-xl`) elements. Use Fresh Green backgrounds with white text for "Organic" or "Certified" labels to denote trust and health.

### Navigation
- **Desktop:** Centered logo with wide-spaced links. Use a "milky" glassmorphism effect on scroll.
- **Mobile:** Bottom-sheet style menus for accessibility on large devices, using a 24px corner radius on the top edge.

### Interaction States
- **Disabled:** 30% opacity across the component. Non-interactive.
- **Active:** Slight scale down (0.98x) to provide tactile feedback.
- **Focus:** 2px offset ring in Fresh Green to meet WCAG AA standards.