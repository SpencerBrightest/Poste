import { ConfiguredOAuthProvider } from "./oauth";
import { decrypt, encrypt } from "@/lib/encryption";
import { logger } from "@/lib/logger";
import type { OAuthTokenResponse, SocialAccountInfo } from "./types";

const tokenUrl = "https://accounts.snapchat.com/login/oauth2/access_token";
const accountUrl = "https://kit.snapchat.com/v1/me";

/**
 * Parse a Snapchat identity response. Handles both the Login Kit shape
 * `{ data: { me: { externalId, displayName } } }` and the Ads API shape
 * `{ me: { id, displayName|name } }`. Pure function for unit testing.
 */
export function parseSnapchatAccount(data: Record<string, unknown>): SocialAccountInfo {
  const loginKitMe = (data.data as { me?: Record<string, unknown> } | undefined)?.me;
  const adsMe = data.me as Record<string, unknown> | undefined;
  const me = loginKitMe ?? adsMe;
  const id =
    (typeof me?.externalId === "string" && me.externalId) ||
    (typeof me?.id === "string" && me.id) ||
    (typeof data.id === "string" && data.id) ||
    "";
  if (!id) throw new Error("Unable to identify snapchat account");
  const name =
    (typeof me?.displayName === "string" && me.displayName) ||
    (typeof me?.display_name === "string" && me.display_name) ||
    (typeof me?.name === "string" && me.name) ||
    id;
  return { platformAccountId: id, username: name, displayName: name };
}

class SnapchatProvider extends ConfiguredOAuthProvider {
  constructor() {
    super("snapchat");
  }

  async handleOAuthCallback(code: string, _state: string): Promise<OAuthTokenResponse> {
    // Snapchat's token endpoint authenticates the client with HTTP Basic
    // auth (base64 client_id:client_secret), not body credentials.
    const clientId = process.env.SNAPCHAT_CLIENT_ID ?? "";
    const clientSecret = process.env.SNAPCHAT_CLIENT_SECRET ?? "";
    const redirectUri =
      process.env.SNAPCHAT_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/snapchat/callback`;
    if (!clientId) throw new Error("Missing OAuth configuration: SNAPCHAT_CLIENT_ID");
    if (!clientSecret) throw new Error("Missing OAuth configuration: SNAPCHAT_CLIENT_SECRET");

    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      });
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body,
      });
      const data = (await response.json()) as Record<string, unknown>;
      if (!response.ok) {
        const error = data.error as { message?: string } | undefined;
        throw new Error(error?.message ?? "Snapchat token exchange failed");
      }
      const accessToken = String(data.access_token ?? "");
      if (!accessToken) throw new Error("Snapchat did not return an access token");

      return {
        accessToken: encrypt(accessToken),
        refreshToken: typeof data.refresh_token === "string" ? encrypt(data.refresh_token) : undefined,
        expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
        tokenType: typeof data.token_type === "string" ? data.token_type : undefined,
      };
    } catch (error) {
      logger.error("Snapchat OAuth callback failed", error);
      throw new Error("Snapchat OAuth callback failed");
    }
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    const response = await fetch(accountUrl, {
      headers: { Authorization: `Bearer ${decrypt(accessToken)}` },
    });
    const data = (await response.json()) as Record<string, unknown>;
    if (!response.ok) {
      const error = data.error as { message?: string } | undefined;
      throw new Error(error?.message ?? "Snapchat user info request failed");
    }
    return parseSnapchatAccount(data);
  }
}

/** Snapchat OAuth provider used by the named Snapchat API routes. */
export function createSnapchatProvider() {
  return new SnapchatProvider();
}

export const getSnapchatProvider = createSnapchatProvider;
