import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

async function createOrganization(formData: FormData) {
  "use server";
  
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  // Check if user already has an organization
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (user?.organizationId) {
    redirect("/editor");
  }

  // Check if slug is taken
  const existingOrg = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existingOrg) {
    throw new Error("Slug already taken");
  }

  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name,
      slug,
    },
  });

  // Update user
  await prisma.user.update({
    where: { id: user.id },
    data: { organizationId: organization.id },
  });

  // Create default subscription
  await prisma.subscription.create({
    data: {
      organizationId: organization.id,
      plan: "FREE",
      status: "TRIALING",
      aiGenerationsLimit: 10,
      scheduledPostsLimit: 5,
      connectedAccountsLimit: 1,
    },
  });

  redirect("/editor");
}

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has an organization
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { organization: true },
  });

  if (user?.organizationId) {
    redirect("/editor");
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>Welcome to Poste</h1>
        <p>Let's set up your workspace to get started.</p>
        
        <form action={createOrganization} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="name">Organization Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="My Company"
              required
              minLength={2}
              maxLength={100}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="slug">Workspace Slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="my-company"
              required
              pattern="[a-z0-9-]+"
              minLength={2}
              maxLength={50}
            />
            <small>Only lowercase letters, numbers, and hyphens</small>
          </div>
          
          <button type="submit" className="primary-button">
            Create Workspace
          </button>
        </form>
      </div>
    </div>
  );
}
