import { PrismaClient, UserRole, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { clerkUserId: "admin_clerk_user_id" },
    update: {},
    create: {
      clerkUserId: "admin_clerk_user_id",
      email: "admin@poste.dev",
      role: UserRole.ADMIN,
    },
  });

  console.log("Created admin user:", adminUser.email);

  // Create test organization
  const organization = await prisma.organization.upsert({
    where: { slug: "test-org" },
    update: {},
    create: {
      name: "Test Organization",
      slug: "test-org",
    },
  });

  console.log("Created organization:", organization.name);

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { clerkUserId: "test_clerk_user_id" },
    update: {},
    create: {
      clerkUserId: "test_clerk_user_id",
      email: "user@poste.dev",
      role: UserRole.USER,
      organizationId: organization.id,
    },
  });

  console.log("Created test user:", testUser.email);

  // Create subscription for organization
  const subscription = await prisma.subscription.upsert({
    where: { organizationId: organization.id },
    update: {},
    create: {
      organizationId: organization.id,
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.TRIALING,
      aiGenerationsLimit: 10,
      scheduledPostsLimit: 5,
      connectedAccountsLimit: 1,
    },
  });

  console.log("Created subscription:", subscription.plan);

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
