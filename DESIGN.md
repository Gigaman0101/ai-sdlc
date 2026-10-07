---
version: alpha
name: Farmart
description: A fresh, organic, and cheerful grocery market canvas where honey yellow (#FAB528) drives primary action and conversion moments, paired with organic greens (#2B5F3F) and high-contrast slate ink (#0F172A). Clean white cards float on a light canvas with hairline borders, generous touch targets (≥44px), and centered responsive layouts.

colors:
  primary: "#FAB528"
  primary-hover: "#E5A420"
  primary-light: "#FFF8EB"
  accent-orange: "#F25C05"
  accent-orange-light: "#FFF0EB"
  deal-red: "#DC2626"
  organic-green: "#2B5F3F"
  fresh-emerald: "#10B981"
  sky-blue: "#0284C7"
  ink: "#0F172A"
  body: "#1E293B"
  muted: "#64748B"
  subtle: "#94A3B8"
  canvas: "#F8FAFC"
  surface-card: "#FFFFFF"
  surface-cream: "#FBF7ED"
  hairline: "#E2E8F0"
  hairline-light: "#F1F5F9"
  on-primary: "#000000"
  on-accent: "#FFFFFF"
  pastel-purple: "#EBE7F7"
  pastel-beige: "#F4EEE2"
  pastel-blue: "#E3EBF3"
  pastel-green: "#E4EFE7"

typography:
  display-lg:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: -0.5px
  display-md:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: -0.25px
  card-title:
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0px
  body-md:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  body-sm:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0px
  button:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0px
  price-current:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 800
    lineHeight: 1
    letterSpacing: 0px
  price-old:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0px
  label-caps:
    fontFamily: "'Inter', system-ui, sans-serif"
    fontSize: 10px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 1px

rounded:
  none: 0px
  sm: 4px
  md: 6px
  lg: 10px
  xl: 12px
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  section: 48px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-pill:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
  card-product:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  badge-discount:
    backgroundColor: "{colors.deal-red}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  badge-organic:
    backgroundColor: "{colors.organic-green}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  stepper-control:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.sm}"
    padding: "3px 6px"
  dialog-modal:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    rounded: "{rounded.xl}"
    padding: "24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  category-icon-primary:
    backgroundColor: "{colors.primary-light}"
    rounded: "{rounded.full}"
    size: "44px"
  category-icon-accent:
    backgroundColor: "{colors.accent-orange}"
    rounded: "{rounded.full}"
    size: "44px"
  category-icon-accent-light:
    backgroundColor: "{colors.accent-orange-light}"
    rounded: "{rounded.full}"
    size: "44px"
  status-in-stock:
    backgroundColor: "{colors.fresh-emerald}"
    rounded: "{rounded.full}"
    size: "8px"
  category-icon-cold:
    backgroundColor: "{colors.sky-blue}"
    rounded: "{rounded.full}"
    size: "44px"
  text-muted:
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
  price-old-display:
    textColor: "{colors.subtle}"
    typography: "{typography.price-old}"
  page-canvas:
    backgroundColor: "{colors.canvas}"
  card-membership:
    backgroundColor: "{colors.surface-cream}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  divider:
    backgroundColor: "{colors.hairline}"
    height: "1px"
  divider-light:
    backgroundColor: "{colors.hairline-light}"
    height: "1px"
  card-brand-purple:
    backgroundColor: "{colors.pastel-purple}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-beige:
    backgroundColor: "{colors.pastel-beige}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-blue:
    backgroundColor: "{colors.pastel-blue}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-brand-green:
    backgroundColor: "{colors.pastel-green}"
    textColor: "{colors.body}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Farmart Design System (DESIGN.md)

> Semantic Visual Dictionary & Design System for AI Coding Agents  
> Formatted according to the official **Google Stitch alpha spec** from [getdesign.md](https://getdesign.md/what-is-design-md).

---

## Overview

Farmart embodies a fresh, organic, trustworthy, and cheerful modern grocery market. The aesthetic bridges the approachable friendliness of an artisan farmers' market with the frictionless checkout and high-density product discovery of a premier online store.

The canvas defaults to a soft off-white `{colors.canvas}` (#F8FAFC) supporting pure white card plates `{colors.surface-card}` (#FFFFFF). Primary visual energy is carried exclusively by honey/golden yellow `{colors.primary}` (#FAB528) on high-intent CTAs and star ratings, while organic green `{colors.organic-green}` (#2B5F3F) and fresh emerald `{colors.fresh-emerald}` (#10B981) authenticate organic produce and stock status. High-contrast slate `{colors.ink}` (#0F172A) keeps product titles readable and scannable.

**Key Characteristics:**
- **Single Dominant Conversion Accent:** `{colors.primary}` (#FAB528) carries every primary CTA, cart counter badge, and star rating. It is never used for destructive actions or body text.
- **Micro-Delight & Interactive Depth:** Product cards lift cleanly (`translateY(-3px)`) on hover with a crisp 1px `{colors.hairline}` border and soft ambient shadow, never muddy drop shadows.
- **Symmetrical Centered Shell:** All primary containers are strictly centered on the viewport (`max-width: 1240px; margin: 0 auto;`) with balanced gutters on all screen sizes.
- **Touch-First Accessibility:** All interactive tap targets (steppers, filter tabs, navigation pills) strictly adhere to ≥ 44×44px hitboxes for mobile viewports.

---

## Colors

### Brand & Accent
- **Primary Yellow** (`{colors.primary}` — `#FAB528`): The signature brand color. Applied to primary action buttons ("Add to Cart", "Register Now"), active navigation categories, and 5-star customer review indicators.
- **Primary Yellow Hover** (`{colors.primary-hover}` — `#E5A420`): Active/hover state for yellow interactive buttons, providing immediate tactile response.
- **Primary Yellow Light** (`{colors.primary-light}` — `#FFF8EB`): Soft background tint for category icon containers and active filters.
- **Accent Orange** (`{colors.accent-orange}` — `#F25C05`): Secondary warm accent for hot promotion tags, flash deals, and interactive link hover states.
- **Deal Red** (`{colors.deal-red}` — `#DC2626`): Urgent discount percentage badges (`-24%`) and countdown timer backgrounds.
- **Organic Green** (`{colors.organic-green}` — `#2B5F3F`): Brand leaf emblem, 100% organic certification badges, and farm-direct cues.
- **Fresh Emerald** (`{colors.fresh-emerald}` — `#10B981`): In-stock status pips and fresh produce indicators.
- **Sky Blue** (`{colors.sky-blue}` — `#0284C7`): Category icon accent for dairy, cold beverages, and special price flags.

### Surface & Canvas
- **Canvas** (`{colors.canvas}` — `#F8FAFC`): The clean foundation page floor that provides subtle contrast against white product cards.
- **Surface Card** (`{colors.surface-card}` — `#FFFFFF`): Crisp white plates for product items, modals, search bars, and dropdown menus.
- **Surface Cream** (`{colors.surface-cream}` — `#FBF7ED`): Warm textured container for membership recruitment cards and seasonal hero promotions.

### Hairlines & Borders
- **Hairline Default** (`{colors.hairline}` — `#E2E8F0`): 1px structural borders dividing product cards, search inputs, and container grids.
- **Hairline Light** (`{colors.hairline-light}` — `#F1F5F9`): Soft horizontal rules and top-bar utility dividers.

### Text & Ink
- **Ink Primary** (`{colors.ink}` — `#0F172A`): Maximum legibility heading and price text.
- **Body Text** (`{colors.body}` — `#1E293B`): Standard product titles and description copy.
- **Text Muted** (`{colors.muted}` — `#64748B`): Secondary product brands, review quantities, unit counts, and footer links.
- **Text Subtle** (`{colors.subtle}` — `#94A3B8`): Strikethrough previous price tags (`$14.50`) and input placeholder hints.

### Featured Brand Pastel Cards
- **Pastel Purple** (`{colors.pastel-purple}` — `#EBE7F7`): Playful backdrop for snack packs, biscuits, and confectionery.
- **Pastel Beige** (`{colors.pastel-beige}` — `#F4EEE2`): Earthy organic backdrop for whole grain breads, nuts, and teas.
- **Pastel Blue** (`{colors.pastel-blue}` — `#E3EBF3`): Cool refreshing backdrop for mineral waters, sodas, and seltzers.
- **Pastel Green** (`{colors.pastel-green}` — `#E4EFE7`): Crisp backdrop for butcher-fresh meats and sausages.

---

## Typography

### Font Families
- **Display & Headings:** `'Plus Jakarta Sans'`, `'Inter'`, system-ui, sans-serif. Used for prominent hero statements, section titles, and marketing callouts.
- **Body & Controls:** `'Inter'`, system-ui, -apple-system, sans-serif. Clean, neutral grotesque engineered for maximum scannability on dense e-commerce grids.
- **Price & Numbers:** Tabular numerals (`font-variant-numeric: tabular-nums`) applied to countdown timers, unit steppers, and pricing blocks to eliminate horizontal jitter.

### Hierarchy Scale

| Token | Size | Weight | Line Height | Letter Spacing | Context / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `{typography.display-lg}` | `28px` | `800` | `1.25` | `-0.5px` | Main hero marketing titles |
| `{typography.display-md}` | `20px` | `800` | `1.30` | `-0.25px` | Section titles ("Featured Brands", "Top Deals") |
| `{typography.card-title}` | `14px` | `700` | `1.35` | `0px` | Product item titles, promo headlines |
| `{typography.body-md}` | `14px` | `400` | `1.50` | `0px` | Standard descriptive prose |
| `{typography.body-sm}` | `13px` | `400` | `1.50` | `0px` | Metadata, shipping notices, reviews count |
| `{typography.button}` | `12px` | `700` | `1.00` | `0px` | Interactive buttons, cart triggers |
| `{typography.price-current}` | `16px` | `800` | `1.00` | `0px` | Current sale price |
| `{typography.price-old}` | `12px` | `400` | `1.00` | `0px` | Strikethrough regular price |
| `{typography.label-caps}` | `10px` | `700` | `1.00` | `+1.0px` | Badges, discount tags, uppercase categories |

### Principles
Typography prioritizes fast informational triage. Display weights are bold (`800`) to anchor scanning eyes, while secondary labels remain understated at `400` to prevent visual overload across multi-shelf pages.

### Note on Font Substitutes
When `'Plus Jakarta Sans'` is not available from Google Fonts or local system storage, the agent falls back to `'Inter'`, then `-apple-system`, `BlinkMacSystemFont`, `system-ui`.

---

## Layout

### Spacing Scale
The spacing system uses an 8-point base scale with 4-point micro adjustments:
- `{spacing.xs}` (`4px`): Micro padding between badge text and icon edges.
- `{spacing.sm}` (`8px`): Compact gaps between tags, icon-to-label offsets, and button padding.
- `{spacing.md}` (`12px`): Standard gap between form fields, rating stars, and price rows.
- `{spacing.base}` (`16px`): Default card inner padding and standard component gutters.
- `{spacing.lg}` (`24px`): Gap between major product columns and category blocks.
- `{spacing.xl}` (`32px`): Margin separating distinct promo sections and shelf banners.
- `{spacing.section}` (`48px`): Generous vertical separation between primary page modules.

### Grid & Max Container Width
- **Global Centered Canvas:** `max-width: 1240px; margin: 0 auto; width: 100%;`
- **Product Shelves:** 5-to-6 columns on wide desktops, 4 columns on standard desktops, 2 columns on mobile.
- **Featured Categories Bar:** 8 horizontal items on desktop, smooth horizontal scroll snap on mobile.

---

## Elevation

Farmart avoids heavy blur drops and muddy elevation shadows, preferring clean hairline separation paired with crisp directional lifts:

- **Tier 0 (Flat Surface):** No shadow. Used on canvas `{colors.canvas}` and static content containers.
- **Tier 1 (Card Resting):** `box-shadow: 0 1px 3px rgba(0,0,0,0.04); border: 1px solid {colors.hairline};` Provides subtle physical presence for product cards.
- **Tier 2 (Card Hover):** `box-shadow: 0 8px 20px -4px rgba(0,0,0,0.08); transform: translateY(-3px);` Indicates card interactivity.
- **Tier 3 (Floating Modal & Dropdown):** `box-shadow: 0 12px 28px -6px rgba(0,0,0,0.14); border: 1px solid {colors.hairline};` Used for search auto-complete and cart previews.

---

## Components

**`button-primary`** — The signature conversion CTA. Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button}`, padding `8px 16px`, rounded `{rounded.md}` (6px). On hover: shifts background to `{colors.primary-hover}` with `-1px` vertical lift.

**`button-pill`** — The prominent hero banner action button. Background `{colors.surface-card}`, text `{colors.ink}`, typography `{typography.button}`, padding `10px 24px`, rounded `{rounded.full}` (9999px). On hover: shifts background to `{colors.primary}` with subtle elevation shadow.

**`card-product`** — The core grocery item container. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.lg}` (10px), padding `{spacing.base}` (16px), separated from canvas by 1px `{colors.hairline}` border. Hover elevates with Tier 2 shadow.

**`badge-discount`** — The urgent deal flag. Background `{colors.deal-red}`, text `{colors.on-accent}`, typography `{typography.label-caps}`, rounded `{rounded.sm}` (4px), padding `3px 6px`.

**`badge-organic`** — The organic certification tag. Background `{colors.organic-green}`, text `{colors.on-accent}`, typography `{typography.label-caps}`, rounded `{rounded.sm}` (4px), padding `3px 6px`.

**`stepper-control`** — Inline item quantity adjuster. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.sm}` (4px), border `1px solid {colors.hairline}`, padding `3px 6px`. Includes minus/plus buttons that trigger immediate cart recalculation.

**`dialog-modal`** — The floating overlay dialog. Background `{colors.surface-card}`, text `{colors.body}`, rounded `{rounded.xl}` (12px), border `1px solid {colors.hairline}`, padding `{spacing.lg}` (24px). Floating elevation Tier 3 (`box-shadow: 0 12px 28px -6px rgba(0,0,0,0.14)`), accompanied by a darkened slate backdrop (`rgba(15, 23, 42, 0.45)`), accessible close action (≥44px tap target), and standard button-primary CTA with native transitions (`all 0.2s ease`).

---

## Responsive Behavior

| Breakpoint Name | Screen Width | Layout & UI Adaptations |
| :--- | :--- | :--- |
| **Mobile (iPhone)** | `< 640px` | 2-column product grid; search input full width; sticky header with cart badge; hero banner text scales to 20px; category shelf scrolls horizontally. |
| **Tablet** | `640px – 1023px` | 3-column product grid; 2-column promotional hero cards; search bar centered at 500px width. |
| **Desktop** | `1024px – 1279px` | 5-column product grid; full category navigation bar; visible countdown timers. |
| **Wide Desktop** | `≥ 1280px` | Content strictly capped at 1240px; centered with balanced gutters; 5-to-6 product columns. |

### Touch Targets
- All primary mobile touch targets (buttons, search inputs, quantity steppers, filter pills) are engineered to meet or exceed **44 × 44px** (WCAG AAA recommendation).
- Category horizontal pills feature `44px` height with generous 16px lateral padding to prevent mis-clicks.

### Collapsing Strategy
- **Header:** Secondary utility links ("Sell on Farmart", "Order Tracking") hide below `1024px`. Search bar expands to 100% width on mobile.
- **Product Grid:** Drops column count cleanly (`5 -> 4 -> 3 -> 2`), maintaining consistent card aspect ratio and padding without row truncation.
- **Hero Banners:** Stacks vertically below `768px`, ensuring marketing copy and "Shop Now" CTAs remain centered and legible.

---

## Known Gaps

- **Dark Mode:** Farmart renders exclusively in light/warm canvas mode (`#F8FAFC`). Dark mode is intentionally out of scope to preserve fresh grocery market ambiance.
- **Complex Animation Curves:** Third-party physics spring animations are omitted in favor of simple native CSS transitions (`all 0.2s ease`).
- **Multi-step Checkout Accordion:** Checkout flow and payment gateway modals are maintained in downstream application files.
