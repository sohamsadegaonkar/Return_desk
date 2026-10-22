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

## Multiscreen UX review — decision priority
Generated 375px create and In-review detail screenshots from [CI 39870153254](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39870153254) revealed that the next legal action appeared **below the notes form** on mobile. This is a task-order usability issue even though functional CI passed. Candidate correction: move the detail Notes section outside the primary info column *after the decision aside in DOM order*, retaining the desktop right-side action placement while presenting the decision before notes on narrow screens. Add a 375px bounding-order assertion so visual and keyboard/DOM navigation are consistent. Similarly show all six status chips (including Rejected) by wrapping instead of hiding them in a sideways scroller. **Fresh exact-head CI and screenshot acceptance remain pending** before merging anything.

## CP-007 final source-QA evidence (still awaiting human/Figma design acceptance)

- **Exact UI source:** `28a25ceb479fa19c88b8e7260897a70b85372cfb`, [GitHub Actions run 39870760077](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39870760077) **SUCCESS: 19 of 19 workflow steps**, including lint, typecheck, unit/client, isolated PostgreSQL and HTTP checks, offline smoke tests, build and 16 desktop/375px Playwright project scenarios.
- **Browser screenshots generated and inspected:** `queue-desktop.png` 1440×1000, `queue-mobile-375.png` 375×1414, `create-desktop.png` 1440×1267, `create-mobile-375.png` 375×2154, `detail-desktop.png` 1440×1422, `detail-mobile-375.png` 375×2073. Artifact: `browser-and-server-evidence` on the linked CI run.
- **Visual fixes verified from latest screenshots:** Search SVG remains centered in the labeled field. All six quick status filters are visible without side scrolling at 375px. On 375px request detail, the server-authorized Approve/Reject panel now appears **before** the append-only notes composer, in both DOM and visual order; an E2E bounding-order check passed.
- **Limitations:** QA screenshots use an isolated CI database and artificially long synthetic customer/order identifiers, not a customer usability study. No live-hosted UI deployment, Figma editable canvas, comprehensive keyboard/screen-reader audit, production cross-browser mobile Safari check or final owner visual signoff has occurred. CI-verified interaction set is extensive but **not proof every possible control/state is correct**.
- **Gate status:** Source functional and responsive CI **PASS**, integrator screenshot self-review **PASS**, Figma authoring/team selection **PENDING**, user visual approval **PENDING**, hosted UI acceptance **PENDING**, PR #9 draft/unmerged, PR #1 draft/unmerged. **Next:** owner selects Figma workspace; build/editable design frames if write access permits, review screenshots, then approve/iterate before merge and Render redeploy.
