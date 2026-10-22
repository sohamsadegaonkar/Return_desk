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
