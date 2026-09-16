// Defines the TypeScript interface for a payment Transaction entity

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  plan: "free" | "pro" | "business";
  phoneNumber: string;
  reference: string;
  status: "pending" | "success" | "failed";
  createdAt: Date;
}
