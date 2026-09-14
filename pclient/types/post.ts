// Defines the TypeScript interface for a Post entity

export interface Post {
  id: string;
  userId: string;
  platform: "instagram" | "facebook";
  caption: string;
  scheduledFor: Date;
  status: "scheduled" | "posted" | "failed";
}
