# CP-007 — Research-grounded UI/UX redesign v2

**State:** CANDIDATE, UNMERGED. **Date:** 23 October 2026, IST. **Dependency:** CP-006 hosted API/write and cross-deployment persistence PASS, followed by explicit user rejection of the generic UI. **Human acceptance:** PENDING.

## Changes for review
- App shell navigation becomes real All requests / New request destinations with current-page state and adaptive mobile layout.
- Queue: explicit status-filter chips, searchable/filterable table and cards, clearer labels/primary CTA, functional Clear search reset.
- Detail: visible progress steps reflect saved server state, while server-authorized actions and notes remain unchanged.
- Create: improved customer/order field hierarchy and required hints while preserving schemas/validation.
- CSS: shared semantic tokens, accessible focus/targets, premium operations layout and responsive rules.
- Two focused Playwright scenarios added for navigation/quick filters/search reset and lifecycle progress.
- No API route, database, seed, refund fulfillment or authorization changes. Public demo remains synthetic-only.

## Evidence and limitations
Fresh source research and Figma frame/component handoff: [UI v2 design system](../design/UX_REDESIGN_V2.md). Reviewer: integrator self-review; no independent user testing or Figma artifact created. The previous CI 39865008569 passed on older integration b522568, NOT this v2 candidate. Exact-head CI and 375px human visual acceptance are pending.

## Next step
Review the exact candidate diff, open PR to integration/foundation, verify full CI and screenshot behavior, address defects, obtain user's UI approval, then merge/redeploy and re-verify actual hosted responsive UX before final PR #1. Deadline remains 23 October 2026 11:00 IST.

## First CI failure and reviewed correction
[PR #9 initial CI 39868193926](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39868193926): lint, typecheck, domain/unit, offline smoke, isolated migration/DB checks and production build PASSED. Browser verification FAILED: 10 passed, six failed (three scenarios on desktop and 375px). Two defects identified directly from job logs: putting Required markup inside the original label changed exact field-label matching on create/edit; test navigation had two legitimately accessible New request links and used an ambiguous locator. Corrected by moving Required badges beside labels without changing form field names or validation, and by scoping the new Playwright locator to Primary navigation. Responsive badge row CSS added. No browser checks removed or weakened; new exact-head CI must now pass before review can continue. Candidate remains unmerged/unreleased.
