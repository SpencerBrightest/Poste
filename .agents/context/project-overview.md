# Poste

## Overview

Poste is an AI-powered social media management SaaS built for creators, freelancers, and small businesses, with a genuine African-market angle (starting from a University of Bamenda student-focused origin). It helps users generate, optimize, schedule, publish, and analyze social media content in one workflow, with an AI advisor that recommends what and when to post based on niche and real engagement data.

## Goals

1. Let authenticated users manage their social media presence from one dashboard.
2. Provide AI-assisted content creation and optimization before publishing.
3. Let users schedule and publish posts across connected social platforms.
4. Track real engagement analytics per platform and surface actionable insights.
5. Recommend content type and posting time via an AI advisor, using niche data plus the user's own performance history.
6. Support a referral/affiliate program and sale of the user's own digital products (v2).
7. Support local payment methods (mobile money via Campay) alongside international payment (Stripe) for monetization.

## Core User Flow

1. User signs up (optionally with a referral code) and logs in.
2. User connects a social account (Instagram/Facebook) via OAuth.
3. User sets their niche during onboarding.
4. User schedules a post; the AI advisor suggests content ideas and best posting time.
5. Scheduled posts publish to the connected platform.
6. A background job periodically pulls fresh engagement data (Graph API) and stores snapshots.
7. Analytics dashboard shows growth trends, engagement rate, and best-performing times.
8. User can upgrade their plan via mobile money (Campay) or card (Stripe).
9. User can share their referral link and earn credit/cash when referred users subscribe.

## Features

### Authentication and Users
- Sign up, login, forgot/reset password.
- Role-based access: student/user vs admin.
- JWT-based session handling; passwords hashed with bcrypt, never stored or viewable in plaintext.

### Scheduler
- Create, edit, delete scheduled posts.
- Platform selector (Instagram/Facebook).
- AI-suggested best time to post, auto-filled per niche and account history.

### Analytics
- Follower growth chart, engagement rate chart over time.
- Best-performing post times and top posts list.
- Data refreshed via a periodic background job (polling the Graph API), not true real-time.

### AI Advisor
- Niche-based general recommendations (static lookup table) as the baseline.
- Personalized recommendations once enough real post/engagement data exists.
- LLM-generated content ideas and timing advice based on niche + performance summary.

### Referrals (v2)
- Unique referral code/link per user.
- Tracks referred signups and logs commission when a referred user pays.

### Digital Products (v2)
- Users can sell their own digital products (e.g. PDFs) inside the same dashboard.

### Billing
- Free / Pro / Business tiers with usage limits.
- Mobile money payment (Campay: MTN MoMo, Orange Money) for local users.
- Stripe for international card payments.

### Admin
- View/manage all users, suspend/activate accounts.
- View transactions and basic platform usage stats.
- Admin actions should be logged for accountability.

## Scope

### In Scope
- Authentication and route protection (public vs protected pages)
- Post scheduling and one initial social platform integration for MVP
- Analytics based on periodic data snapshots
- AI advisor (niche lookup table first, then personalized, then LLM-generated)
- Mobile money payment integration (Campay) as the first payment method
- Admin user/transaction management
- Dark/light theme support across the whole app

### Out of Scope (for now)
- Fake followers/engagement of any kind — explicitly ruled out
- True real-time data (webhooks requiring Meta app review) — deferred past MVP
- Full affiliate marketplace as a standalone product — affiliate features stay layered inside this app, not a separate platform
- International payment (Stripe) until local payment flow is proven
- AWS/cloud infrastructure beyond Vercel + managed Postgres — not needed since there are no image uploads in MVP scope

## Success Criteria

1. A user can sign up, log in, and reach a working dashboard.
2. A user can connect one social account and schedule a post.
3. Real engagement data is pulled and displayed on the analytics page.
4. The AI advisor gives at least niche-based recommendations at launch.
5. A user can upgrade their plan via mobile money and have it reflected immediately after webhook confirmation.
6. The app is usable and demoable to real students at University of Bamenda.
