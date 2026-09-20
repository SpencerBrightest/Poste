# Security Documentation

## Overview

This document describes the security model and practices for the AI-powered Social Media Management SaaS.

## Authentication

### Clerk Integration
- Clerk handles user authentication
- Server-side session validation on every protected request
- JWT tokens verified using Clerk SDK
- Session expiration enforced

### Role-Based Access Control

Three roles:
- **VISITOR** - Unauthenticated, can only access public pages
- **USER** - Authenticated customer, can access their organization's data
- **ADMIN** - Platform staff, can access admin dashboard

Role assignment:
- Normal registration always assigns USER role
- Admin role assigned manually via database
- Role never trusted from client

## Authorization

### Server-Side Verification

Every protected operation verifies:
1. Authenticated session (Clerk)
2. Organization membership
3. Resource ownership
4. Role-based permissions

### Organization Isolation

- All customer data scoped to Organization
- Foreign key constraints enforce isolation
- Queries always filter by organization ID
- Direct URL manipulation tested and blocked

### Route Protection

- Middleware protects dashboard and admin routes
- Server Actions check authorization before execution
- API routes verify Clerk session
- Admin routes have additional role checks

## Data Protection

### Encryption at Rest

- OAuth tokens: AES-256-GCM encryption
- Encryption keys in environment variables
- Keys rotated periodically
- Never store plaintext tokens

### Secrets Management

- Never hard-code secrets
- All secrets in environment variables
- `.env.example documents required variables
- Secrets validated at startup
- Never log secrets

### Sensitive Data Never Exposed to Browser

- AI API keys
- Stripe secret keys
- OAuth access tokens
- OAuth refresh tokens
- Database credentials
- Encryption keys

## Input Validation

### Zod Schemas

All inputs validated with Zod schemas:
- API request bodies
- Server Action parameters
- Form submissions
- Query parameters

### SQL Injection Prevention

- Prisma ORM prevents SQL injection
- Parameterized queries only
- Never concatenate user input into queries

### XSS Prevention

- React auto-escapes by default
- DOMPurify for user-generated content
- Content Security Policy headers
- Trusted types for dynamic content

## API Security

### Rate Limiting

Two layers:
1. **Technical rate limits** - Protect APIs from abuse
2. **Plan quotas** - Enforce subscription limits

Implementation:
- Redis-based rate limiting
- Per-user and per-endpoint limits
- Sliding window algorithm
- 429 responses with Retry-After header

### CORS

- Configured for production domain
- Strict origin validation
- Credentials not allowed for public endpoints

### Webhook Verification

- Stripe webhooks: signature verification
- Social platform webhooks: HMAC verification
- Replay attack prevention
- Idempotent processing

## Session Security

- Secure, HttpOnly cookies
- SameSite=Strict
- CSRF protection via Clerk
- Session expiration
- Secure token generation for password reset

## OAuth Security

- State parameter to prevent CSRF
- PKCE where supported
- Token storage encrypted
- Refresh token rotation
- Token revocation on account deletion

## Background Job Security

- Jobs verify organization ownership
- Jobs check resource existence
- Idempotency prevents duplicate execution
- Sensitive data never logged
- Job signatures verified

## Admin Security

### Admin Access Control

- Server-side role check on every admin operation
- Normal users receive 404 for /admin routes
- Admin cannot view raw OAuth tokens
- Admin cannot impersonate users
- Admin cannot publish on behalf of users

### Admin Operations

Admin can:
- View platform statistics
- View users and subscriptions
- Inspect failed jobs
- Cancel problematic jobs

Admin cannot:
- Access user secrets
- Modify user data directly
- Bypass authorization
- View raw tokens

## Account Deletion Security

### Deletion Workflow

1. User requests deletion
2. Account marked as deletion-pending
3. Access immediately deactivated
4. OAuth tokens revoked
5. Pending jobs cancelled
6. Stripe subscription cancelled
7. Grace period (30 days, configurable)
8. Permanent deletion after grace period
9. Media purged from storage
10. Billing records retained per policy

### Recovery

- Recovery possible during grace period
- After grace period: permanent
- Legal retention for billing records

## Logging and Monitoring

### What to Log

- Authentication failures
- Authorization failures
- OAuth errors
- AI failures
- Publishing attempts
- Rate limit violations
- Subscription events
- Account deletion
- Background job failures

### What NOT to Log

- Passwords
- Access tokens
- Refresh tokens
- API keys
- Encryption keys
- Sensitive personal data

### Log Security

- Structured logging
- Correlation IDs
- Sanitized error messages
- Secure log storage
- Log retention policy

## Compliance

### Data Retention

- User data: 30 days after deletion request
- Analytics: 90 days
- Billing records: 7 years (legal requirement)
- Logs: 30 days

### Privacy

- GDPR-compliant deletion
- Data export on request
- Clear privacy policy
- Cookie consent

## Security Testing

Regular testing for:
- Organization isolation
- SQL injection
- XSS
- CSRF
- Rate limiting
- OAuth flow
- Admin authorization
- Account deletion
- Background job idempotency

## Incident Response

Plan for:
- Data breach
- Credential compromise
- OAuth token leak
- API abuse
- DDoS attack
