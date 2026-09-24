import { ConfiguredOAuthProvider } from "./oauth";

/** TikTok OAuth provider used by the named TikTok API routes. */
export function createTikTokProvider() {
  return new ConfiguredOAuthProvider("tiktok");
}

export const getTikTokProvider = createTikTokProvider;
