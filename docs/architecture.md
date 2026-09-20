# Architecture Documentation

## Overview

This is an AI-powered Social Media Management SaaS built with Next.js, Clerk authentication, PostgreSQL, and Prisma.

## Technology Stack

- **Frontend + Backend:** Next.js 16 with App Router, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Authentication:** Clerk (existing, will be enhanced with organization model)
- **AI:** OpenAI-compatible provider abstraction
- **Media:** Cloudinary
- **Background Jobs:** Inngest
- **Payments:** Stripe
- **Email:** Resend (with development logging)
- **Deployment:** Vercel

## Architecture Decisions

### Single Next.js Application

The application uses a single Next.js codebase with:
- Server Actions for mutations
- API Route Handlers for webhooks and external callbacks
- Server Components for data fetching
- Client Components for interactivity

This replaces the separate Express server (pserver) that was previously empty.

### Organization-First Data Model

All customer data is owned by an Organization. Users belong to Organizations, enabling future multi-user support.

### Provider Abstractions

External services are abstracted behind interfaces:
- `AIProvider` - AI generation and scoring
- `SocialPlatformProvider` - Social media OAuth and publishing
- `StorageProvider` - Media upload and management
- `EmailProvider` - Email sending
- `BillingProvider` - Stripe integration

Development mock adapters exist for services without credentials.

### Security Model

- Clerk handles authentication
- Server-side authorization checks on every protected operation
- Organization isolation enforced at database and API levels
- OAuth tokens encrypted at rest
- AI keys only on server
- Stripe secret keys only on server

### Background Jobs

Inngest handles:
- Scheduled post publishing
- Analytics synchronization
- Account deletion workflows
- Webhook processing

Jobs are idempotent and handle failures with appropriate retry logic.

## Project Structure

```
app/
  (marketing)/     - Public landing pages
  (auth)/          - Auth pages (sign-in, sign-up)
  dashboard/       - Protected dashboard routes
  admin/           - Admin-only routes
  api/             - API route handlers (webhooks, OAuth callbacks)

components/
  ui/              - shadcn/ui components
  dashboard/       - Dashboard-specific components
  content-studio/  - Content creation components
  calendar/        - Calendar components
  analytics/       - Analytics components
  admin/           - Admin components

lib/
  auth/            - Clerk integration and permissions
  ai/              - AI provider abstraction
  social/          - Social platform providers
  billing/         - Stripe integration
  storage/         - Cloudinary integration
  notifications/   - Notification system
  rate-limit/      - Rate limiting
  permissions/     - Authorization helpers
  validation/      - Zod schemas
  analytics/       - Analytics processing
  jobs/            - Inngest job definitions

prisma/
  schema.prisma    - Database schema
  migrations/      - Database migrations

types/             - TypeScript type definitions

tests/             - Unit and integration tests
```

## Database Schema

Core entities:
- User (Clerk user reference)
- Organization
- SocialAccount
- Post
- Media
- ScheduledPost
- PostAnalytics
- Subscription
- Notification
- BackgroundJobRecord
- DeletionRequest

See `prisma/schema.prisma` for complete schema.

## API Design

### Phase 0: Architecture Contract

### System of Record

`pclient` is the production system of record: Next.js App Router, TypeScript, PostgreSQL, Prisma, Clerk, and Inngest. `pserver` is deprecated and receives no new product functionality.

### Database Schema

The organization-first model is split into identity (`User`, `Organization`), content (`Post`, `Media`), publishing (`SocialAccount`, `ScheduledPost`), analytics (`PostAnalytics`), billing (`Subscription`), operations (`BackgroundJobRecord`, `Notification`), and lifecycle (`DeletionRequest`). Every customer-owned row carries `organizationId`. OAuth credentials are encrypted, analytics are append-only snapshots, and payment changes happen only after verified webhooks.

The current Prisma schema is the starting point. Phase 1 must add or verify organization-scoped foreign keys, unique provider identifiers, unique webhook event IDs, audit records, deletion records, and unique idempotency keys for publish and mutation operations.

### Provider Interfaces

Provider contracts are domain-facing and adapters are SDK-facing. Application code never depends directly on an external SDK or returns raw provider objects.

```ts
interface AIProvider {
  generate(input: AIGenerationInput): Promise<AIGenerationResult>;
  score(input: AIScoringInput): Promise<AIScoringResult>;
}

interface SocialPlatformProvider {
  getAuthorizationUrl(input: OAuthStartInput): Promise<string>;
  exchangeCode(input: OAuthCallbackInput): Promise<ConnectedAccount>;
  publish(input: PublishInput): Promise<PublishResult>;
  fetchAnalytics(input: AnalyticsInput): Promise<AnalyticsSnapshot[]>;
  revoke(input: RevokeInput): Promise<void>;
}

interface StorageProvider {
  upload(input: UploadInput): Promise<StoredMedia>;
  remove(input: RemoveMediaInput): Promise<void>;
}

interface BillingProvider {
  createCheckout(input: CheckoutInput): Promise<CheckoutResult>;
  parseWebhook(input: VerifiedWebhookInput): Promise<BillingEvent>;
  cancelSubscription(input: CancelSubscriptionInput): Promise<void>;
}

interface EmailProvider {
  send(input: EmailInput): Promise<void>;
}
```

Initial production adapters are OpenAI, Cloudinary, X/Twitter, Stripe, Resend, and Inngest. Deterministic fake adapters are used by tests and local development.

### Route Map

| Route group | Access | Responsibility |
| --- | --- | --- |
| `/`, `/pricing`, `/sign-in`, `/sign-up` | Public | Marketing and Clerk entry points. |
| `/editor`, `/editor/*` | Organization member | Dashboard, studio, calendar, analytics, settings, and billing. |
| `/admin`, `/admin/*` | Platform admin | Platform-wide operational views and actions. |
| `/api/posts`, `/api/media`, `/api/social/*` | Organization member | Content, media, and OAuth operations. |
| `/api/analytics/*` | Organization member | Organization-scoped metrics and snapshots. |
| `/api/billing/*` | Member or verified webhook | Checkout, portal, and provider callbacks. |
| `/api/webhooks/*` | Provider signature only | Verified external events. |
| `/api/inngest` | Inngest signature only | Background function ingress. |

Server actions are preferred for UI mutations. Route handlers are required for OAuth callbacks, webhooks, uploads, and external callbacks.

### Authorization Model

Clerk supplies authentication and organization membership. Poste maps the active Clerk organization to the local `Organization` row and evaluates capabilities server-side. Members can read and create organization content. Organization admins can manage social accounts, billing, members, and deletion. Platform admins can access cross-organization operations through an explicit server-side capability.

Every protected operation calls a shared authorization helper, then performs the resource query with the same `organizationId` predicate. UI visibility is never an authorization boundary.

### Job Model

Inngest owns execution; `BackgroundJobRecord` owns application-level status. Each job records `jobType`, stable `jobId`, organization, input, attempts, timestamps, and sanitized failure details. Handlers claim or upsert by idempotency key, re-read the target, stop successfully if the desired state exists, call providers with bounded timeouts, persist state transitions atomically where possible, and retry only transient failures.

Initial job types are `publish-scheduled-post`, `sync-post-analytics`, `process-account-deletion`, `send-notification`, and `process-provider-webhook`.

### Testing Strategy

- **Unit:** permission predicates, Zod validation, state transitions, quotas, retry classification, and provider adapters with mocked SDK clients.
- **Integration:** Prisma repositories against disposable PostgreSQL, organization isolation, unique constraints, webhook idempotency, and transaction boundaries.
- **Route/action:** authenticated and unauthenticated access, role checks, malformed input, and predictable error responses.
- **Job:** retry behavior, duplicate delivery, provider timeout, and already-completed work.
- **End to end:** sign-in redirect, onboarding, create draft, mocked X OAuth, scheduling, and analytics with seeded data.

External services are never called by the default test suite. CI runs typecheck, lint, tests, Prisma validation, and a production build. Every feature must test its authorization boundary and failure path.

### Server Actions
Used for application mutations (create post, schedule, etc.)
- Authenticate via Clerk
- Authorize organization access
- Validate with Zod
- Return structured results

### API Routes
Used for:
- Webhooks (Stripe, social platforms)
- OAuth callbacks
- External service integrations

## Authorization Model

Three roles:
- VISITOR (unauthenticated)
- USER (authenticated customer)
- ADMIN (platform staff)

Server-side checks on every protected operation:
1. Authenticated session (Clerk)
2. Organization membership
3. Resource ownership
4. Role-based permissions

## Failure Handling

### Retryable Errors
- Timeouts
- Network errors
- 429 rate limits
- Temporary 5xx

Behavior: Exponential backoff with jitter, bounded retries

### Non-Retryable Errors
- Expired/revoked tokens
- Invalid credentials
- Policy rejection
- Permanent request errors

Behavior: Fail immediately with specific user-facing reason

## Rate Limiting

Two layers:
1. **Plan Quotas** - Per subscription (AI generations, scheduled posts, connected accounts)
2. **Technical Rate Limits** - Protect APIs from abuse regardless of plan

## Idempotency

Critical operations are idempotent:
- Publishing: Uses ScheduledPost ID
- Analytics: Uses post/platform/time-window
- Webhooks: Uses provider event ID
- Deletion: Uses deletion request ID

## Observability

Structured logging for:
- Authentication events
- OAuth errors
- AI failures
- Publishing attempts/results
- Rate limits
- Subscription events
- Account deletion
- Background job failures

Never logs: passwords, tokens, API keys, sensitive data

## Development Mode

Mock adapters available for:
- AI provider
- Social platform provider
- Email provider
- Storage provider

Allows development without all external credentials.
