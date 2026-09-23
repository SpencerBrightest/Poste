import { SocialPlatform } from "@prisma/client";
import { logger } from "@/lib/logger";
import { decrypt, encrypt } from "@/lib/encryption";
import type {
  OAuthTokenResponse,
  PostMetrics,
  PublicationStatus,
  PublishResult,
  SocialAccountInfo,
  SocialPlatformProvider,
} from "./types";

const graphVersion = "v22.0";
const graphUrl = `https://graph.facebook.com/${graphVersion}`;

function requiredSetting(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing Facebook OAuth configuration: ${name}`);
  }

  return value;
}

async function readGraphResponse(response: Response): Promise<Record<string, unknown>> {
  const data = await response.json();

  if (!response.ok || data.error) {
    const error = data.error as { message?: string } | undefined;
    throw new Error(error?.message ?? "Facebook Graph API request failed");
  }

  return data;
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

export class FacebookProvider implements SocialPlatformProvider {
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly redirectUri: string;

  constructor() {
    this.appId = process.env.FACEBOOK_APP_ID ?? "";
    this.appSecret = process.env.FACEBOOK_APP_SECRET ?? "";
    this.redirectUri =
      process.env.FACEBOOK_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/facebook/callback`;
  }

  getPlatformType(): SocialPlatform {
    return SocialPlatform.FACEBOOK;
  }

  getMaxMediaCount(): number {
    return 1;
  }

  getSupportedMediaTypes(): Array<"IMAGE" | "VIDEO"> {
    return ["IMAGE", "VIDEO"];
  }

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: requiredSetting("FACEBOOK_APP_ID", this.appId),
      redirect_uri: this.redirectUri,
      response_type: "code",
      state,
      scope: "public_profile,pages_show_list,pages_read_engagement,pages_manage_posts",
    });

    return `https://www.facebook.com/${graphVersion}/dialog/oauth?${params.toString()}`;
  }

  async handleOAuthCallback(code: string, _state: string): Promise<OAuthTokenResponse> {
    try {
      const params = new URLSearchParams({
        client_id: requiredSetting("FACEBOOK_APP_ID", this.appId),
        client_secret: requiredSetting("FACEBOOK_APP_SECRET", this.appSecret),
        redirect_uri: this.redirectUri,
        code,
      });
      const response = await fetch(`${graphUrl}/oauth/access_token?${params.toString()}`);
      const tokenData = await readGraphResponse(response);
      const userAccessToken = requiredSetting("Facebook access token", String(tokenData.access_token ?? ""));
      const pageParams = new URLSearchParams({
        fields: "id,name,access_token,picture.type(large)",
        access_token: userAccessToken,
      });
      const pagesData = await readGraphResponse(await fetch(`${graphUrl}/me/accounts?${pageParams.toString()}`));
      const pages = pagesData.data as Array<Record<string, unknown>> | undefined;
      const page = pages?.[0];
      const pageAccessToken = requiredSetting("Facebook Page access token", String(page?.access_token ?? ""));

      return {
        accessToken: encrypt(pageAccessToken),
        expiresIn: numberValue(tokenData.expires_in),
        tokenType: stringValue(tokenData.token_type),
      };
    } catch (error) {
      logger.error("Facebook OAuth callback failed", error);
      throw new Error("Facebook OAuth callback failed");
    }
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const params = new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: requiredSetting("FACEBOOK_APP_ID", this.appId),
      client_secret: requiredSetting("FACEBOOK_APP_SECRET", this.appSecret),
      fb_exchange_token: decrypt(refreshToken),
    });
    const response = await fetch(`${graphUrl}/oauth/access_token?${params.toString()}`);
    const data = await readGraphResponse(response);

    return {
      accessToken: encrypt(requiredSetting("Facebook refreshed access token", stringValue(data.access_token))),
      expiresIn: numberValue(data.expires_in),
      tokenType: stringValue(data.token_type),
    };
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    try {
      await fetch(`${graphUrl}/me/permissions?access_token=${encodeURIComponent(decrypt(accessToken))}`, {
        method: "DELETE",
      });
    } catch (error) {
      logger.error("Failed to revoke Facebook token", error);
    }
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    const token = decrypt(accessToken);
    const params = new URLSearchParams({
      fields: "id,name,picture.type(large)",
      access_token: token,
    });
    const data = await readGraphResponse(await fetch(`${graphUrl}/me?${params.toString()}`));

    return {
      platformAccountId: String(data.id),
      username: String(data.name),
      displayName: String(data.name),
      profileImageUrl: String((data.picture as { data?: { url?: string } } | undefined)?.data?.url ?? ""),
    };
  }

  async publishPost(params: {
    accessToken: string;
    content: string;
    hashtags: string[];
    media?: Array<{ url: string; type: string }>;
  }): Promise<PublishResult> {
    try {
      const token = decrypt(params.accessToken);
      const message = [params.content, ...params.hashtags].filter(Boolean).join("\n\n");
      const response = await fetch(`${graphUrl}/me/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, access_token: token }),
      });
      const data = await readGraphResponse(response);

      return { success: true, externalPostId: String(data.id), publishedAt: new Date() };
    } catch (error) {
      logger.error("Failed to publish Facebook post", error);
      return { success: false, error: "Failed to publish Facebook post" };
    }
  }

  async reconcilePublication(_externalPostId: string, _accessToken: string): Promise<PublicationStatus> {
    try {
      const token = decrypt(_accessToken);
      const response = await fetch(`${graphUrl}/${encodeURIComponent(_externalPostId)}?fields=id,created_time&access_token=${encodeURIComponent(token)}`);
      if (response.status === 404) return { status: "not_found" };
      const data = await readGraphResponse(response);
      return { status: "published", externalPostId: String(data.id), publishedAt: new Date(String(data.created_time)) };
    } catch (error) {
      logger.error("Failed to reconcile Facebook publication", error);
      return { status: "failed" };
    }
  }

  async getPostMetrics(_externalPostId: string, _accessToken: string): Promise<PostMetrics> {
    const token = decrypt(_accessToken);
    const params = new URLSearchParams({
      fields: "likes.summary(true),comments.summary(true),shares",
      access_token: token,
    });
    const data = await readGraphResponse(await fetch(`${graphUrl}/${encodeURIComponent(_externalPostId)}?${params.toString()}`));
    return {
      likes: Number((data.likes as { summary?: { total_count?: number } } | undefined)?.summary?.total_count ?? 0),
      comments: Number((data.comments as { summary?: { total_count?: number } } | undefined)?.summary?.total_count ?? 0),
      shares: Number((data.shares as { count?: number } | undefined)?.count ?? 0),
      reach: 0,
      impressions: 0,
    };
  }
}

export const facebookProvider = new FacebookProvider();
