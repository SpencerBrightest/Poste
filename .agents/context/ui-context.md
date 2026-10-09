# UI Context

## Design system source of truth

The detailed Poste visual specification is in `context/design-system.md`. It is authoritative for new UI work, including colors, typography, spacing, responsive behavior, elevation, shapes, and component styling. If the legacy theme notes below conflict with that file, follow `context/design-system.md`.

## Theme

Dark mode by default, with a light mode toggle available site-wide (via `next-themes`). Every color class must have a corresponding `dark:` variant pair — no page should be styled for only one mode.

| Role              | Dark mode value        | Light mode value       |
| ------------------ | ----------------------- | ------------------------ |
| Page background     | slate-900              | white / slate-50        |
| Card/surface        | slate-800 (or similar) | white / slate-50        |
| Border              | slate-700              | slate-200                |
| Primary text        | white / slate-100      | slate-900                |
| Accent (buttons, focus states, links) | indigo-600 | indigo-600 (unchanged across modes) |

Accent color stays indigo-600 in both modes — it is the one constant brand color across the whole theme system.

## Typography

Clean, modern sans-serif, consistent across the app. Tight, confident headline styling for the landing page hero specifically; standard readable body text elsewhere.

## Component Library

shadcn/ui on top of Tailwind CSS. Components live under `components/ui/`. Use the shadcn CLI (`npx shadcn add <component>`) to add new components rather than writing them from scratch. Key components in use: Button, Card, Input, Label, Form, DropdownMenu, Alert, Badge, Table.

## Icons

lucide-react for all icons.

## Layout Patterns

- **Public pages** (Landing, Login, Signup, Forgot/Reset Password): standalone layout, no sidebar, centered content for auth forms (max-width ~400px), full-width sections for the landing page.
- **App pages** (Dashboard, Scheduler, Analytics, AI Advisor, Referrals, Billing, Profile): wrapped in a persistent `AppLayout` — left sidebar (Dashboard, Scheduler, Analytics, AI Advisor, Referrals, Billing, Profile/Settings, Logout) plus a top bar (app name/logo, theme toggle, user avatar dropdown).
- **Admin pages** (Admin Dashboard, User Management, Transactions): separate sidebar (All Users, All Transactions, Reports), same top bar pattern.

## Page List

### Public (no auth required)
1. Landing
2. Sign Up
3. Login
4. Forgot Password
5. Reset Password

### App (auth required)
6. Dashboard (home)
7. Scheduler
8. Analytics
9. AI Advisor
10. Referrals
11. Billing
12. Profile/Settings

### Admin (auth + admin role required)
13. Admin Dashboard
14. User Management
15. Transactions

## Landing Page Specifics

- Sticky top navigation: logo, nav links (Features, Pricing, Login), "Sign Up Free" CTA.
- Intro overlay (`RippleIntro` component): zoom-in + concentric ripple animation using Framer Motion, fades out after ~3 seconds to reveal the page.
- Hero section: headline, subheadline describing the idea → AI content → schedule → publish → analyze workflow, primary CTA to `/signup`, dashboard preview card.
- Features grid (4 cards): AI Content Generation, Smart Scheduling, Multi-Platform Publishing, Analytics & Insights.
- How it works: 3-step flow (Connect accounts → AI helps create/schedule → Track performance and grow).
- Pricing: 3-column comparison (Free, Pro, Business), Pro highlighted as "Most Popular".
- Footer: logo/tagline, Product/Company/Legal link columns, copyright line.

## Motion

Framer Motion used for the landing page intro overlay and subtle micro-interactions (button hover scale, smooth transitions) across CTAs.
