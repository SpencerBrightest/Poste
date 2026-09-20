import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  processAccountDeletion,
  publishScheduledPost,
  syncPostAnalytics,
} from "@/lib/inngest/functions";

// Exposes Poste's background functions to Inngest for scheduled publishing and sync jobs.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [publishScheduledPost, syncPostAnalytics, processAccountDeletion],
});
