# Poste Design System

This file is the shared source of truth for all visual design and UI implementation decisions in Poste. Read it before creating or changing any page, layout, feature component, or styling.

## Agent implementation rules

- Do not edit `components/ui/*`, generated UI components, or any path matching `component/generate/ui*` unless the user explicitly requests it.
- Treat the protected UI foundation as reusable and default. Put project-specific styling, layout, and behavior in app-level components instead.
- Use `lucide-react` for interface icons. Do not introduce a second icon library or hand-drawn SVG icons for standard UI actions.
- Preserve responsive behavior across mobile, tablet, and desktop breakpoints.
- Use the palette, typography, spacing, shapes, elevation, and component guidance below for all new UI.
- Prefer semantic design tokens over one-off color values. If a new token is needed, add it to this file first.

## Brand and style

### Personality and purpose

Poste is an intuitive, calm, and approachable digital workspace for creators, social media strategists, and modern marketing teams. The mood is clear, friendly, and empowering: multi-platform publishing, analytics, and community engagement should feel manageable rather than stressful.

### Design movement: modern organic minimalism

- **Warm canvas:** use gentle off-white and soft-tinted surfaces instead of stark artificial white.
- **Airy tactility:** use generous rounded profiles, rounded-2xl containers, pill badges, and soft multi-stop micro-shadows.
- **Delicate boundaries:** use hairline muted neutral-slate borders to define structure without harsh visual breaks.
- **Intentional accents:** use vibrant organic blue for primary actions and soft emerald green for positive growth and scheduled cadence.

## Color tokens

The complete source palette is:

```yaml
surface: '#f8f9ff'
surface-dim: '#cbdbf5'
surface-bright: '#f8f9ff'
surface-container-lowest: '#ffffff'
surface-container-low: '#eff4ff'
surface-container: '#e5eeff'
surface-container-high: '#dce9ff'
surface-container-highest: '#d3e4fe'
on-surface: '#0b1c30'
on-surface-variant: '#434655'
inverse-surface: '#213145'
inverse-on-surface: '#eaf1ff'
outline: '#737686'
outline-variant: '#c3c6d7'
surface-tint: '#0053db'
primary: '#004ac6'
on-primary: '#ffffff'
primary-container: '#2563eb'
on-primary-container: '#eeefff'
inverse-primary: '#b4c5ff'
secondary: '#006c49'
on-secondary: '#ffffff'
secondary-container: '#6cf8bb'
on-secondary-container: '#00714d'
tertiary: '#632ecd'
on-tertiary: '#ffffff'
tertiary-container: '#7d4ce7'
on-tertiary-container: '#f6edff'
error: '#ba1a1a'
on-error: '#ffffff'
error-container: '#ffdad6'
on-error-container: '#93000a'
primary-fixed: '#dbe1ff'
primary-fixed-dim: '#b4c5ff'
on-primary-fixed: '#00174b'
on-primary-fixed-variant: '#003ea8'
secondary-fixed: '#6ffbbe'
secondary-fixed-dim: '#4edea3'
on-secondary-fixed: '#002113'
on-secondary-fixed-variant: '#005236'
tertiary-fixed: '#e9ddff'
tertiary-fixed-dim: '#d0bcff'
on-tertiary-fixed: '#23005c'
on-tertiary-fixed-variant: '#5516be'
background: '#f8f9ff'
on-background: '#0b1c30'
surface-variant: '#d3e4fe'
```

### Palette strategy

- **Primary `#2563EB`:** fresh organic royal blue for primary actions, active navigation, selected dates, and platform link badges.
- **Secondary `#10B981`:** soft organic emerald for successful posts, growth indicators, confirmations, and scheduling badges.
- **Tertiary `#8B5CF6`:** soft lavender violet for engagement metrics, community indicators, and playful accent cards.
- **Neutral `#64748B`:** slate neutrals for accessible, high-legibility text hierarchy without pure-black harshness.

### Tinted pastel surfaces

- **Emerald Mist:** `#ECFDF5` for publishing workflow badges and cards.
- **Sky Tint:** `#EFF6FF` for analytics and insights badges and cards.
- **Lavender Wash:** `#F5F3FF` for engagement tools and community accents.
- **Canvas Base:** `#F8FAFC` through `#F1F5F9` for app layouts, with pure `#FFFFFF` card interiors where appropriate.

## Typography

Use **Plus Jakarta Sans** throughout the product. It provides geometric clarity, friendly curves, a balanced x-height, and open counters for dashboards, calendars, composer feeds, and long-form feedback.

| Token | Size | Weight | Line height | Tracking |
| --- | ---: | ---: | ---: | ---: |
| display-lg | 48px | 700 | 56px | -0.025em |
| display-lg-mobile | 32px | 700 | 40px | -0.02em |
| headline-lg | 32px | 700 | 40px | -0.02em |
| headline-lg-mobile | 24px | 700 | 32px | -0.015em |
| headline-md | 24px | 600 | 32px | -0.015em |
| headline-sm | 18px | 600 | 26px | -0.01em |
| title-md | 16px | 600 | 24px | -0.005em |
| title-sm | 14px | 600 | 20px | — |
| body-lg | 16px | 400 | 26px | — |
| body-md | 14px | 400 | 22px | — |
| body-sm | 12px | 400 | 18px | — |
| label-md | 13px | 500 | 16px | — |
| label-sm | 11px | 600 | 14px | 0.02em |

- Display and headings use bold or semi-bold weights with tight negative tracking.
- Body copy uses regular weight and relaxed line height between roughly 1.55 and 1.65.
- Labels and microcopy use medium or semi-bold weights with subtle tracking.

## Layout and spacing

### Layout philosophy

- **Application shell:** persistent collapsible sidebar, 240px expanded or 72px collapsed, with a responsive flexible workspace.
- **Dashboard grid:** flexible 12-column grid with 24px desktop gutters; cards may span 3, 4, 6, or 12 columns.
- **Marketing pages:** centered 12-column container capped at 1280px, with generous `space-3xl` section separation.

### Responsive breakpoints

- **Mobile, below 768px:** 4-column flow; bottom navigation replaces the sidebar; stats become full-width stacks or horizontal carousels.
- **Tablet, 768px–1024px:** 8-column layout; sidebar becomes an icon-only compact rail; metrics form 2×2 grids.
- **Desktop, above 1024px:** full 12-column canvas with multi-pane composer, live phone preview, and audience statistics where relevant.

### Spacing tokens

```yaml
space-2xs: 0.25rem
space-xs: 0.5rem
space-sm: 0.75rem
space-md: 1rem
space-lg: 1.5rem
space-xl: 2rem
space-2xl: 2.5rem
space-3xl: 3.5rem
gutter-desktop: 1.5rem
gutter-tablet: 1rem
gutter-mobile: 0.75rem
margin-desktop: 2rem
margin-mobile: 1rem
```

## Elevation and borders

Use light ambient layering instead of aggressive shadows:

- **Level 0:** canvas only; no shadow and no border.
- **Level 1:** default cards and tiles: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)` with `1px solid rgba(226, 232, 240, 0.8)`.
- **Level 2:** hover, active, dropdown, and popover: `0 8px 24px -4px rgba(15, 23, 42, 0.06), 0 4px 8px -2px rgba(15, 23, 42, 0.03)`.
- **Level 3:** modals and overlays: `0 20px 35px -8px rgba(15, 23, 42, 0.1), 0 10px 15px -4px rgba(15, 23, 42, 0.04)` with a 20% slate backdrop blur.

Use `#E2E8F0` or `#F1F5F9` for structural borders. Focus states use `1.5px solid #2563EB` with a 3px `#DBEAFE` soft halo.

## Shapes and radii

```yaml
sm: 0.25rem
default: 0.5rem
md: 0.75rem
lg: 1rem
xl: 1.5rem
full: 9999px
```

- Cards and primary modules use rounded-2xl, generally 16px–24px.
- Buttons and inputs use rounded-xl; high-priority CTAs, chips, and status tags use rounded-full.
- Nested icon housings and avatar badges use rounded-lg / 8px.

## Component guidance

### Buttons

- **Primary:** rounded-full, `#2563EB`, white text, subtle downward elevation; hover uses `#1D4ED8`.
- **Secondary / ghost:** white or transparent with `#E2E8F0` hairline border and `#1E293B` text; hover uses `#F8FAFC`.
- **Organic action:** solid `#10B981` pill with white text for conversion and scheduling actions such as “Get Started” and “Schedule Post”.

### Cards and modules

Use `#FFFFFF` or soft pastel surfaces such as `#ECFDF5` and `#EFF6FF`. Apply rounded-2xl, the Level 1 elevation, a delicate border, `space-lg` / 24px internal padding for dashboard cards, and `space-xl` / 32px for marketing feature tiles.

### Badges and chips

Use rounded-full, label-sm typography, and `0.375rem 0.75rem` padding:

- **Success / Live:** `#ECFDF5` background with `#047857` text.
- **Schedule / Queue:** `#EFF6FF` background with `#1D4ED8` text.
- **Engagement / VIP:** `#F5F3FF` background with `#6D28D9` text.

### Inputs and search

Use a minimum 44px touch target, rounded-xl or pill-shaped borders, and `#E2E8F0`. Inputs sit on `#F8FAFC` and transition to `#FFFFFF` on focus with a `#2563EB` micro-halo. Prefix search and calendar inputs with subtle 18px Lucide icons.

### Checkboxes and radios

Checkboxes use rounded-md / 6px with blue or emerald checked fill and a white checkmark. Radios are circular with matching accent rings; the unselected state uses `#CBD5E1` hairline strokes.

### Social network badges

Use circular or rounded-lg brand icons for Instagram, LinkedIn, X, TikTok, and Facebook inside neutral soft pill badges for connection status, channel switches, and analytics breakdowns. Use Lucide icons where a standard interface icon exists; use official brand marks only when the product context requires them.

## Required quality checks

Before delivering UI work, verify responsive layout at mobile, tablet, and desktop widths; check keyboard focus visibility and readable contrast; use Lucide icons consistently; and confirm that protected generated UI components were not modified.
