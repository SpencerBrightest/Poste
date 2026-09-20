import { Inngest } from "inngest";

// Create Inngest client
export const inngest = new Inngest({
  id: "poste",
  credentials: {
    key: process.env.INNGEST_SIGNING_KEY || "",
  },
});
