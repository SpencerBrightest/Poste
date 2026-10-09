---
description: Payment rules
---

When working on any payment-related code:
1. Never log or expose full phone numbers, tokens, or transaction secrets in comments or console.log
2. Always store amounts as numbers, never floating-point currency math
3. Webhook routes must verify the request is genuinely from Campay before trusting its payload
4. Any payment status change must be logged in the Transaction model, never silently updated