import { ConfiguredOAuthProvider } from "./oauth";

/** Snapchat OAuth provider used by the named Snapchat API routes. */
export function createSnapchatProvider() {
  return new ConfiguredOAuthProvider("snapchat");
}

export const getSnapchatProvider = createSnapchatProvider;
