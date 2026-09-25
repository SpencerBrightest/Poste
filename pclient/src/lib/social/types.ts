import { SocialPlatform } from "@prisma/client";

export interface OAuthTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface SocialAccountInfo {
  platformAccountId: string;
  username: string;
  displayName?: string;
  profileImageUrl?: string;
  followersCount?: number;
}

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  publishedAt?: Date;
  error?: string;
  errorDetails?: Record<string, unknown>;
}

export interface PublicationStatus {
  status: "published" | "failed" | "not_found";
  externalPostId?: string;
  publishedAt?: Date;
}

export interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}

export interface SocialPlatformProvider {
  /**
   * Get the OAuth authorization URL.
   * The optional codeChallenge carries the PKCE S256 challenge for providers
   * (Twitter/X) that require it; other providers ignore it.
   */
  getAuthorizationUrl(state: string, codeChallenge?: string): Promise<string>;

  /**
   * Handle OAuth callback and exchange code for tokens.
   * The optional codeVerifier carries the PKCE verifier for providers
   * (Twitter/X) that require it; other providers ignore it.
   */
  handleOAuthCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthTokenResponse>;

  /**
   * Refresh an expired access token
   */
  refreshToken(refreshToken: string): Promise<OAuthTokenResponse>;

  /**
   * Revoke an access token
   */
  revokeAccessToken(accessToken: string): Promise<void>;

  /**
   * Get account information
   */
  getAccount(accessToken: string): Promise<SocialAccountInfo>;

  /**
   * Publish a post to the platform
   */
  publishPost(params: {
    accessToken: string;
    content: string;
    hashtags: string[];
    media?: Array<{ url: string; type: string }>;
  }): Promise<PublishResult>;

  /**
   * Reconcile publication status (check if post was actually published)
   */
  reconcilePublication(externalPostId: string, accessToken: string): Promise<PublicationStatus>;

  /**
   * Get metrics for a published post
   */
  getPostMetrics(externalPostId: string, accessToken: string): Promise<PostMetrics>;

  /**
   * Get the platform type
   */
  getPlatformType(): SocialPlatform;

  /**
   * Get maximum number of media items allowed per post
   */
  getMaxMediaCount(): number;

  /**
   * Get supported media types
   */
  getSupportedMediaTypes(): Array<"IMAGE" | "VIDEO">;
}
