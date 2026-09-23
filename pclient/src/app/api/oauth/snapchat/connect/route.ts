import { startOAuth } from "@/lib/social/oauth-routes";

export async function GET() {
  return startOAuth("snapchat");
}
