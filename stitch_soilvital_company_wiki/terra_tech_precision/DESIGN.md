---
name: Terra-Tech Precision
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#414844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#2552ca'
  on-secondary: '#ffffff'
  secondary-container: '#446ce4'
  on-secondary-container: '#fffbff'
  tertiary: '#391f17'
  on-tertiary: '#ffffff'
  tertiary-container: '#52342b'
  on-tertiary-container: '#c69c91'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#00164e'
  on-secondary-fixed-variant: '#003baf'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#e9bcb0'
  on-tertiary-fixed: '#2d150e'
  on-tertiary-fixed-variant: '#5f3f36'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
  earth-deep: '#1B4332'
  tech-blue: '#4169E1'
  soil-clay: '#7D5A50'
  data-orange: '#FF6B00'
  surface-cream: '#FCFBF8'
  status-critical: '#FF0080'
typography:
  headline-xl:
    fontFamily: IBM Plex Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: IBM Plex Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: IBM Plex Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: IBM Plex Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

The brand personality for SoilVital is a sophisticated blend of **agricultural heritage and cutting-edge technology**. It addresses a target audience of data-conscious farmers and agronomists who require precision without sacrificing the organic connection to their land. The UI should evoke a sense of deep-seated trust, scientific accuracy, and environmental stewardship.

The design style follows a **Corporate / Modern** framework infused with **Minimalist** principles. It utilizes a structured, data-driven layout characterized by ample white space, refined typography, and high-quality imagery that contrasts raw earth textures with high-tech sensors. The aesthetic avoids unnecessary flourishes, focusing instead on clarity and the legible presentation of complex IoT data.

## Colors

The palette is anchored in **Deep Earth Green** (Primary), symbolizing growth and agricultural vitality. This is balanced by **Royal Blue** (Secondary), representing the digital IoT layer and technical reliability. **Soil Clay** (Tertiary) provides a warm, organic grounding element.

We utilize a crisp **Cream-White** (Neutral) for surfaces to maintain a premium feel that is more comfortable than pure white. **Data Orange** and **Critical Pink** (from the reference) are repurposed as semantic colors for high-priority alerts and data visualization highlights, ensuring they stand out against the more subdued earth tones.

## Typography

This design system uses a triple-font strategy to differentiate between narrative, content, and data. 

- **Headlines:** IBM Plex Serif conveys an authoritative, established, and academic tone, reminiscent of scientific journals.
- **Body:** IBM Plex Sans provides exceptional legibility for long-form analysis and general interface text.
- **Data & Labels:** JetBrains Mono is utilized for sensor readings, coordinates, and technical metadata, emphasizing the precision of the IoT platform. 

All typography should maintain generous line heights to ensure readability in high-glare outdoor environments common in agricultural use cases.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for desktop to maintain a professional, dashboard-like structure, while transitioning to a **Fluid Grid** for mobile devices. 

- **Desktop:** 12-column grid with a 1280px max-width, 24px gutters, and 64px side margins. Elements should align strictly to the grid to reflect technical precision.
- **Mobile:** 4-column fluid grid with 16px margins. 
- **Spacing Rhythm:** Based on a 4px baseline. Components use 8px, 16px, and 24px increments for internal padding. 

Subtle background grid patterns (1px lines in low-opacity earth tones) may be used in header sections to reinforce the "mapping and analysis" theme.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Low-contrast outlines**. This system avoids heavy shadows to maintain a clean, modern aesthetic that feels like a precision tool rather than a consumer app.

- **Level 0 (Background):** Surface-cream (`#FCFBF8`).
- **Level 1 (Cards/Containers):** Pure white with a 1px solid border in a very light grey or low-opacity Earth Green.
- **Level 2 (Modals/Popovers):** Soft, ambient shadows with a 10% opacity Tech Blue tint to provide "lift" without looking heavy.

Depth is also communicated through the use of high-quality agricultural photography used as backdrop elements, often treated with a slight darken-overlay to ensure text legibility.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the edge off the "industrial" feel of the technology, making it feel more approachable and organic, while still maintaining the structure of a professional tool. 

Buttons and input fields should follow this consistent 4px radius. Interactive elements like "Pills" for status indicators may use a fully rounded (999px) radius to distinguish them from structural components.

## Components

- **Buttons:** Primary buttons use Earth-deep green with white text. Secondary buttons use Tech-blue outlines. High-priority actions may use the Data-orange for immediate visibility.
- **Data Cards:** Cards feature a JetBrains Mono "Label-sm" at the top right for timestamp or sensor ID, with large "Data-display" typography for the primary metric.
- **Inputs:** Clean, 1px bordered boxes with IBM Plex Sans. Focus states use a 2px Tech-blue border.
- **Chips/Status:** Used for soil health indicators (e.g., "Optimal", "Acidic"). Backgrounds should be low-saturation versions of the status color with high-contrast text.
- **Charts:** Use a custom palette derived from the brand colors: Tech-blue for moisture, Earth-green for nitrogen, and Soil-clay for phosphorus.
- **IoT Indicators:** Small pulse animations or distinct icons representing sensor connectivity status should be placed in the navigation or on specific data cards.