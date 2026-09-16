# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Protected editor dashboard foundation

## Current Goal

- Complete the Clerk-based sign-in/sign-up flow, protect the workspace routes, and keep the authentication shell consistent with Poste's existing design system.

## Completed

- Project structure and Git initialized (frontend + backend folders).
- `.gitignore` configured (node_modules, .env, build/dist, editor/OS files).
- shadcn/ui installed and initialized.
- Login page prompt built and structured (numbered steps + example output format).
- Landing page implemented in the Next.js App Router using the supplied Organic Social Flow reference: collage hero, capability strip, lifecycle cards, bento product story, audience outcomes, why-Poste panel, gradient CTA, footer, and dark/light theme toggle.
- Landing page refinement pass completed: shared shadcn-style Button primitive, OpenCode-inspired restrained CTA treatment, balanced page gutters, tighter hero position, and larger footer typography.
- Login, Signup, Forgot Password, and Reset Password pages implemented with a shared reference-inspired split auth frame, responsive network illustration, theme toggle, local validation, password visibility controls, optional referral code, and honest pre-API submission states; backend account creation, login, and recovery remain intentionally pending.
- Clerk authentication workflow implemented: dark theme provider with Poste CSS variable overrides, canonical `/sign-in` and `/sign-up` catch-all pages, root `proxy.ts` protection, authenticated `/editor` entry point with `UserButton`, root authentication redirect, and legacy auth URL redirects.
- Theme switcher (next-themes) planned, scoped first to the Login page as a pilot before rolling out to all pages.
- AGENTS.md-style rules drafted: code commenting rules, branch cleanup workflow, and skills for Campay payments, MongoDB/Prisma schema conventions, JWT auth flow, shadcn form pattern, Meta Graph API fetching, and Next.js code review.
- Shared Poste design system added with the Organic Social Flow palette, typography, responsive layout, component guidance, Lucide icon rule, and protected generated-UI paths.
- Protected editor dashboard implemented with Clerk server-side auth, signed-in profile data, responsive navigation, audience analytics cards, scheduling actions, and interactive local filters.
- Protected editor content studio implemented with live platform previews, formatting, emoji/link insertion, media upload, draft/publish scheduling actions, and responsive layout.
- Dedicated protected editor workspaces implemented for scheduling, analytics, AI advisor, referrals, billing, settings, sponsorship, mails, and collaboration, with shared search, tabs, metrics, activity, and action controls.

## In Progress

- Landing page implementation is complete; the public route now composes the reusable landing components directly instead of embedding invalid document-level HTML and CDN scripts in `src/app/page.tsx`.
- Clerk integration and the first protected editor dashboard are implemented and build-validated; the remaining auth work is connecting Clerk's dashboard configuration and verifying the hosted sign-in/sign-up flows with the project's deployment environment.
- Deciding final stack details between the original Express/MongoDB version and the newer Next.js/TypeScript/PostgreSQL/Prisma version (current direction: Next.js/TypeScript/PostgreSQL/Prisma).

## Next Up

- Connect dashboard cards and editor workspaces to persisted post, social account, and engagement data instead of the current presentation fixtures.
- Build the post scheduler interactions behind the completed Clerk boundary.
- Verify Clerk redirect URLs and enabled authentication strategies in the Clerk dashboard for each deployment environment.
- Define the Prisma schema (User, Post, SocialAccount, Referral, Transaction) once the frontend pages are settled.
- Implement JWT-based auth API routes (signup, login, password reset) and the auth middleware.
- Build the Campay payment integration (initiate + webhook) against the Prisma/Postgres data model.
- Set up the daily/periodic job that polls the Meta Graph API for engagement data snapshots.

## Open Questions

- Final confirmation: is the project standardizing on Next.js/TypeScript/PostgreSQL/Prisma/Stripe+Campay, replacing the earlier plain React/Express/MongoDB/Campay-only version? (Current assumption: yes, Next.js/Postgres/Prisma is the active direction.)
- Which AI provider will back the Tier 3 LLM-generated advisor recommendations (Groq free tier was suggested, not yet confirmed as final).

## Architecture Decisions

- Passwords are always hashed with bcrypt; plaintext passwords are never visible, even to admins.
- Payment plan activation happens only on confirmed webhook status, never on the initial payment-initiation response.
- No AWS or object storage needed for MVP — no image uploads in scope, Vercel + managed Postgres is sufficient.
- Social engagement data is fetched via periodic polling (cron-style job), not true real-time webhooks, to avoid the Meta app review process at MVP stage.

## Session Notes

- Building this project deliberately as a learning vehicle for system design, JWT/auth fundamentals, shadcn/ui, and effective AI-assisted development workflow — not just to ship fast.
- Preference: use AI (Antigravity) heavily for frontend UI work, but write backend/auth/payment logic more hands-on to preserve understanding of the riskier, higher-stakes parts of the system.
- Working with a zero budget — every tool and service choice (Vercel, Supabase/Neon, Campay sandbox, Antigravity, Codeium/Copilot free tiers) is deliberately free-tier.
