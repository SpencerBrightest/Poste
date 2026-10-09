# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode required throughout the project.
- Avoid `any`; use explicit interfaces or narrowly scoped types.
- Validate unknown external input (API request bodies, webhook payloads) at system boundaries before trusting it.
- Use `interface` for object contracts (User, Post, Transaction, etc.).

## Next.js

- Default to React Server Components.
- Add `"use client"` only when the component needs browser interactivity, hooks, or real-time state (forms, theme toggle, dashboard charts).
- Keep route handlers focused on a single responsibility.
- Long-running or external-API-dependent work (Graph API polling, Campay status checks) belongs in background/scheduled jobs, not in request handlers.

## Styling

- Use shadcn/ui components wherever applicable — no raw unstyled HTML for interactive elements (forms, buttons, dialogs).
- Every color utility class must have a corresponding `dark:` variant pair.
- Indigo-600 stays the accent color in both light and dark mode — do not substitute a different accent per theme.
- Maintain a consistent border radius scale: `rounded-lg`/`rounded-xl` for cards and inputs, larger for modals.
- No placeholder lorem ipsum in shipped copy — write real, on-brand copy.

## Auth and Security

- Never store or log plaintext passwords, even for admin/debug purposes.
- Hash passwords with bcrypt before saving.
- JWTs contain only non-sensitive identifiers (user id, role) — never secrets.
- Every protected API route checks the token first, then checks role/ownership before proceeding.
- Payment plan changes are only applied on confirmed webhook status, never on the initial API response alone.
- Never expose full phone numbers, tokens, or transaction secrets in logs or comments.

## API Routes

- Validate and parse request input before any logic runs.
- Enforce auth (and admin role, where relevant) checks before any mutation.
- Return consistent, predictable JSON response shapes, e.g. `{ message: "..." }` on error.
- Keep route handlers thin — push complexity into shared modules (`lib/`) or background jobs.

## Data and Storage

- All relational data (users, posts, social accounts, referrals, transactions) belongs in PostgreSQL via Prisma.
- Engagement/analytics data is stored as timestamped snapshots, never overwritten in place.
- Do not store large or frequently-changing external data (e.g. full API responses) directly if only specific fields are needed — extract and store what's actually used.

## File Organization

- `lib/` — shared infrastructure: Prisma client, auth helpers, utilities.
- `app/api/` — route handlers for auth, payments, posts, social data, referrals.
- `components/` — UI composition only; no business logic.
- `components/ui/` — shadcn/ui components; treat as a protected foundation layer (see AI workflow rules).
- Name files after the responsibility they contain, not the technology.

## Commenting

- Add a short comment above every function explaining what it does, not how.
- Add a comment above any non-obvious logic block (calculations, multi-branch conditionals).
- Do not add comments that just restate the line below them.
- Add a one-line file-purpose comment at the top of new files.
- For API routes, comment the endpoint's purpose, expected request body, and return shape.
- Never leave commented-out code in the final output.
