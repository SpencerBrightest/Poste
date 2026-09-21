# Database Schema Documentation

## Overview

This document describes the PostgreSQL database schema for the AI-powered Social Media Management SaaS.

## Core Entities

### User
Represents a Clerk user. Links Clerk authentication to our system.

### Organization
The primary owner of all customer data. Supports future multi-user organizations.

### SocialAccount
Connected social media accounts (X, LinkedIn, etc.). Stores encrypted OAuth tokens.

### Post
Content created by users. Can be in various states (DRAFT, SCHEDULED, PUBLISHING, PUBLISHED, FAILED).

### Media
Uploaded images/videos associated with posts. Stored in Cloudinary/S3.

### ScheduledPost
Scheduled publication of posts. Used by background workers for publishing.

### PostAnalytics
Engagement metrics for published posts (likes, comments, shares, reach).

### Subscription
User subscription tier and billing information.

### Notification
In-app and email notifications for users.

### BackgroundJobRecord
Tracking of background job execution and failures.

### DeletionRequest
Account deletion workflow tracking with grace period.

## Relationships

```
User
  ↓ (1:1)
Organization [optional - one user can create one org]
  ↓ (1:N)
  ├── SocialAccounts
  ├── Posts
  │     ├── Media
  │     ├── ScheduledPosts
  │     └── PostAnalytics
  ├── Subscriptions
  ├── Notifications
  ├── BackgroundJobRecords
  └── DeletionRequest
```

## Important Indexes

- Organization ID on all customer-owned tables
- Post status + scheduledAt for ScheduledPost queries
- Social account platform + status
- Analytics post ID + timestamp
- Subscription organization ID + status

## Security Considerations

- OAuth tokens encrypted at rest
- Organization isolation enforced via foreign keys
- Cascade deletes configured appropriately
- Soft deletes for audit trail where needed
- Timestamps for all records

## Migration Strategy

All schema changes go through Prisma migrations. Never modify the database directly.

See `prisma/schema.prisma` for the complete schema definition.
