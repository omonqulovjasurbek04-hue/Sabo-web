---
name: Lumina Dairy Collective
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
  on-surface-variant: '#404940'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#707970'
  outline-variant: '#c0c9be'
  surface-tint: '#286b3e'
  primary: '#25683c'
  on-primary: '#ffffff'
  primary-container: '#408253'
  on-primary-container: '#f6fff3'
  inverse-primary: '#91d6a0'
  secondary: '#466554'
  on-secondary: '#ffffff'
  secondary-container: '#c8ebd5'
  on-secondary-container: '#4c6b5a'
  tertiary: '#765700'
  on-tertiary: '#ffffff'
  tertiary-container: '#946f05'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf3ba'
  primary-fixed-dim: '#91d6a0'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#075228'
  secondary-fixed: '#c8ebd5'
  secondary-fixed-dim: '#adceb9'
  on-secondary-fixed: '#022113'
  on-secondary-fixed-variant: '#2f4d3d'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#eec058'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 32px
  unit-2xl: 48px
  unit-3xl: 64px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style

The design system is anchored in a **Corporate-Premium** aesthetic that balances agricultural heritage with modern industrial precision. The brand personality is "Refined Organic"—it avoids the cluttered visuals of discount retail in favor of a minimalist, high-end editorial approach. 

The target audience includes B2B partners, retail distributors, and health-conscious consumers. The UI must evoke a sense of purity, architectural stability, and quiet confidence. We achieve this through a "Soft Minimalism" style: utilizing expansive whitespace (Milk White), structured layouts, and tactile depth that suggests the viscosity and richness of the product.

Key principles:
- **Purity:** Eliminate unnecessary decorative elements.
- **Heritage:** Use high-contrast serif typography to signal established authority.
- **Transparency:** Clear information hierarchy to support multilingual clarity (UZ, RU, EN).

## Colors

This design system utilizes a palette inspired by the dairy lifecycle: pastures, cream, and traditional apothecary styling.

- **Primary (Fresh Green):** Used for actionable items and primary brand expressions. It represents growth and natural origin.
- **Secondary (Deep Forest):** The anchor for the system. Used for text, navigation backgrounds, and deep structural elements. It replaces black entirely to maintain a soft, organic feel.
- **Tertiary (Butter Gold):** Reserved for highlights, premium membership badges, or quality seals.
- **Neutrals:** `Milk White` serves as the global canvas, while `Cream` provides a subtle tonal shift for secondary containers and cards to create depth without using borders.
- **Info Blue:** Specifically for system messaging, technical data, and logistics updates.

## Typography

The typography strategy pairs a high-contrast serif for "storytelling" with a neutral sans-serif for "utility."

- **Headings:** Playfair Display is used for all major headers. It adds a layer of sophistication and "editorial" quality to the dairy industry.
- **Body & Utility:** Inter provides the necessary legibility for complex data (nutritional facts, logistics) and supports extensive character sets for Uzbek, Russian, and English.
- **Accessibility:** The minimum font size is strictly enforced at 14px. For multilingual support, avoid justified text; use left-aligned rags to accommodate varying word lengths in Cyrillic and Latin scripts.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Grid Logic:** Use 24px gutters to allow the content to "breathe," reflecting the brand's premium positioning.
- **Vertical Rhythm:** Components should follow an 8px baseline grid. Spacing between sections should default to `unit-3xl` (64px) to emphasize a spacious, high-end feel.
- **Responsiveness:** 
  - **Desktop (1200px+):** Full 12 columns, 64px outer margins.
  - **Tablet (768px - 1199px):** 8 columns, 32px outer margins.
  - **Mobile (<767px):** 4 columns, 16px outer margins. Headlines scale down using the `-mobile` tokens.

## Elevation & Depth

To maintain a "natural" feel, we avoid heavy, synthetic shadows. Instead, we use **Tonal Layering** and **Ambient Depth**.

- **Resting State:** Most cards and containers should have no shadow, using the `Cream` background against the `Milk White` canvas to define boundaries. 
- **Interactive State (Hover):** When an element is focused or hovered, apply a subtle 4px elevation: `0px 4px 12px rgba(28, 58, 43, 0.08)`. The shadow should use a hint of the `Deep Forest` color rather than pure grey to keep the palette warm.
- **Deep Elevation:** Used only for modals or global navigation bars. This uses a dual-shadow approach: a tight, dark tint for definition and a wide, soft tint for "lift."

## Shapes

The shape language is "Soft-Geometric." 

- **Primary Radius:** A consistent 8px (rounded-lg) is applied to all buttons, input fields, and cards. This softens the corporate edges of the design while remaining professional.
- **Icons:** Use medium-stroke icons (1.5pt to 2pt) with slightly rounded terminals to match the typography's weight. 
- **Buttons:** Large buttons should maintain the 8px radius. Do not use pill shapes for primary actions as it leans too "casual."

## Components

### Buttons
- **Primary:** Background `Fresh Green`, Text `Milk White`. 8px radius. Bold Inter text.
- **Secondary:** Outline `Deep Forest` (1px), Text `Deep Forest`.
- **Ghost:** Text `Deep Forest`. Used for low-priority navigation.

### Cards
- **Product Cards:** Background `Cream`. No border. Image centered. Title in Playfair Display.
- **Data Cards:** Background `Milk White` with 1px `Cream` border. 

### Inputs & Forms
- **Fields:** 1px border using `Cream`. On focus, border transitions to `Fresh Green` with a subtle 2px outer glow of the same color. 
- **Labels:** Use `label-md` token, always positioned above the input.

### Highlights & Badges
- **Quality Badges:** Background `Butter Gold`, Text `Deep Forest`. Use for "Organic," "Premium," or "Award Winning" labels.
- **Status Chips:** Background `Info Blue` (at 10% opacity), Text `Info Blue`.

### Navigation
- **Desktop Header:** Background `Deep Forest`. Links in `Milk White` using `label-md`. 
- **Language Switcher:** A simple text-toggle (UZ | RU | EN) using `body-sm` weight, with the active language underlined in `Butter Gold`.