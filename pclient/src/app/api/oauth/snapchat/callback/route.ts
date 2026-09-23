import { NextRequest } from "next/server";
import { completeOAuth } from "@/lib/social/oauth-routes";

export async function GET(request: NextRequest) {
  return completeOAuth("snapchat", request);
}
