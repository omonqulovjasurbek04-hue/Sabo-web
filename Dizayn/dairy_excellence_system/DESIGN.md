---
name: Dairy Excellence System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#5e5e5c'
  on-secondary: '#ffffff'
  secondary-container: '#e1dfdc'
  on-secondary-container: '#636360'
  tertiary: '#172328'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c383d'
  on-tertiary-container: '#94a1a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#e4e2de'
  secondary-fixed-dim: '#c8c6c3'
  on-secondary-fixed: '#1b1c1a'
  on-secondary-fixed-variant: '#474744'
  tertiary-fixed: '#d8e4eb'
  tertiary-fixed-dim: '#bcc8cf'
  on-tertiary-fixed: '#111d22'
  on-tertiary-fixed-variant: '#3c494e'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
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
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 24px
  container-padding-desktop: 80px
  gutter: 32px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in the concepts of purity, transparency, and organic luxury. It targets a discerning consumer who values quality, ethical farming, and the refreshing nature of premium dairy. 

The visual style is **Minimalist with Glassmorphic accents**. It utilizes heavy whitespace to evoke the "cleanliness" of fresh milk, while employing frosted glass layers to represent cold, condensation-touched containers. The aesthetic is "High-End Organic"—moving away from rustic barn tropes toward a sophisticated, modern laboratory of nature. 

Key principles include:
- **Purity of Space:** Generous margins and breathing room around every element.
- **Cool Sophistication:** A balance of high-contrast typography and soft, translucent UI surfaces.
- **Tactile Softness:** Elements feel approachable and smooth, mirroring the creamy texture of the product.

## Colors

The palette is inspired by the transition from fresh pasture to the glass bottle. 

- **Primary (Deep Organic Blue):** Used for primary actions, headings, and symbols of trust. It provides the "anchor" for the brand.
- **Secondary (Creamy Off-White):** Used as the primary background for sections and cards to create a warm, organic feel that isn't sterile.
- **Tertiary (Soft Sky Blue):** Used for highlights, active states, and fresh accents.
- **Pure White:** Reserved for the base canvas and high-light glass elements to represent the product itself.

## Typography

This design system employs a "Sophisticated Contrast" pairing. **Playfair Display** provides an editorial, premium feel for headlines, suggesting heritage and quality. **Inter** is used for all functional and body text to ensure maximum legibility and a contemporary, "tech-forward" edge.

- Use **Display-LG** for hero sections only.
- Use **Label-MD** with slight tracking for category headers and small metadata.
- Maintain a high line-height for body text to reinforce the airy, minimalist vibe.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop (12 columns) and a **Fluid Grid** on mobile. 

The spacing philosophy is "Generous and Intentional." We avoid clutter by using large vertical gaps (`section-gap`) between content blocks.
- **Margins:** Desktop uses wide 80px margins to center the content and provide a luxury feel.
- **Vertical Rhythm:** Elements within a card or section use `stack` tokens. `stack-lg` is preferred for separating distinct content groups to maintain an airy feel.

## Elevation & Depth

Depth is achieved through **Glassmorphism and Ambient Shadows** rather than traditional heavy stacking.

- **The Glass Effect:** Use a backdrop-blur (12px - 20px) on semi-transparent white surfaces (`rgba(255, 255, 255, 0.7)`). Pair this with a thin 1px border in `glass_stroke`.
- **Shadows:** Use extremely soft, high-diffusion shadows. Shadows should have a slight blue tint (`#1A365D` at 5% opacity) to stay consistent with the color palette.
- **Layers:** Background (Creamy Off-White) -> Content Cards (Pure White or Glass) -> Overlays (Stronger Blur Glass).

## Shapes

The shape language is organic and soft, mimicking the fluid nature of milk.
- **Standard UI (Buttons, Inputs):** 12px (`0.75rem`) radius.
- **Cards and Containers:** 24px (`1.5rem`) radius.
- **Interactive Elements:** Use "Squircle" shapes where possible for a more premium, continuous curve transition.

## Components

- **Buttons:** Primary buttons use a solid `Deep Organic Blue` with white text and 12px corners. Secondary buttons use the `Glass` style (blur + thin border) with blue text.
- **Cards:** Product cards should feature the glassmorphic style when placed over high-quality lifestyle photography, or Pure White with an ambient shadow on the Creamy Off-White background.
- **Inputs:** Minimalist fields with only a bottom border or a very light `Soft Sky Blue` background. Labels should use the `Label-MD` style.
- **Chips/Badges:** Use `Soft Sky Blue` backgrounds with `Deep Organic Blue` text for organic certifications or freshness indicators.
- **Selection Controls:** Checkboxes and radios should use the primary blue for the selected state, featuring a soft "inner glow" rather than a sharp checkmark for a more organic feel.
- **The "Freshness" Meter:** A custom component—a thin, horizontal progress bar using a gradient from `Soft Sky Blue` to `Deep Organic Blue` to indicate product shelf life or farm-to-table time.