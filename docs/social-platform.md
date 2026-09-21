# Social Platform Integration Documentation

## Overview

This document describes the social platform provider architecture for integrating with social media APIs.

## Provider Interface

The `SocialPlatformProvider` interface defines the contract for all social platform integrations:

```typescript
interface SocialPlatformProvider {
  // OAuth flow
  getAuthorizationUrl(state: string): Promise<string>;
  handleOAuthCallback(code: string, state: string): Promise<OAuthTokenResponse>;
  
  // Token management
  refreshToken(refreshToken: string): Promise<OAuthTokenResponse>;
  revokeAccessToken(accessToken: string): Promise<void>;
  
  // Account operations
  getAccount(accessToken: string): Promise<SocialAccountInfo>;
  
  // Publishing
  publishPost(accessToken: string, post: Post, media?: Media[]): Promise<PublishResult>;
  reconcilePublication(externalPostId: string): Promise<PublicationStatus>;
  
  // Analytics
  getPostMetrics(accessToken: string, externalPostId: string): Promise<PostMetrics>;
  
  // Platform metadata
  getPlatformType(): PlatformType;
  getMaxMediaCount(): number;
  getSupportedMediaTypes(): MediaType[];
}
```

## Platform Types

- `X` (Twitter/X)
- `LINKEDIN`
- `INSTAGRAM`
- `FACEBOOK`
- `TIKTOK`

## MVP Platform

The MVP supports **X (Twitter)** as the first real platform integration.

## Token Storage

OAuth tokens are:
- Encrypted at rest using AES-256-GCM
- Never sent to the browser
- Stored in `SocialAccount` table
- Refresh tokens stored separately for security

## OAuth Flow

1. User clicks "Connect Account"
2. Server generates secure state token
3. Server redirects to platform authorization URL
4. User authorizes on platform
5. Platform redirects to our callback endpoint
6. Server validates state
7. Server exchanges authorization code for tokens
8. Server encrypts and stores tokens
9. Server returns safe account info to browser

## Token Expiry Handling

When a scheduled post reaches publication time and the token is expired:

1. Detect expiry during worker execution
2. Mark `SocialAccount.status = EXPIRED`
3. Mark `ScheduledPost.status = FAILED`
4. Record failure reason: "Reconnect required"
5. Send notification to user
6. Do not retry

## Error Classification

### Retryable Errors
- Network timeout
- Temporary 5xx errors
- 429 rate limit (with backoff)
- Transient provider failures

### Non-Retryable Errors
- Expired/revoked token (401)
- Invalid credentials (403)
- Policy/content rejection
- Malformed request (400)
- Permanent resource not found (404)

## Rate Limit Handling

- Respect `Retry-After` headers
- Implement exponential backoff with jitter
- Track rate limit state per account
- Notify user when approaching limits

## Mock Provider

A `MockSocialProvider` exists for development without real credentials. It simulates:
- Successful OAuth flow
- Token expiry scenarios
- Rate limiting
- Publishing success/failure
- Duplicate trigger detection
- Permanent platform rejection

## Adding New Platforms

To add a new platform:

1. Create `lib/social/[platform]/provider.ts`
2. Implement `SocialPlatformProvider` interface
3. Add platform type to enum
4. Update OAuth callback handler
5. Add platform-specific configuration
6. Test with mock provider first
7. Test with real credentials

## Security

- Never expose tokens to client
- Validate OAuth state to prevent CSRF
- Use PKCE where supported
- Encrypt tokens at rest
- Rotate refresh tokens when possible
- Revoke tokens on account deletion
