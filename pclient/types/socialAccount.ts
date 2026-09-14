// Defines the TypeScript interface for a connected Social Account entity

export interface SocialAccount {
  id: string;
  userId: string;
  platform: "instagram" | "facebook";
  accessToken: string;
  connectedAt: Date;
}
