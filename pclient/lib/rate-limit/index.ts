// Rate limiting implementation
// Note: In production, use Redis for distributed rate limiting
// For development, we use an in-memory store

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitStore>();

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request is within rate limits
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number = 60000 // Default 1 minute
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  // Reset if window has expired
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(identifier, entry);
  }

  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  // Increment counter
  entry.count++;

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Reset rate limit for an identifier
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [identifier, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(identifier);
    }
  }
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // API endpoints
  API_GENERAL: { limit: 100, windowMs: 60000 }, // 100 requests per minute
  API_AI_GENERATE: { limit: 20, windowMs: 60000 }, // 20 AI generations per minute
  API_PUBLISH: { limit: 10, windowMs: 60000 }, // 10 publish requests per minute
  
  // Webhooks
  WEBHOOK_STRIPE: { limit: 100, windowMs: 60000 },
  WEBHOOK_SOCIAL: { limit: 100, windowMs: 60000 },
  
  // Authentication
  AUTH_LOGIN: { limit: 5, windowMs: 60000 }, // 5 login attempts per minute
  AUTH_REGISTER: { limit: 3, windowMs: 3600000 }, // 3 registrations per hour
} as const;
