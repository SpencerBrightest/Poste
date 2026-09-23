import { SocialPlatform } from "@prisma/client";
import { decrypt, encrypt } from "@/lib/encryption";
import { logger } from "@/lib/logger";
import { facebookProvider } from "./facebook";
import { twitterProvider } from "./twitter";
import type {
  OAuthTokenResponse,
  PostMetrics,
  PublicationStatus,
  PublishResult,
  SocialAccountInfo,
  SocialPlatformProvider,
} from "./types";

export type OAuthPlatform = "facebook" | "twitter" | "instagram" | "linkedin" | "tiktok" | "snapchat";

type OAuthConfig = {
  platform: OAuthPlatform;
  socialPlatform: SocialPlatform;
  clientIdName: string;
  clientSecretName: string;
  redirectName: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string;
  accountUrl: string;
};

const configs: Record<OAuthPlatform, OAuthConfig> = {
  facebook: {
    platform: "facebook",
    socialPlatform: SocialPlatform.FACEBOOK,
    clientIdName: "FACEBOOK_APP_ID",
    clientSecretName: "FACEBOOK_APP_SECRET",
    redirectName: "FACEBOOK_REDIRECT_URI",
    authorizationUrl: "",
    tokenUrl: "",
    scopes: "",
    accountUrl: "",
  },
  twitter: {
    platform: "twitter",
    socialPlatform: SocialPlatform.X,
    clientIdName: "TWITTER_CLIENT_ID",
    clientSecretName: "TWITTER_CLIENT_SECRET",
    redirectName: "TWITTER_REDIRECT_URI",
    authorizationUrl: "",
    tokenUrl: "",
    scopes: "",
    accountUrl: "",
  },
  instagram: {
    platform: "instagram",
    socialPlatform: SocialPlatform.INSTAGRAM,
    clientIdName: "INSTAGRAM_CLIENT_ID",
    clientSecretName: "INSTAGRAM_CLIENT_SECRET",
    redirectName: "INSTAGRAM_REDIRECT_URI",
    authorizationUrl: "https://www.facebook.com/v22.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v22.0/oauth/access_token",
    scopes: "instagram_basic,instagram_content_publish,pages_show_list",
    accountUrl: "https://graph.instagram.com/me",
  },
  linkedin: {
    platform: "linkedin",
    socialPlatform: SocialPlatform.LINKEDIN,
    clientIdName: "LINKEDIN_CLIENT_ID",
    clientSecretName: "LINKEDIN_CLIENT_SECRET",
    redirectName: "LINKEDIN_REDIRECT_URI",
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    scopes: "openid profile email w_member_social",
    accountUrl: "https://api.linkedin.com/v2/userinfo",
  },
  tiktok: {
    platform: "tiktok",
    socialPlatform: SocialPlatform.TIKTOK,
    clientIdName: "TIKTOK_CLIENT_KEY",
    clientSecretName: "TIKTOK_CLIENT_SECRET",
    redirectName: "TIKTOK_REDIRECT_URI",
    authorizationUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scopes: "user.info.basic,video.publish",
    accountUrl: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url",
  },
  snapchat: {
    platform: "snapchat",
    socialPlatform: SocialPlatform.SNAPCHAT,
    clientIdName: "SNAPCHAT_CLIENT_ID",
    clientSecretName: "SNAPCHAT_CLIENT_SECRET",
    redirectName: "SNAPCHAT_REDIRECT_URI",
    authorizationUrl: "https://accounts.snapchat.com/accounts/oauth2/auth",
    tokenUrl: "https://accounts.snapchat.com/login/oauth2/access_token",
    scopes: "snapchat.profile snapchat.ads.manage",
    accountUrl: "https://kit.snapchat.com/v1/me",
  },
};

function setting(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing OAuth configuration: ${name}`);
  return value;
}

async function responseData(response: Response): Promise<Record<string, unknown>> {
  const data = await response.json();
  if (!response.ok || data.error) {
    const error = data.error as { message?: string } | undefined;
    throw new Error(error?.message ?? data.error_description ?? "OAuth request failed");
  }
  return data;
}

export class ConfiguredOAuthProvider implements SocialPlatformProvider {
  private readonly config: OAuthConfig;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor(platform: OAuthPlatform) {
    this.config = configs[platform];
    this.clientId = setting(this.config.clientIdName);
    this.clientSecret = setting(this.config.clientSecretName);
    this.redirectUri = setting(
      this.config.redirectName,
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/${platform}/callback`
    );
  }

  getPlatformType(): SocialPlatform { return this.config.socialPlatform; }
  getMaxMediaCount(): number { return 1; }
  getSupportedMediaTypes(): Array<"IMAGE" | "VIDEO"> { return ["IMAGE", "VIDEO"]; }

  async getAuthorizationUrl(state: string): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      state,
      scope: this.config.scopes,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async handleOAuthCallback(code: string, _state: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
      grant_type: "authorization_code",
    });
    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await responseData(response);
    const accessToken = setting("OAuth access token", String(data.access_token ?? ""));

    return {
      accessToken: encrypt(accessToken),
      refreshToken: typeof data.refresh_token === "string" ? encrypt(data.refresh_token) : undefined,
      expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
      tokenType: typeof data.token_type === "string" ? data.token_type : undefined,
    };
  }

  async refreshToken(refreshToken: string): Promise<OAuthTokenResponse> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: decrypt(refreshToken),
      grant_type: "refresh_token",
    });
    const data = await responseData(await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }));
    return {
      accessToken: encrypt(setting("OAuth refreshed access token", String(data.access_token ?? ""))),
      refreshToken: typeof data.refresh_token === "string" ? encrypt(data.refresh_token) : refreshToken,
      expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
      tokenType: typeof data.token_type === "string" ? data.token_type : undefined,
    };
  }

  async revokeAccessToken(accessToken: string): Promise<void> {
    logger.info("OAuth token revocation requested", { platform: this.config.platform });
    await fetch(`${this.config.tokenUrl}?access_token=${encodeURIComponent(decrypt(accessToken))}`, { method: "DELETE" });
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    const data = await responseData(await fetch(this.config.accountUrl, {
      headers: { Authorization: `Bearer ${decrypt(accessToken)}` },
    }));
    const id = String(data.id ?? data.sub ?? data.open_id ?? "");
    const name = String(data.name ?? data.display_name ?? data.localizedFirstName ?? id);
    if (!id) throw new Error(`Unable to identify ${this.config.platform} account`);
    return { platformAccountId: id, username: name, displayName: name, profileImageUrl: typeof data.picture === "string" ? data.picture : undefined };
  }

  async publishPost(_params: { accessToken: string; content: string; hashtags: string[]; media?: Array<{ url: string; type: string }> }): Promise<PublishResult> {
    return { success: false, error: `${this.config.platform} publishing requires a platform-specific media publishing workflow.` };
  }

  async reconcilePublication(_externalPostId: string, _accessToken: string): Promise<PublicationStatus> { return { status: "failed" }; }
  async getPostMetrics(_externalPostId: string, _accessToken: string): Promise<PostMetrics> { throw new Error(`${this.config.platform} metrics are not implemented yet.`); }
}

export function getOAuthProvider(platform: string): SocialPlatformProvider {
  if (!(platform in configs)) throw new Error(`Unsupported OAuth platform: ${platform}`);
  if (platform === "facebook") return facebookProvider;
  if (platform === "twitter") return twitterProvider;
  return new ConfiguredOAuthProvider(platform as OAuthPlatform);
}
