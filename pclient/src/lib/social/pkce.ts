import crypto from "crypto";

function toBase64Url(input: Buffer | string): string {
  const base64 =
    typeof input === "string" ? Buffer.from(input).toString("base64") : input.toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Generate an RFC7636 code_verifier (43-128 base64url chars). */
export function generateCodeVerifier(): string {
  return toBase64Url(crypto.randomBytes(32));
}

/** Derive an S256 code_challenge from a code_verifier. */
export function codeChallengeFromVerifier(verifier: string): string {
  return toBase64Url(crypto.createHash("sha256").update(verifier).digest());
}
