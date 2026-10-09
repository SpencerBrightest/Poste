# Development Workflow

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

Build one page or one subsystem at a time. Review the diff before moving to the next unit — this project is also a deliberate learning exercise in system design and JWT/auth fundamentals, so understanding each piece before moving on matters as much as shipping it.

## Scoping Rules

- Work on one feature unit, page, or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step (e.g. don't build the scheduler and the payment flow in one pass).

## When To Split Work

Split an implementation step if it combines:

- Frontend UI changes and backend/API logic changes
- Auth/session logic and unrelated feature logic
- Multiple unrelated API routes or pages
- Behavior that is not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed. This includes:

- `components/ui/*` (shadcn/ui components)
- third-party library internals

These should remain default and reusable. Project-specific styling, layout changes, and feature logic must be implemented in app-level components instead.

## Theming Rule

Any page or component edit must preserve full dark/light theme support — every color class needs a `dark:` pair. Do not change layout, spacing, or structure while applying theme classes; theming and structural changes are separate implementation steps.

## Payment Safety Rule

When working on any payment-related code:
- Never log or expose full phone numbers, tokens, or transaction secrets.
- Store amounts as integers/numbers, never floating-point currency math.
- Webhook routes must verify the request is genuinely from the payment provider before trusting the payload.
- Any payment status change must be logged in the Transaction model, never silently updated elsewhere.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries
- Storage model decisions
- Code conventions or standards
- Feature scope

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. `progress-tracker.md` reflects the completed work.
4. Only files explicitly in scope for the task were modified.
