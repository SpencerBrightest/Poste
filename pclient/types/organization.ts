import { UserRole } from "@prisma/client";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  clerkUserId: string;
  email: string;
  role?: UserRole;
}

export interface CreateOrganizationInput {
  name: string;
  slug: string;
  userId: string;
}
