import { ConfiguredOAuthProvider } from "./oauth";
import { decrypt, encrypt } from "@/lib/encryption";
import { logger } from "@/lib/logger";
import type { OAuthTokenResponse, SocialAccountInfo } from "./types";

const tokenUrl = "https://open.tiktokapis.com/v2/oauth/token/";
const accountUrl = "https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url";

/**
 * Parse a TikTok user-info response which nests the user under
 * `{ data: { user: { open_id, display_name, avatar_url } } }`.
 * Pure function so it can be unit-tested without network access.
 */
export function parseTikTokAccount(data: Record<string, unknown>): SocialAccountInfo {
  const nested = data.data as { user?: Record<string, unknown> } | undefined;
  const user = nested?.user ?? (data.user as Record<string, unknown> | undefined);
  const openId =
    (typeof user?.open_id === "string" && user.open_id) ||
    (typeof data.open_id === "string" && data.open_id) ||
    "";
  if (!openId) throw new Error("Unable to identify tiktok account");
  const name = (typeof user?.display_name === "string" && user.display_name) || openId;
  const avatar = typeof user?.avatar_url === "string" ? user.avatar_url : undefined;
  return { platformAccountId: openId, username: name, displayName: name, profileImageUrl: avatar };
}

function tiktokError(data: Record<string, unknown>): string | undefined {
  const error = data.error as { code?: unknown; message?: unknown } | undefined;
  if (!error) return undefined;
  // TikTok returns `{ error: { code: "ok", ... } }` on success.
  if (error.code === "ok") return undefined;
  return typeof error.message === "string" && error.message ? error.message : "TikTok API request failed";
}

class TikTokProvider extends ConfiguredOAuthProvider {
  constructor() {
    super("tiktok");
  }

  async handleOAuthCallback(code: string, _state: string): Promise<OAuthTokenResponse> {
    // TikTok's token endpoint expects `client_key` (not `client_id`), so the
    // generic exchange in ConfiguredOAuthProvider cannot be reused here.
    const clientKey = process.env.TIKTOK_CLIENT_KEY ?? "";
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET ?? "";
    const redirectUri =
      process.env.TIKTOK_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/tiktok/callback`;
    if (!clientKey) throw new Error("Missing OAuth configuration: TIKTOK_CLIENT_KEY");
    if (!clientSecret) throw new Error("Missing OAuth configuration: TIKTOK_CLIENT_SECRET");

    try {
      const body = new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      });
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const data = (await response.json()) as Record<string, unknown>;
      const failure = !response.ok ? "TikTok token exchange failed" : tiktokError(data);
      if (failure) throw new Error(failure);
      const accessToken = String(data.access_token ?? "");
      if (!accessToken) throw new Error("TikTok did not return an access token");

      return {
        accessToken: encrypt(accessToken),
        refreshToken: typeof data.refresh_token === "string" ? encrypt(data.refresh_token) : undefined,
        expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
        tokenType: typeof data.token_type === "string" ? data.token_type : undefined,
      };
    } catch (error) {
      logger.error("TikTok OAuth callback failed", error);
      throw new Error("TikTok OAuth callback failed");
    }
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    const response = await fetch(accountUrl, {
      headers: { Authorization: `Bearer ${decrypt(accessToken)}` },
    });
    const data = (await response.json()) as Record<string, unknown>;
    const failure = !response.ok ? "TikTok user info request failed" : tiktokError(data);
    if (failure) throw new Error(failure);
    return parseTikTokAccount(data);
  }
}

/** TikTok OAuth provider used by the named TikTok API routes. */
export function createTikTokProvider() {
  return new TikTokProvider();
}

export const getTikTokProvider = createTikTokProvider;
