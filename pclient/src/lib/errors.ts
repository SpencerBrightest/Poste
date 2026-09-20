// Domain-specific error codes and error handling

export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // Authorization errors
  FORBIDDEN = "FORBIDDEN",
  ORGANIZATION_NOT_FOUND = "ORGANIZATION_NOT_FOUND",
  NOT_ORGANIZATION_MEMBER = "NOT_ORGANIZATION_MEMBER",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  RESOURCE_ACCESS_DENIED = "RESOURCE_ACCESS_DENIED",

  // Social platform errors
  SOCIAL_TOKEN_EXPIRED = "SOCIAL_TOKEN_EXPIRED",
  SOCIAL_TOKEN_REVOKED = "SOCIAL_TOKEN_REVOKED",
  SOCIAL_RATE_LIMITED = "SOCIAL_RATE_LIMITED",
  SOCIAL_API_ERROR = "SOCIAL_API_ERROR",
  SOCIAL_CONNECTION_FAILED = "SOCIAL_CONNECTION_FAILED",

  // AI errors
  AI_QUOTA_EXCEEDED = "AI_QUOTA_EXCEEDED",
  AI_API_ERROR = "AI_API_ERROR",
  AI_GENERATION_FAILED = "AI_GENERATION_FAILED",

  // Subscription errors
  SUBSCRIPTION_REQUIRED = "SUBSCRIPTION_REQUIRED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  PAYMENT_REQUIRED = "PAYMENT_REQUIRED",

  // Validation errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",

  // Rate limiting
  RATE_LIMITED = "RATE_LIMITED",

  // General errors
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(ErrorCode.UNAUTHORIZED, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(ErrorCode.FORBIDDEN, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(ErrorCode.RESOURCE_NOT_FOUND, message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded") {
    super(ErrorCode.RATE_LIMITED, message, 429);
  }
}

export class SocialTokenExpiredError extends AppError {
  constructor(message: string = "Social connection has expired. Please reconnect.") {
    super(ErrorCode.SOCIAL_TOKEN_EXPIRED, message, 400);
  }
}

export class QuotaExceededError extends AppError {
  constructor(message: string = "You have exceeded your plan quota") {
    super(ErrorCode.QUOTA_EXCEEDED, message, 403);
  }
}

/**
 * Formats an error for API responses
 */
export function formatErrorResponse(error: unknown): {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
} {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred",
      },
    };
  }

  return {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: "An unexpected error occurred",
    },
  };
}
