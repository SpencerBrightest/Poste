import { SocialPlatform } from "@prisma/client";
import type { SocialPlatformProvider, OAuthTokenResponse, SocialAccountInfo, PublishResult, PublicationStatus, PostMetrics } from "./types";
import { logger } from "@/lib/logger";
import { encrypt, decrypt } from "@/lib/encryption";
import { codeChallengeFromVerifier, generateCodeVerifier } from "./pkce";

export class TwitterProvider implements SocialPlatformProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TWITTER_CLIENT_ID || "";
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET || "";
    this.redirectUri =
      process.env.TWITTER_CALLBACK_URL ||
      process.env.TWITTER_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/twitter/callback`;
  }

  getPlatformType(): SocialPlatform {
    return SocialPlatform.X;
  }

  getMaxMediaCount(): number {
    return 4;
  }

  getSupportedMediaTypes(): Array<"IMAGE" | "VIDEO"> {
    return ["IMAGE", "VIDEO"];
  }

  async getAuthorizationUrl(state: string, codeChallenge?: string): Promise<string> {
    // S256 PKCE: the caller (oauth-routes) generates the verifier, stores it in
    // an httpOnly cookie, and passes the derived challenge here. Fall back to a
    // fresh pair only for direct callers that manage the verifier themselves.
    const challenge = codeChallenge ?? codeChallengeFromVerifier(generateCodeVerifier());
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "tweet.read tweet.write users.read offline.access",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  async handleOAuthCallback(code: string, state: string, codeVerifier?: string): Promise<OAuthTokenResponse> {
    if (!codeVerifier) {
      throw new Error("Missing PKCE code_verifier for Twitter OAuth callback");
    }
    try {
      const response = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      const tokenData = await response.json();

      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      // Get user info
      const userResponse = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      logger.info("Twitter OAuth completed", { platformAccountId: userData.data.id });

      return {
        accessToken: encrypt(tokenData.access_token),
        refreshToken: encrypt(tokenData.refresh_token),
        expiresIn: tokenData.expires_in,
        tokenType: tokenData.token_type,
      };
    } catch (error) {
      logger.error("Twitter OAuth callback failed", error);
      throw new Error("Twitter OAuth callback failed");
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    try {
      const decryptedToken = decrypt(refreshToken);

      const response = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: decryptedToken,
          client_id: this.clientId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      logger.info("Twitter token refreshed");

      return {
        accessToken: encrypt(data.access_token),
        refreshToken: encrypt(data.refresh_token),
        expiresIn: data.expires_in,
        tokenType: data.token_type,
      };
    } catch (error) {
      logger.error("Failed to refresh Twitter token", error);
      throw new Error("Failed to refresh token");
    }
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    try {
      const decryptedToken = decrypt(accessToken);
      await fetch("https://api.twitter.com/2/oauth2/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          token: decryptedToken,
          client_id: this.clientId,
        }),
      });
      logger.info("Twitter token revoked");
    } catch (error) {
      logger.error("Failed to revoke Twitter token", error);
    }
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    try {
      const decryptedToken = decrypt(accessToken);

      const response = await fetch("https://api.twitter.com/2/users/me?user.fields=public_metrics,profile_image_url", {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch account info");
      }

      return {
        platformAccountId: data.data.id,
        username: data.data.username,
        displayName: data.data.name,
        profileImageUrl: data.data.profile_image_url,
        followersCount: data.data.public_metrics.followers_count,
      };
    } catch (error) {
      logger.error("Failed to fetch Twitter account info", error);
      throw new Error("Failed to fetch account info");
    }
  }

  async publishPost(params: {
    accessToken: string;
    content: string;
    hashtags: string[];
    media?: Array<{ url: string; type: string }>;
  }): Promise<PublishResult> {
    try {
      const decryptedToken = decrypt(params.accessToken);

      const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: params.content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `Twitter API error: ${data.detail}`,
          errorDetails: data,
        };
      }

      logger.info("Tweet published", { platformPostId: data.data.id });

      return {
        success: true,
        externalPostId: data.data.id,
        publishedAt: new Date(),
      };
    } catch (error) {
      logger.error("Failed to publish tweet", error);
      return {
        success: false,
        error: "Failed to publish tweet",
      };
    }
  }

  async reconcilePublication(externalPostId: string, accessToken: string): Promise<PublicationStatus> {
    try {
      const decryptedToken = decrypt(accessToken);

      const response = await fetch(`https://api.twitter.com/2/tweets/${externalPostId}`, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      if (response.status === 404) {
        return { status: "not_found" };
      }

      if (!response.ok) {
        return { status: "failed" };
      }

      const data = await response.json();

      return {
        status: "published",
        externalPostId,
        publishedAt: new Date(data.data.created_at),
      };
    } catch (error) {
      logger.error("Failed to reconcile publication", error);
      return { status: "failed" };
    }
  }

  async getPostMetrics(externalPostId: string, accessToken: string): Promise<PostMetrics> {
    try {
      const decryptedToken = decrypt(accessToken);

      const response = await fetch(`https://api.twitter.com/2/tweets/${externalPostId}?tweet.fields=public_metrics`, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch post metrics");
      }

      const metrics = data.data.public_metrics;

      return {
        likes: metrics.like_count,
        comments: metrics.reply_count,
        shares: metrics.retweet_count,
        reach: metrics.impression_count,
        impressions: metrics.impression_count,
      };
    } catch (error) {
      logger.error("Failed to fetch post metrics", error);
      throw new Error("Failed to fetch post metrics");
    }
  }
}

export const twitterProvider = new TwitterProvider();
