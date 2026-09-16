// Defines the TypeScript interface for a User entity

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro" | "business";
  niche: string;
  referralCode: string;
  createdAt: Date;
}
