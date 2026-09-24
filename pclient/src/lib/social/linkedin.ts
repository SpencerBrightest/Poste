import { ConfiguredOAuthProvider } from "./oauth";

/** LinkedIn OAuth provider used by the named LinkedIn API routes. */
export function createLinkedInProvider() {
  return new ConfiguredOAuthProvider("linkedin");
}

export const getLinkedInProvider = createLinkedInProvider;
