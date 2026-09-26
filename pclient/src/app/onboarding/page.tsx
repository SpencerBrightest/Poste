import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/permissions";

async function createOrganization(formData: FormData) {
  "use server";
  
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  // Check if user already has an organization
  const user = await getCurrentUser();

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
  const user = await getCurrentUser();

  if (user?.organizationId) {
    redirect("/editor");
  }

  return (
    <main className="onboarding-shell min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="onboarding-visual-panel hidden rounded-md p-8 lg:block lg:p-10">
          <div className="mb-16 flex items-center gap-3 text-sm font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">P</span>
            Poste
          </div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-sm border border-border-strong bg-surface/80 px-3 py-1.5 text-xs font-semibold text-text-soft">
            <Sparkles className="h-3.5 w-3.5" /> A calmer way to publish
          </p>
          <h1 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Give your content a home.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-text-soft">
            Set up your workspace once, then move from ideas to scheduled posts with a clear rhythm.
          </p>
          <ul className="mt-10 grid gap-4 text-sm text-text-soft">
            {['Plan your publishing rhythm', 'Keep your social work in one place', 'Learn what resonates with your audience'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto w-full max-w-xl rounded-md border border-border bg-card p-6 text-card-foreground sm:p-10">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3 text-sm font-bold tracking-tight">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">P</span>
              Poste
            </div>
          </div>
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Workspace setup</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Poste</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Create a workspace for your content, channels, and publishing schedule.</p>
          </div>

          <form action={createOrganization} className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-text-soft">Workspace name</label>
            <input
              id="name"
              name="name"
              type="text"
                placeholder="My creative studio"
              required
              minLength={2}
              maxLength={100}
                className="h-12 rounded-sm border border-border-strong bg-surface-soft px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
            />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-semibold text-text-soft">Workspace slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              placeholder="my-creative-studio"
              required
              pattern="[a-z0-9-]+"
              minLength={2}
              maxLength={50}
              className="h-12 rounded-sm border border-border-strong bg-surface-soft px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
            />
              <p className="text-xs text-muted-foreground">Lowercase letters, numbers, and hyphens only.</p>
            </div>

            <button type="submit" className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:bg-primary-active focus:outline-none focus:ring-2 focus:ring-primary/30">
              Create workspace <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
