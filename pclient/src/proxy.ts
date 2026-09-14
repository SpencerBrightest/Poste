import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

function routePathFromEnv(name: string, fallback: string) {
  const configuredPath = process.env[name];

  return configuredPath?.startsWith("/") ? configuredPath : fallback;
}

const signInPath = routePathFromEnv("NEXT_PUBLIC_CLERK_SIGN_IN_URL", "/sign-in");
const signUpPath = routePathFromEnv("NEXT_PUBLIC_CLERK_SIGN_UP_URL", "/sign-up");

const isPublicRoute = createRouteMatcher([
  "/",
  `${signInPath}(.*)`,
  `${signUpPath}(.*)`,
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
]);

// Protects every application route unless it is an explicit authentication entry point.
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
