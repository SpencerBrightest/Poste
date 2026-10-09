---
description: tThis is a new-page for easily autamating workflow tasks for avoiding repetition
---

When creating a new page:
1. Check src/pages/ for the correct subfolder (public, app, or admin)
2. Use shadcn components from src/components/ui — never write raw HTML form elements
3. Apply dark: variant classes alongside every color class (theme rule)
4. Wrap logged-in pages with AppLayout, public pages standalone
5. Add the new route to App.jsx routing — nothing else
6. Confirm no other file was modified before finishing