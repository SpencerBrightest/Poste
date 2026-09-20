import { SocialPlatform, SocialAccountStatus } from "@prisma/client";
import type { SocialProvider } from "./types";
import { logger } from "@/lib/logger";
import { encrypt, decrypt } from "@/lib/encryption";

export class TwitterProvider implements SocialProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.TWITTER_CLIENT_ID || "";
    this.clientSecret = process.env.TWITTER_CLIENT_SECRET || "";
    this.redirectUri = process.env.TWITTER_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`;
  }

  async initiateOAuth(organizationId: string): Promise<{ authUrl: string; state: string }> {
    const state = Buffer.from(JSON.stringify({ organizationId })).toString("base64");
    
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "tweet.read tweet.write users.read offline.access",
      state,
      code_challenge: this.generateCodeChallenge(),
      code_challenge_method: "plain",
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

    logger.info("Twitter OAuth initiated", { organizationId });

    return { authUrl, state };
  }

  async handleCallback(code: string, state: string): Promise<{
    platformAccountId: string;
    username: string;
    displayName: string;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const { organizationId } = JSON.parse(Buffer.from(state, "base64").toString());

      // Exchange code for access token
      const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          client_id: this.clientId,
          redirect_uri: this.redirectUri,
          code_verifier: this.generateCodeChallenge(),
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenResponse.ok) {
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

      const platformAccountId = userData.data.id;
      const username = userData.data.username;
      const displayName = userData.data.name;

      // Encrypt tokens
      const accessToken = encrypt(tokenData.access_token);
      const refreshToken = encrypt(tokenData.refresh_token);

      logger.info("Twitter OAuth completed", { platformAccountId, username });

      return {
        platformAccountId,
        username,
        displayName,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Twitter OAuth callback failed", error);
      throw new Error("Twitter OAuth callback failed");
    }
  }

  async publishPost(
    content: string,
    mediaUrls: string[],
    accessToken: string
  ): Promise<{ platformPostId: string; publishedAt: Date }> {
    try {
      const decryptedToken = decrypt(accessToken);

      // Create tweet
      const response = await fetch("https://api.twitter.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Twitter API error: ${data.detail}`);
      }

      logger.info("Tweet published", { platformPostId: data.data.id });

      return {
        platformPostId: data.data.id,
        publishedAt: new Date(),
      };
    } catch (error) {
      logger.error("Failed to publish tweet", error);
      throw new Error("Failed to publish tweet");
    }
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
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

      const accessToken = encrypt(data.access_token);
      const newRefreshToken = encrypt(data.refresh_token);

      logger.info("Twitter token refreshed");

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      logger.error("Failed to refresh Twitter token", error);
      throw new Error("Failed to refresh token");
    }
  }

  async getAccountInfo(accessToken: string): Promise<{
    platformAccountId: string;
    username: string;
    displayName: string;
    followersCount: number;
  }> {
    try {
      const decryptedToken = decrypt(accessToken);

      const response = await fetch("https://api.twitter.com/2/users/me?user.fields=public_metrics", {
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
        followersCount: data.data.public_metrics.followers_count,
      };
    } catch (error) {
      logger.error("Failed to fetch Twitter account info", error);
      throw new Error("Failed to fetch account info");
    }
  }

  private generateCodeChallenge(): string {
    return Math.random().toString(36).substring(2);
  }
}

export const twitterProvider = new TwitterProvider();
