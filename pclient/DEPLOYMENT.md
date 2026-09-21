# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account
- Stripe account
- Inngest account
- Clerk account
- Google AI API key

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in all required environment variables in `.env`

## Database Setup

1. Generate Prisma client:
```bash
npm run db:generate
```

2. Push schema to database:
```bash
npm run db:push
```

3. Run seed script (optional):
```bash
npm run db:seed
```

## Build Application

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Background Jobs (Inngest)

1. Start Inngest dev server locally:
```bash
npx inngest-cli dev
```

2. For production, deploy the Inngest serve function:
```bash
npx inngest-cli serve
```

## Webhook Endpoints

Configure the following webhooks:

- **Stripe**: `https://your-domain.com/api/stripe/webhook`
- **Clerk**: `https://your-domain.com/api/auth/clerk/webhook`

## Deployment Platforms

### Vercel

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
docker build -t poste .
docker run -p 3000:3000 --env-file .env poste
```

## Monitoring

- Application logs: Use structured logging (Winston)
- Database: Prisma Studio for local development
- Background jobs: Inngest dashboard
- Error tracking: Consider adding Sentry

## Security Checklist

- [ ] All environment variables are set
- [ ] Database connection is secure (SSL)
- [ ] API keys are not exposed to client
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Webhook signatures are verified
- [ ] HTTPS is enabled in production
- [ ] Database backups are configured
