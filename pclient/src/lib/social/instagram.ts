import { ConfiguredOAuthProvider } from "./oauth";

/** Instagram OAuth provider used by the named Instagram API routes. */
export function createInstagramProvider() {
  return new ConfiguredOAuthProvider("instagram");
}

export const getInstagramProvider = createInstagramProvider;
