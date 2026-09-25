# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 0: Architecture decision record

## Current Goal

- Establish the implementation contract for the Prisma model, providers, routes, authorization, jobs, and tests before backend feature work begins.

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
- Workspace navigation and content-studio internal links use client-side routes, while each destination now has its own interaction model instead of a shared generic section page.
- Phase 0 architecture decision record added: `pclient` is the system of record, Clerk organization membership is authoritative, X/Twitter is the MVP social provider, provider contracts are explicit, and jobs/tests have defined contracts.
- OAuth Phase 1: Twitter/X PKCE fixed to S256 — verifier generated in `startOAuth`, stored in httpOnly cookie, challenge sent to X, verifier used at token exchange with Basic client auth (`pclient/src/lib/social/pkce.ts`, `twitter.ts`, `oauth-routes.ts`).
- OAuth Phase 2: TikTok provider implemented — `client_key` token exchange and nested `{data:{user}}` account parsing with `error.code:"ok"` success handling (`pclient/src/lib/social/tiktok.ts`).
- OAuth Phase 3: Instagram provider implemented via Facebook Page flow — code exchange, `/me/accounts` lookup for linked IG Business ID, IG profile fetch (`pclient/src/lib/social/instagram.ts`).
- OAuth Phase 4: Snapchat provider implemented — Basic-auth token exchange and dual-shape (Login Kit / Ads API) account parsing (`pclient/src/lib/social/snapchat.ts`).
- OAuth Phase 5: shared hardening — OAuth cookies use root path, `tokenExpiresAt` persisted from `expiresIn` on connect/reconnect, `TWITTER_REDIRECT_URI` added to env schema (`oauth-routes.ts`, `env.ts`).

## In Progress

- OAuth providers for all 6 platforms (twitter, facebook, instagram, tiktok, linkedin, snapchat) are implemented and type-clean; remaining OAuth work is live verification against real dev apps (redirect URIs, scopes, App Review) — start with Twitter + Facebook.
- Pre-existing type errors in `pclient/src/lib/actions/deletion.ts`, `posts.ts`, and `inngest/functions.ts` (SendEventPayload / inngest signatures) are untouched and still open.
- Known follow-ups: long-lived Facebook/Instagram token exchange, TikTok refresh flow, Snapchat publishing limits (no public organic-post API), provider-specific `metadata` on SocialAccount.

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
