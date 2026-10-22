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

## Exact candidate CI and screenshot review — 23 October 2026
[GitHub Actions 39868873522](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39868873522) completed **SUCCESS**, all 19 workflow steps on exact reviewed source bf1aa8d14d891504790f006299a4f54f2d85617e. Includes 106 unit/client tests, 57 isolated HTTP, 23 PostgreSQL checks, offline live-smoke harness, lint, typecheck, production build, and **16 Playwright scenarios across desktop and 375px (8 unique scenarios × 2 projects)**. The output confirms the original create/edit tests and both new quick-filter/navigation and progress tests pass after the exact fix.

Inspected the generated [CI browser evidence](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39868873522): queue-desktop 1440×1000 and queue-mobile-375 375×1363. The new dark navigation, responsive filters, queue rows/cards, primary CTA and pager are visible; no obvious page-level horizontal clipping in these samples. This is integrator **self-review**, not a real Figma prototype, comprehensive accessibility audit, user signoff, or hosted production validation.

**Verdict:** source functional/CI candidate **PASS**; user visual acceptance **PENDING**. Keep PR #9 draft and Render unchanged. Request visual feedback on actual screenshots and connect Figma for editable source if desired; only then review merge/deployment gates. No final PR #1 merge.

## Queue icon and multi-page screenshot follow-up
The owner's review of source-generated desktop/375px queue screenshots identified a visual positioning defect: the legacy `.search-wrap > span` rule overrode the new icon's placement. Replace the glyph span with an inline SVG that is not matched by that legacy selector and align it within the input using CSS. Expand existing isolated Playwright flows to capture full-page **create** and **in-review detail** screenshots at both desktop and 375px without adding test writes outside the isolated DB. Do not consider this correction qualified until fresh exact-head CI and screenshot inspection pass; PR #9 remains draft.
