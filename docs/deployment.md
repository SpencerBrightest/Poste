# Deployment Documentation

## Overview

This document describes how to deploy the AI-powered Social Media Management SaaS to production.

## Prerequisites

- Vercel account
- PostgreSQL database (Neon, Supabase, or Railway)
- Clerk account with application configured
- OpenAI API key (or compatible AI provider)
- Cloudinary account (or S3-compatible storage)
- Stripe account with products configured
- Inngest account for background jobs
- Resend account (or other email provider)
- Domain name configured

## Environment Variables

Create `.env.production` with:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboard"

# AI Provider
OPENAI_API_KEY="sk-..."
AI_MODEL="gpt-4o"

# Social Platform OAuth (X/Twitter)
TWITTER_CLIENT_ID="..."
TWITTER_CLIENT_SECRET="..."
TWITTER_CALLBACK_URL="https://yourdomain.com/api/oauth/twitter/callback"

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_PRICE_ID_FREE="price_..."
STRIPE_PRICE_ID_PRO="price_..."
STRIPE_PRICE_ID_BUSINESS="price_..."

# Background Jobs (Inngest)
INNGEST_SIGNING_KEY="signkey_..."
INNGEST_EVENT_KEY="eventkey_..."
INNGEST_APP_URL="https://yourdomain.com/api/inngest"

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM_ADDRESS="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Encryption
ENCRYPTION_KEY="32-byte-hex-key-for-token-encryption"

# Rate Limiting
REDIS_URL="redis://user:password@host:port"
```

## Database Setup

### 1. Create Database

```bash
# Using Neon
npx neonctl create-database --name poste

# Using Supabase
# Created via Supabase dashboard
```

### 2. Run Migrations

```bash
npx prisma migrate deploy
```

### 3. Seed Production Data (Optional)

```bash
npx prisma db seed
```

## Vercel Deployment

### 1. Connect Repository

```bash
vercel link
```

### 2. Configure Environment Variables

Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each variable from `.env.production`

### 3. Deploy

```bash
vercel --prod
```

### 4. Configure Domains

- Add custom domain in Vercel dashboard
- Configure DNS records
- Enable SSL (automatic)

## Background Jobs (Inngest)

### 1. Deploy Inngest Functions

```bash
npx inngest-cli deploy
```

### 2. Verify Inngest Dashboard

- Check Inngest dashboard at `https://app.inngest.com`
- Verify functions are registered
- Test with a sample job

## Stripe Configuration

### 1. Create Products and Prices

In Stripe dashboard:
- Create FREE product (price ID)
- Create PRO product (price ID)
- Create BUSINESS product (price ID)
- Configure billing intervals

### 2. Configure Webhook

- Add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
- Select events: `customer.subscription.*`, `invoice.*`, `payment_intent.*`
- Copy webhook secret to environment

### 3. Test Checkout

- Test checkout flow in staging
- Verify webhook processing
- Check subscription status in database

## Clerk Configuration

### 1. Configure Application

In Clerk dashboard:
- Enable email/password authentication
- Configure email verification (required)
- Configure password reset
- Set up JWT templates
- Configure allowed domains

### 2. Configure Organization Support

- Enable Organizations feature
- Configure organization creation settings
- Set up organization roles

### 3. Configure Webhooks (Optional)

- Add webhook for user events
- Configure sync with database

## Cloudinary Configuration

### 1. Create Account

- Sign up at cloudinary.com
- Create upload preset for unsigned uploads
- Configure transformation settings
- Set up security (signed URLs if needed)

### 2. Test Upload

- Test media upload in staging
- Verify image optimization
- Check video processing

## Monitoring

### 1. Vercel Analytics

- Enable Vercel Analytics
- Configure custom events
- Set up error tracking

### 2. Inngest Monitoring

- Monitor job success/failure rates
- Set up alerts for failed jobs
- Review job performance

### 3. Database Monitoring

- Monitor connection pool
- Set up query performance alerts
- Monitor storage usage

### 4. Error Tracking

- Configure error logging
- Set up alerts for critical errors
- Review error patterns

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Clerk authentication working
- [ ] Email verification flow tested
- [ ] Password reset flow tested
- [ ] Stripe checkout working
- [ ] Stripe webhooks receiving events
- [ ] Inngest jobs registered
- [ ] Test post scheduling
- [ ] Test background publishing
- [ ] Test OAuth connection
- [ ] Test media upload
- [ ] Test AI generation
- [ ] Test analytics sync
- [ ] Test account deletion
- [ ] Admin dashboard accessible
- [ ] Rate limiting active
- [ ] SSL certificate valid
- [ ] DNS configured
- [ ] Monitoring configured
- [ ] Backup strategy in place

## Backup Strategy

### Database Backups

- Daily automated backups
- 30-day retention
- Point-in-time recovery enabled
- Backup restoration tested quarterly

### Media Backups

- Cloudinary has built-in redundancy
- Consider secondary storage for critical media

### Code Backups

- Git repository with proper branching
- Tagged releases
- Disaster recovery plan documented

## Scaling

### Database

- Start with managed PostgreSQL (Neon/Supabase)
- Scale compute as needed
- Add read replicas for analytics queries
- Implement connection pooling

### Application

- Vercel auto-scales
- Configure edge functions for global distribution
- Optimize bundle size
- Implement caching where appropriate

### Background Jobs

- Inngest scales automatically
- Configure job timeouts appropriately
- Monitor queue depth
- Add workers if needed

## Security Hardening

- Enable security headers
- Configure CSP headers
- Implement HSTS
- Regular dependency updates
- Security audits quarterly
- Penetration testing annually

## Rollback Plan

If deployment fails:

1. Revert to previous Vercel deployment
2. Rollback database migrations if needed
3. Restore from backup if data corruption
4. Notify users of downtime
5. Investigate root cause
6. Fix and redeploy

## Support and Maintenance

- Monitor uptime (target: 99.9%)
- Response time SLA: < 200ms p95
- Error rate: < 0.1%
- On-call rotation for critical issues
- Regular maintenance windows
- Changelog for users
