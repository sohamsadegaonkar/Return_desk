# Decision register

All entries are design decisions, not implementation claims. Update affected contracts and tests in the same reviewed step.
| ID | Decision | Reason / alternative |
|---|---|---|
| ADR-001 | One Next.js application; Node Route Handlers | Meets stack with less deployment complexity than separate Express |
| ADR-002 | Pure shared contracts; server-only DB/service | Reduce drift without leaking infrastructure |
| ADR-003 | Status-based live unique index includes removed Open | Literal assignment interpretation; operational exclusion rejected |
| ADR-004 | Row lock plus expectedVersion | Serialize writes and expose stale views; unique index handles creates |
| ADR-005 | Decimal string money, generated references/keys | Avoid precision loss and application-only uniqueness |
| ADR-006 | Notes mandatory; timeline/idempotency extensions | Finish rubric requirements first |
| ADR-007 | All steps reviewed before push; evidence Markdown each checkpoint | Explicit user instruction; not just post-push CI |
| ADR-008 | Fresh primary-source study per material checkpoint | Explicit user instruction; skills alone insufficient |
| ADR-009 | Explicit acknowledgment tracked separately from technical pass | Avoid invented user approval and unnecessary repeated permission |
| ADR-010 | Client HTTP reads initially; any server reads use shared query layer directly | R-005; single authoritative mutation path remains unchanged |

Change template: date, previous decision, new evidence/source, alternatives, affected requirements/contracts, risk, verification, reviewer and adoption status. Research may refine mechanics but cannot silently loosen assignment rules.

## Integration decisions — 22 October 2026
- ADR-011: Keep Drizzle for canonical schema/migrations/seed; use native node-postgres parameterized service SQL for transparent locking and composed server queries. Assignment permits either query layer. Fresh node-postgres transaction docs and PG16 isolation docs inspected by API owner; raw SQL avoids opaque lock behaviour. Same domain policies and one write service remain authoritative. Static/type/build review passed; runtime pending CI.
- ADR-012: Disable scaffold Cache Components/partial-prefetch flags while retaining explicit Node Route Handler runtime. Actual integrated build failed under the incompatible flag; fresh Next 16.4.2 documentation confirms it. Build passed after correction. Preserve dynamic reads/no-store envelopes.
- ADR-013: Use PostgreSQL 16 GitHub Actions service for real runtime gates when local process launch is blocked. Do not replace PostgreSQL evidence with mocks/PGlite. Workflow statically reviewed by integrator and API engineer; execution pending.
- ADR-014: Key the request workspace by request ID to reset record-specific state across parameter navigation; React official preserving/resetting-state guide inspected (key/form reset section). This prevents old record drafts/capabilities from being reused for another ID. Within one record, conflict drafts remain preserved. Source review and final type/build gates required.
