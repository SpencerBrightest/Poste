---
description: Workflow for creating express Api routes
---

When creating a new Express API route:
1. Create the route in routes/, controller logic in controllers/ — never inline logic in the route file
2. Add authMiddleware if the route requires login, adminMiddleware if admin-only
3. Wrap all database calls in try/catch, return consistent JSON error shape: { message: "..." }
4. Never expose password fields — always use .select('-password') on User queries
5. Add the new route to server.js if it's a new route file