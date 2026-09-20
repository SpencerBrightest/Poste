# Poste - AI-Powered Social Media Management SaaS

A production-quality AI-powered social media management platform for creators, freelancers, and small businesses.

## Features

- **AI Content Generation**: Generate social media content using Google Gemini AI with customizable tone and platform adaptation
- **Content Studio**: Structured content creation with preview, scoring, and optimization
- **Multi-Platform Support**: Connect and publish to multiple social media platforms (MVP: X/Twitter)
- **Scheduling**: Schedule posts for automatic publishing even when offline
- **Calendar View**: Visual calendar for managing scheduled posts
- **Analytics**: Track post performance with AI-powered insights
- **Organization Management**: Multi-user organization support with role-based access
- **Subscription Billing**: Stripe-integrated subscription management with tiered plans
- **Admin Dashboard**: Platform-wide operational visibility
- **Account Deletion**: Complete account deletion with 7-day grace period

## Tech Stack

- **Frontend + Backend**: Next.js 16 with App Router, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **AI**: Google Gemini (with provider abstraction for other providers)
- **Media Storage**: Cloudinary
- **Background Jobs**: Inngest
- **Payments**: Stripe
- **Email**: Resend
- **Validation**: Zod
- **Client Data**: TanStack Query
- **Encryption**: AES-256-GCM for sensitive data

## Project Structure

```
pclient/                 # Main Next.js application
├── app/                # Next.js App Router
│   ├── (marketing)/    # Public landing pages
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Protected dashboard
│   ├── editor/         # Editor and content studio
│   ├── admin/          # Admin dashboard
│   ├── onboarding/     # Organization onboarding
│   └── api/            # API routes
│       ├── auth/        # Clerk webhooks
│       ├── oauth/       # Social OAuth callbacks
│       ├── stripe/      # Stripe webhooks
│       └── inngest/     # Inngest webhooks
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── EditorDashboard.tsx
│   ├── ContentStudio.tsx
│   └── CalendarView.tsx
├── lib/               # Core libraries
│   ├── actions/       # Server Actions
│   ├── hooks/         # React Query hooks
│   ├── ai/            # AI provider (Gemini)
│   ├── social/        # Social platform providers (Twitter)
│   ├── billing/       # Stripe integration
│   ├── permissions/   # Authorization helpers
│   ├── validation/    # Zod schemas
│   ├── encryption/    # Encryption utilities
│   ├── logger/        # Structured logging
│   ├── errors/        # Custom error classes
│   ├── security/      # Security helpers
│   └── inngest/       # Background job functions
├── prisma/            # Database schema and migrations
│   ├── schema.prisma  # Database schema
│   └── seed.ts        # Seed script
└── .env.example       # Environment variables template
```

## Getting Started

### Prerequisites

- **Node.js 18+** (Current version: v20.19.5)
- **PostgreSQL** database (local or cloud-hosted)
- **Clerk account** for authentication
- **Google AI API key** for content generation
- **Cloudinary account** for media storage
- **Stripe account** for payments
- **Inngest account** for background jobs
- **Resend account** for emails (optional)

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Poste/pclient
```

#### 2. Install Dependencies

```bash
npm install
```

**Note:** You may see a warning about `commander@15.0.0` requiring Node.js 22+. This can be safely ignored as the application works with Node.js 18+.

#### 3. Set Up Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your credentials. Required variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/poste?schema=public"

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIzaSy_xxxxx

# Twitter/X OAuth
TWITTER_CLIENT_ID=xxxxx
TWITTER_CLIENT_SECRET=xxxxx
TWITTER_REDIRECT_URI=http://localhost:3000/api/oauth/twitter/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Inngest
INNGEST_SIGNING_KEY=signkey_xxxxx
INNGEST_EVENT_KEY=eventkey_xxxxx

# Encryption (32-character string)
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

#### 4. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL if not already installed
# Create database
createdb poste
```

**Option B: Cloud PostgreSQL (Supabase, Neon, etc.)**

Get your connection string and add it to `DATABASE_URL`.

#### 5. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Alternatively, create a migration (production)
npm run db:migrate
```

#### 6. Seed Database (Optional)

```bash
npm run db:seed
```

This creates an admin user, test organization, and default subscription.

#### 7. Start Development Servers

**Terminal 1 - Next.js App:**

```bash
npm run dev
```

Visit http://localhost:3000

**Terminal 2 - Inngest Dev Server:**

```bash
npx inngest-cli dev
```

This enables background job processing for scheduled posts.

### Database Management Commands

```bash
npm run db:generate  # Generate Prisma client after schema changes
npm run db:push      # Push schema changes without migration (dev only)
npm run db:migrate   # Create and run migration (production)
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Seed development data
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk public key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `GOOGLE_AI_API_KEY` | Yes | Google Gemini API key |
| `TWITTER_CLIENT_ID` | Yes | Twitter OAuth client ID |
| `TWITTER_CLIENT_SECRET` | Yes | Twitter OAuth client secret |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook secret |
| `INNGEST_SIGNING_KEY` | Yes | Inngest signing key |
| `INNGEST_EVENT_KEY` | Yes | Inngest event key |
| `ENCRYPTION_KEY` | Yes | 32-character encryption key |

## Database Schema Overview

The database uses an organization-first data model for multi-tenancy:

- **User** - Clerk user reference with role (USER/ADMIN)
- **Organization** - Primary owner of all customer data
- **Subscription** - Subscription plan and quota limits
- **SocialAccount** - Connected social media accounts (Twitter/X)
- **Post** - Content created by users
- **Media** - Uploaded images/videos
- **ScheduledPost** - Scheduled publication with Inngest
- **PostAnalytics** - Engagement metrics
- **BackgroundJobRecord** - Job execution tracking
- **IdempotencyKey** - Idempotency for duplicate prevention

See `prisma/schema.prisma` for complete schema with all relations and indexes.

## Architecture

### Provider Abstractions

External services are abstracted behind interfaces for easy swapping:

- `AIProvider` - AI generation and scoring (Gemini implementation)
- `SocialPlatformProvider` - Social media OAuth and publishing (Twitter implementation)
- `BillingProvider` - Stripe integration

### Security Model

- **Authentication**: Server-side session validation via Clerk
- **Authorization**: Organization isolation enforced at database and API levels
- **Encryption**: OAuth tokens encrypted with AES-256-GCM
- **Secrets Management**: AI keys, Stripe secrets only on server
- **Rate Limiting**: Technical rate limits + subscription quota enforcement
- **Role-Based Access**: USER and ADMIN roles
- **Idempotency**: Duplicate job prevention with idempotency keys

### Background Jobs (Inngest)

Inngest handles:
- **Scheduled Post Publishing**: Automatic publishing at scheduled times
- **Analytics Synchronization**: Sync metrics from social platforms
- **Account Deletion**: 7-day grace period deletion workflow
- **Webhook Processing**: Stripe and Clerk webhooks

Jobs are idempotent with proper failure handling and retry logic.

## Application Flow

1. **User Registration**: User signs up via Clerk → Redirected to onboarding
2. **Organization Creation**: User creates organization → Default subscription created
3. **Social Connection**: User connects Twitter/X via OAuth → Account stored with encrypted tokens
4. **Content Creation**: User creates post in Content Studio → AI generation available
5. **Scheduling**: User schedules post → Inngest job created for publishing
6. **Publishing**: Inngest executes job → Post published to platform
7. **Analytics**: Metrics synced → Dashboard updated

## Subscription Plans

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| AI Generations | 10 | 100 | 1000 |
| Scheduled Posts | 5 | 50 | 500 |
| Connected Accounts | 1 | 5 | 20 |
| Price | $0 | $29/mo | $99/mo |

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql $DATABASE_URL
```

### Prisma Client Issues

```bash
# Regenerate client
npm run db:generate

# Reset database (development only)
npm run db:push --force-reset
```

### Clerk Authentication Issues

- Verify Clerk keys are correct in `.env`
- Check Clerk dashboard for application configuration
- Ensure redirect URLs match your environment

### Inngest Jobs Not Running

- Ensure Inngest dev server is running: `npx inngest-cli dev`
- Check `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY` are set
- Verify Inngest dashboard shows connected app

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions including:

- Environment setup
- Database migrations
- Webhook configuration
- Background job deployment
- Security checklist



## Support

For support, open an issue in the repository.
