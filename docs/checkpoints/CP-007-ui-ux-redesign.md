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

## Figma XFactor file-creation attempt — 23 October 2026
Owner selected **XFactor**. Figma `whoami` confirms workspace key `team::1533080845550437515` but reports **seat: View**. An authorized `create_new_file` call for an editable **design** file using that exact plan key returned **INVALID_ARGUMENT / Invalid planKey**. Retrying the account lookup returned the same XFactor key and seat. **No editable Figma file was created**, no design content was written, and PR #9 and Render remain unmerged/unmodified. Next: owner confirms Figma editor permissions or provides an already-editable Figma Design file link for this project, then resume frames/components; do not switch to the other workspace without owner approval.

## XFactor editable Figma file — retry succeeded (23 October 2026)
- Figma workspace **XFactor**, verified by connected Figma identity and user selection. The account previously reported a View seat; on retry the workspace tier was `student` and file creation **succeeded** using its authorized plan key.
- **File:** https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l — *ReturnDesk — UI v2 / CP-007 — Editable Screens*.
- **Six editable Figma frames created** (native auto-layout frames, editable text, shape/field/chip/button layers): desktop/mobile Queue, Create request and Request detail. Generated structural metadata confirmed these screens under the file's design page and node screenshot of Desktop Queue was successfully rendered. The source is genuine vector/text hierarchy, **not a pasted full-page screenshot**.
- Visual mapping: CP-007 v2 repository CSS token palette and known synthetic-only workflows; source application UI v2 on PR #9, source-verified CI for previous UI commit. The Figma file is a first editable design draft, **not** fully production-synced Code Connect, interactive prototype or accessibility certification. Status/approval actions in Figma are illustrative, not live application controls.
- **Still needed:** review actual Figma visual frames for exact fidelity, create reusable component variants/variables if desired, capture user design approval. This Figma creation does not grant permission to merge PR #9 or redeploy Render. PR #1 remains draft.

## CP-007 revision B — first Figma design rejected, replacement built (23 October 2026)

**Owner feedback:** The initial XFactor Figma composition was precisely the generic / rusty AI-generated styling the owner had rejected. This explicitly **invalidates the initial six Figma frames as an acceptable visual design**. Do not treat first-frame creation or old screenshot generation as UI approval.

**Corrective design work:** On the existing editable [XFactor Figma file](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l), replaced all six rejected top-level frames with a newly composed **Resolution Studio** direction, featuring a dark-forest navigation rail, warm-neutral surfaces, deliberate citron decision affordances, editorial DM Sans headings, IBM Plex Mono operational metadata, scannable case table, selected-case context and action panel, structured form, and decision-first mobile layout.

The six current **native editable** frames were inspected:
- Queue desktop `7:2` (1440×960), create desktop `8:2`, detail desktop `8:78`
- Queue mobile `9:2` (390×1120), create mobile `9:63` (390×1365), detail mobile `9:112` (390×1390)
- All six earlier frame IDs (`1:2`, `1:55`, `1:99`, `1:143`, `1:183`, `1:228`) removed from active canvas after replacements were rendered. Structural verification found exactly six top-level screen frames, with 30–74 editable text layers each; no flattened full-page screenshots.
- Screenshots of revised desktop Queue/Create/Detail and mobile Queue/Create/Detail were reviewed for hierarchy, clipping and decision priority. This is **integrator visual self-review**, not user approval or formal accessibility certification.

**Important implementation delta:** This new visual language is **NOT yet implemented in Next.js**. PR #9's earlier blue/navy CSS and component treatments correspond to the earlier direction, so do **not** merge PR #9 on the strength of its passing CI. The Figma designs are an interactive-workflow *specification*, not functioning API-connected buttons or a working Figma prototype. The existing public Render demo and DB remain unchanged.

**Gate:** Request owner review of revised [Queue desktop](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=7-2), [Mobile queue](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=9-2), and [Mobile detail](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=9-112). If approved, reconcile source code and design tokens, implement controls against existing APIs, rerun full exact-head CI and real hosted responsive checks before merging/deploying. **Visual approval remains PENDING.**

## CP-007 latest — Service Ledger interactive prototype candidate (23 October 2026)

**Reason for another direction:** Owner rejected first blue/navy dashboard and then rejected the dark-forest dual-surface template. Neither older mockup is accepted as the production visual design. In the existing XFactor [editable Figma file](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l), the new **first page** is `01 · SERVICE LEDGER / Prototype (CURRENT)` (page `14:2`); the older `Resolution Studio` design is on an explicit archive page. The new approach has top navigation, a single scannable queue, inline expansion of a selected case (rather than a permanent right-hand inspector), focused case details, and deliberate approval/rejection confirmation screens. It keeps the public UI synthetic-only.

**Completed and verified in Figma**
- Main paths: Queue desktop `14:3` → inline expanded case `14:74` → focused case `15:2` → decision `15:83` → approval/rejection overlays `15:112` / `20:2` → demo completion `19:22`. Create `15:45` → explicit simulated confirmation `19:28`. Queue filtered `14:154`. Mobile paths: queue `16:2`, filtered `21:2`, case `16:51`, decision `19:2`, create `16:84`, confirmations `20:11` / `20:19`, demo results `19:34` / `24:2`.
- Built **31 top-level prototype screens/states**, including six record-accurate desktop and four mobile *read-only* preview destinations for secondary rows. These avoid routing every customer to the wrong case. First page established with old directions archived.
- Programmatic page-graph audit found **106 stored prototype click/overlay/close reactions**, **zero broken destination IDs**. Active current-page navigation labels intentionally have no self-link (Figma disallows navigation to the same top-level screen).
- Verified screenshots of expanded queue, decision, mobile case, mobile filter, mobile creation, desktop creation and search-results state. Caught and corrected missing **quantity/reason** fields on desktop, missing **phone/quantity** on mobile, and misleading placeholder search query in sample results. Reviewed the corrected screenshots again.
- Search in Figma is a **fixed example query “Meera”**, not actual free-text input or a live database filter. Prototype created/approved/rejected result screens are explicitly simulated; no API call, database mutation, payment or real customer action occurred. The relevant Next.js behavior must remain server-backed.

**Professional review boundary:** UI exploration is a verified **click-through Figma design candidate**, not a formally user-accepted visual design, WCAG conformance certification, complete native Figma component library, runtime playback recording or production implementation. Screen frames use mostly editable native text/shapes, but do not yet rely on a fully responsive auto-layout library or Code Connect. The earlier **CI green on PR #9** applies to the OLD blue/navy source, **not** this new Service Ledger design. Both PR #9 (UI work) and PR #1 (main release) remain draft and unmerged; Render continues serving the old accepted implementation.

**Next exact dependency:** owner visually reviews the [primary queue](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=14-3), [inline expansion](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=14-74), [mobile queue](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=16-2) and [mobile decision](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=19-2). After visual approval, implement this direction in source with real API-backed behavior, add interaction/accessibility/mobile regression tests, qualify exact-head CI, update checkpoints, and only then consider PR merges and deployment. Owner acknowledgment remains **PENDING**.
