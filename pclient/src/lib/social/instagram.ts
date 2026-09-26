import { ConfiguredOAuthProvider } from "./oauth";
import { decrypt, encrypt } from "@/lib/encryption";
import { logger } from "@/lib/logger";
import type { OAuthTokenResponse, SocialAccountInfo } from "./types";

const graphVersion = "v22.0";
const graphUrl = `https://graph.facebook.com/${graphVersion}`;

function requiredSetting(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing Instagram OAuth configuration: ${name}`);
  return value;
}

async function readGraphResponse(response: Response): Promise<Record<string, unknown>> {
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok || data.error) {
    const error = data.error as { message?: string } | undefined;
    throw new Error(error?.message ?? "Instagram Graph API request failed");
  }
  return data;
}

/**
 * Find the first Facebook Page with a linked Instagram Business account.
 * Pure function so it can be unit-tested without network access.
 */
export function parseInstagramBusinessId(pagesData: Record<string, unknown>): {
  pageId: string;
  instagramBusinessId: string;
} {
  const pages = pagesData.data as Array<Record<string, unknown>> | undefined;
  const page = pages?.find(
    (p) => typeof (p.instagram_business_account as { id?: unknown } | undefined)?.id === "string"
  );
  const businessId = (page?.instagram_business_account as { id?: unknown } | undefined)?.id;
  if (typeof page?.id !== "string" || typeof businessId !== "string") {
    throw new Error(
      "No Instagram Business account linked to any Facebook Page. Link an Instagram Business account to a Page, then retry."
    );
  }
  return { pageId: page.id, instagramBusinessId: businessId };
}

/** Parse an Instagram Business user lookup into account info. Pure/testable. */
export function parseInstagramAccount(igData: Record<string, unknown>): SocialAccountInfo {
  const id = String(igData.id ?? "");
  if (!id) throw new Error("Unable to identify instagram account");
  const username = String(igData.username ?? igData.name ?? id);
  const picture = typeof igData.profile_picture_url === "string" ? igData.profile_picture_url : undefined;
  return { platformAccountId: id, username, displayName: username, profileImageUrl: picture };
}

class InstagramProvider extends ConfiguredOAuthProvider {
  constructor() {
    super("instagram");
  }

  async handleOAuthCallback(code: string, _state: string): Promise<OAuthTokenResponse> {
    // Instagram uses Facebook Login: exchange the code for a user access
    // token, then resolve the linked IG Business account in getAccount().
    const clientId = process.env.INSTAGRAM_CLIENT_ID ?? "";
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET ?? "";
    const redirectUri =
      process.env.INSTAGRAM_REDIRECT_URI ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/oauth/instagram/callback`;

    try {
      const params = new URLSearchParams({
        client_id: requiredSetting("INSTAGRAM_CLIENT_ID", clientId),
        client_secret: requiredSetting("INSTAGRAM_CLIENT_SECRET", clientSecret),
        redirect_uri: redirectUri,
        code,
      });
      const data = await readGraphResponse(await fetch(`${graphUrl}/oauth/access_token?${params.toString()}`));
      const accessToken = String(data.access_token ?? "");
      if (!accessToken) throw new Error("Instagram did not return an access token");

      return {
        accessToken: encrypt(accessToken),
        expiresIn: typeof data.expires_in === "number" ? data.expires_in : undefined,
        tokenType: typeof data.token_type === "string" ? data.token_type : undefined,
      };
    } catch (error) {
      logger.error("Instagram OAuth callback failed", error);
      throw new Error("Instagram OAuth callback failed");
    }
  }

  async getAccount(accessToken: string): Promise<SocialAccountInfo> {
    const token = decrypt(accessToken);
    const pagesParams = new URLSearchParams({
      fields: "id,name,instagram_business_account",
      access_token: token,
    });
    const pagesData = await readGraphResponse(await fetch(`${graphUrl}/me/accounts?${pagesParams.toString()}`));
    const { instagramBusinessId } = parseInstagramBusinessId(pagesData);

    const igParams = new URLSearchParams({
      fields: "id,username,profile_picture_url",
      access_token: token,
    });
    const igData = await readGraphResponse(
      await fetch(`${graphUrl}/${encodeURIComponent(instagramBusinessId)}?${igParams.toString()}`)
    );
    return parseInstagramAccount(igData);
  }
}

/** Instagram OAuth provider used by the named Instagram API routes. */
export function createInstagramProvider() {
  return new InstagramProvider();
}

export const getInstagramProvider = createInstagramProvider;
