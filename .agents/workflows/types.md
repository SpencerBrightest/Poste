---
description: Brief explanation on the various types i should use 
---

TASK:
Set up the /types folder for the Poste project it should be in the pclient folder. Create minimal TypeScript 
interfaces for each core entity in the system, following these steps in order.

STEP 1 — User type (types/user.ts)
Define a User interface with only the fields currently confirmed in the app: 
a unique id, name, email, a role restricted to "user" or "admin", a plan 
restricted to "free", "pro", or "business", the user's niche as a string, 
their unique referralCode, and a createdAt timestamp. Do not add speculative 
fields for features that don't exist yet (no bio, profile picture, 2FA, etc.).

STEP 2 — Post type (types/post.ts)
Define a Post interface: a unique id, the userId it belongs to, a platform 
restricted to "instagram" or "facebook", a caption string, a scheduledFor 
date, and a status restricted to "scheduled", "posted", or "failed".

STEP 3 — SocialAccount type (types/socialAccount.ts)
Define a SocialAccount interface: a unique id, the userId it belongs to, a 
platform restricted to "instagram" or "facebook", an accessToken string, 
and a connectedAt timestamp.

STEP 4 — Transaction type (types/transaction.ts)
Define a Transaction interface: a unique id, the userId it belongs to, an 
amount as a number, a plan restricted to "free", "pro", or "business", a 
phoneNumber string, a reference string, a status restricted to "pending", 
"success", or "failed", and a createdAt timestamp.

STEP 5 — Referral type (types/referral.ts)
Define a Referral interface: a unique id, referrerId, referredUserId, 
earnings as a number, and a createdAt timestamp.

STEP 6 — Index file (types/index.ts)
Re-export everything from the five files above, so any file in the project 
can import types from a single path (e.g. "@/types") instead of importing 
from each file individually.

CONSTRAINTS:
- Keep every interface minimal — only fields explicitly listed above, no 
  extra speculative properties
- Use TypeScript's union type syntax (e.g. "user" | "admin") for restricted 
  string fields, not plain "string"
- Add a one-line comment at the top of each file naming the file's purpose
- Do not create any file outside the /types folder
- Do not add any logic, functions, or default exports — interfaces only

OUTPUT:
Return the complete code for all six files, clearly labeled by filename.