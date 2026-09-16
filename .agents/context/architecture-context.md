# Architecture Context

## Stack

| Layer            | Technology                          | Role                                                        |
| ----------------- | ------------------------------------ | ------------------------------------------------------------ |
| Framework         | Next.js (App Router) + TypeScript    | Full-stack app with server/client boundaries                |
| UI                | Tailwind CSS + shadcn/ui             | Component composition and styling                           |
| Theming           | next-themes                          | Dark mode (default) with a light mode toggle                |
| Auth              | JWT + bcrypt (role-based: user/admin)| User identity, session handling, and route protection       |
| Database          | PostgreSQL + Prisma ORM              | Relational data: users, posts, social accounts, referrals, transactions |
| Payments (local)  | Campay                               | Mobile money collection (MTN MoMo, Orange Money) + webhook confirmation |
| Payments (intl.)  | Stripe                               | Card payments for international users (added after local payment flow is proven) |
| Social data       | Meta Graph API                       | Pulls Instagram/Facebook engagement data via OAuth-connected accounts |
| AI advisor        | Static niche lookup table → engagement-based personalization → LLM (e.g. Groq free tier) | Content/timing recommendations |
| Background jobs   | Scheduled job (e.g. node-cron or platform equivalent) | Periodic polling of social platform data — not true real-time |
| Deployment        | Vercel (app) + managed Postgres (Supabase/Neon free tier) | Hosting, scales from free tier without migration |

## System Boundaries

- `app/api` — Authenticated request handlers: input validation, ownership checks, and persistence.
- `lib` — Shared infrastructure: Prisma client, auth helpers (JWT sign/verify, bcrypt), utilities.
- `components` — UI composition: layout, dashboard widgets, forms, cards.
- `prisma` — Database schema and generated client output.
- Background/cron logic — polls Graph API and Campay transaction status; not run inside request handlers.

## Storage Model

- **Database (PostgreSQL via Prisma)**: users, posts, social accounts, referrals, transactions, and any relational metadata.
- Engagement data is stored as timestamped snapshots per post/account, not overwritten in place — this is what powers growth charts over time.
- No object/blob storage needed for MVP — the app does not handle image uploads.

## Auth and Roles Model

- Every user has a role: `student`/`user` or `admin`.
- Passwords are hashed with bcrypt before storage — never stored or displayed in plaintext, including to admins.
- JWT issued on login/signup, sent as `Authorization: Bearer <token>` on protected requests.
- `authMiddleware` verifies the token and attaches the user to the request; `adminMiddleware` additionally checks `role === 'admin'`.
- Public pages (no auth check): Landing, Sign Up, Login, Forgot Password, Reset Password.
- All other pages (Dashboard, Scheduler, Analytics, AI Advisor, Referrals, Billing, Profile, Admin pages) require a valid session.

## Payment Model

- Campay collection request initiated from the backend; a pending Transaction record is created immediately.
- Campay calls back via webhook to confirm success/failure — the webhook is the source of truth, not the initial API response.
- On confirmed success, the user's plan is updated and the transaction marked `success`.
- Stripe follows the same pending → webhook-confirmed → activate pattern once added.

## AI Advisor Model

- Tier 1: static niche-based lookup table (best general times/content types per niche) — available immediately, no AI call needed.
- Tier 2: personalized recommendation once enough of the user's own post/engagement data exists, calculated from real Graph API data.
- Tier 3: LLM-generated content ideas and phrasing, using niche + engagement summary + recent captions as prompt context.

## Invariants

1. Passwords are never stored or exposed in plaintext, to any party including admins.
2. Payment plan upgrades are only activated on confirmed webhook status, never on the initial request response alone.
3. Public vs protected route status must match the defined page list — no protected page renders without a valid session check.
4. Social platform data is stored as timestamped snapshots, not overwritten, to preserve historical trend data.
5. Admin-only actions and data views are gated by role check, not just hidden in the UI.
