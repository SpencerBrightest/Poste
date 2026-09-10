---
description: branch cleanup
---

## Branch Cleanup Workflow

Use this after a feature branch has been merged into main, to keep the repo tidy.

1. Confirm the branch was actually merged before deleting anything:
   git log main --merges | grep <branch-name>
   or check the GitHub PR shows "Merged" status.

2. Switch back to main and pull the latest:
   git checkout main
   git pull origin main

3. Delete the local branch:
   git branch -d <branch-name>
   (use -D only if you're certain it's safe, this force-deletes even unmerged work)

4. Delete the remote branch:
   git push origin --delete <branch-name>

5. Prune any stale remote-tracking references:
   git fetch --prune

6. Confirm cleanup:
   git branch -a
   (should no longer list the deleted branch, locally or under remotes/origin)

RULES:
- Never delete a branch with -D (force) unless you've explicitly confirmed 
  its changes are no longer needed — this is a safety gate against 
  accidentally losing unmerged work
- Never delete main, develop, or any branch currently checked out
- If unsure whether a branch was merged, stop and ask before deleting
- After cleanup, list which branches were removed in the response