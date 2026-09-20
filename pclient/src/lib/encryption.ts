import crypto from "crypto";

import env from "./env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Encrypts a string using AES-256-GCM
 * @param text - The plaintext to encrypt
 * @returns The encrypted text as a hex string (iv:salt:tag:encrypted)
 */
export function encrypt(text: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${salt.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a string that was encrypted with AES-256-GCM
 * @param encryptedText - The encrypted text as a hex string (iv:salt:tag:encrypted)
 * @returns The decrypted plaintext
 * @throws Error if decryption fails
 */
export function decrypt(encryptedText: string): string {
  const key = Buffer.from(env.ENCRYPTION_KEY, "hex");
  const parts = encryptedText.split(":");

  if (parts.length !== 4) {
    throw new Error("Invalid encrypted text format");
  }

  const [ivHex, saltHex, tagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const salt = Buffer.from(saltHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Hashes a string using SHA-256
 * @param text - The text to hash
 * @returns The hash as a hex string
 */
export function hash(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}
