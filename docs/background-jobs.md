# Background Jobs Documentation

## Overview

This document describes the background job system using Inngest for durable, reliable task execution.

## Job Types

### 1. Publish Scheduled Post

Triggers when a scheduled post reaches its publication time.

**Flow:**
1. Load ScheduledPost by ID
2. Verify organization and ownership
3. Check current status (must be PENDING)
4. Check social account and token validity
5. Atomically transition status: PENDING → PUBLISHING
6. Call social platform API to publish
7. On success: PUBLISHING → PUBLISHED, store external post ID
8. On failure: classify error, retry or mark FAILED
9. Notify user of result

**Idempotency:** Uses ScheduledPost ID as idempotency key. Checks status before publishing.

**Retry Logic:**
- Retryable errors: exponential backoff, max 5 retries
- Non-retryable errors: fail immediately
- Token expiry: mark account EXPIRED, post FAILED

### 2. Sync Post Analytics

Periodically fetches analytics for published posts.

**Schedule:**
- First 3 days: every 6 hours
- Days 4-30: daily
- After 30 days: weekly

**Flow:**
1. Query published posts needing sync
2. Fetch metrics from platform API
3. Store in PostAnalytics
4. Calculate engagement rates
5. Trigger AI insight generation if sufficient data

### 3. Process Account Deletion

Handles permanent deletion after grace period expires.

**Flow:**
1. Verify grace period has expired
2. Anonymize/delete user data
3. Purge media from storage
4. Clean dependent records
5. Preserve billing records per retention policy
6. Mark deletion complete

### 4. Send Notification

Delivers notifications via email and in-app.

**Flow:**
1. Load notification
2. Determine delivery channels
3. Send email via EmailProvider
4. Mark in-app notification as read/unread
5. Update delivery status

### 5. Process Stripe Webhook

Handles Stripe billing events.

**Flow:**
1. Verify webhook signature
2. Parse event type
3. Update subscription status
4. Handle payment failures
5. Sync usage limits
6. Notify user of changes

## Idempotency

All jobs use idempotency keys:

- Publish: `scheduled-post-{id}`
- Analytics: `analytics-{postId}-{platform}-{date}`
- Deletion: `deletion-{requestId}`
- Webhook: `webhook-{provider}-{eventId}`

Jobs check if already processed before executing.

## Failure Handling

### Retryable Failures
Handled with exponential backoff:
- Initial: 1s
- Max: 5 minutes
- Multiplier: 2
- Jitter: ±20%

### Non-Retryable Failures
Fail immediately with specific error:
- Invalid input
- Authorization failure
- Resource not found
- Permanent service rejection

### Dead Letter Queue
Jobs that fail after max retries are sent to DLQ for manual inspection.

## Concurrency Control

Critical jobs use database-level locking:

```sql
UPDATE ScheduledPost
SET status = 'PUBLISHING'
WHERE id = ? AND status = 'PENDING'
```

Only the worker that successfully updates the row continues.

## Observability

Each job logs:
- Job ID and type
- Input parameters
- Start time
- Success/failure status
- Error details (sanitized)
- Duration
- Retry count

## Testing

Critical tests:
- Duplicate job trigger (should only publish once)
- Worker crash during API call (should reconcile)
- Token expiry during scheduled post
- Rate limit handling
- Webhook duplicate delivery

## Configuration

Job settings in environment:
- `INNGEST_SIGNING_KEY` - Job signature verification
- `INNGEST_EVENT_KEY` - Job submission
- `INNGEST_APP_URL` - Inngest dashboard
- Job timeouts and retry limits per job type
