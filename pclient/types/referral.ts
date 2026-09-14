// Defines the TypeScript interface for a Referral entity

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  earnings: number;
  createdAt: Date;
}
