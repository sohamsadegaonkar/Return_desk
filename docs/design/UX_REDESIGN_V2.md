# ReturnDesk UI/UX v2 — design system and Figma handoff

**State:** UNMERGED CANDIDATE. 23 October 2026, IST. This is a visual/interaction redesign for the queue, request creation and details; no API, database or security-model changes. The existing public Render website has NOT been updated.

## User-first flows
1. Locate an existing return: All requests → obvious search or one-click status chips → compare readable desktop rows/mobile cards → view the record.
2. Resolve it: inspect order and customer context → see current lifecycle stage → choose a server-authorized action → confirm explicitly → preserve notes and error recovery.
3. Create it: New request → grouped Customer and Order/Item fields with obligation markers and contact guidance → submit → see generated reference.

Controls are actual navigation links, status filters, pagination or existing API-backed operations, not decorative buttons. Progress stages communicate state and are intentionally not clickable. No fake KPIs or simulated payment action.

## Freshly inspected research and adaptation
- Baymard, Search Bar UI, 2 October 2026: https://baymard.com/blog/search-bar-ui — prominent search, query persistence and refinement; applied visible field labels and Clear search action.
- NN/g, Data Tables: Four Major User Tasks, 3 April 2022: https://www.nngroup.com/articles/data-tables/ — scanning, finding, comparing and acting; applied reference-first table, discoverable filters and an explicit View link, cards for narrow screens. This is existing research freshly checked, not a 2026 publication.
- Baymard, checkout field complexity, 26 June 2024: https://baymard.com/research-articles/checkout-flow-average-form-fields — group required data without unnecessary steps; applied concise sections and contact guidance. Transfer from checkout context is a design hypothesis, not user validation.
- W3C WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ — focus visibility and adequately sized targets; aimed for prominent focus outlines and 44px primary targets. Compliance is not yet audited.
- Figma Schema 2025: https://www.figma.com/blog/schema-2025-design-systems-recap/ — use variables and reusable components with implementation consistency; below is a Figma handoff, NOT an actual Figma file. Direct authoring requires connection to Figma.

## Token specification (match CSS source)
| Variable | Value | Use |
|---|---|---|
| canvas | #f5f7fb | page |
| surface | #ffffff | cards/panels |
| ink | #162238 | text |
| muted | #617189 | secondary text |
| border | #e4eaf3 | separators |
| navy | #141e31 | navigation sidebar |
| navy-active | #2d426a | current destination |
| primary | #285de6 | primary action |
| blue-tint | #ebf1ff | selected/informational surfaces |
| danger | #ae3d3b | removal/rejection |
| radius-panel | 16px | main panel |
| radius-control | 9–10px | controls |
| target-primary | 44–48px | touch/keyboard targets |
| font | system UI/Segoe UI/Inter fallback | no third-party font request |

## Figma frame plan after connecting Figma
- Queue desktop (1440×900): 246px dark navigation rail, utility bar, status chips, searchable/filterable records table, visible row actions.
- Queue mobile (375×812): compact brand/two navigation destinations, scrollable status chips, full-width search, two-column dropdowns, clickable request cards.
- Create request (desktop 1440 and mobile 375): clear heading, customer contact and order/item sections, status hint, active Cancel/Create actions.
- Request detail (desktop and mobile): reference/status header, progress strip, decision panel, info and note cards, confirmation modal.
- State variants: empty/filtered, loading, API error, validation, stale conflict, uncertain response, terminal state, keyboard focus and long text.
- Components: SidebarLink, Button, StatusPill, QuickFilter, TextInput, Select, Textarea, QueueRow, RequestCard, ProgressStep, Dialog and FeedbackBanner with functional/disabled/loading/error variants.

## Qualification protocol
- Run lint, typecheck, unit tests, isolated PostgreSQL/HTTP and Playwright tests at desktop and 375px, including new quick-filter/search-clear and progress assertions.
- Conduct real browser review at 375, 390, 768 and 1440 CSS px, with keyboard focus, overflow, loading/errors, and long content. Isolated CI results do not prove public-site acceptance.
- Do not merge to integration/main or trigger Render deploy before exact PR CI and user visual approval.
- Do not claim an editable Figma artifact until connected and actually authored.

## Latest browser evidence and Figma boundary
[UI source run 39870760077](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39870760077) **PASS**, six full-page screenshots from isolated desktop/375px Playwright. Latest mobile screens make all six statuses visible without scrolling and place the contextual decision CTA before notes in logical DOM order. These screenshots serve as the current implementation reference, not an editable design-system component library. Figma account access was confirmed with two available workspaces; **new-file creation is awaiting owner workspace selection**. No live user testing or Figma review has happened yet.

## Current source of visual truth: Figma Resolution Studio (direction B)
The original Figma style and earlier source CSS are superseded **for the visual proposal** by the owner's rejection. Replacement native Figma file: https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l. This newer design uses dark forest `#19221D`, warm canvas `#F6F7F3`, ink `#202820`, primary citron `#D9EF78`, quiet border `#DFE3DB`, and DM Sans / IBM Plex Mono. The earlier blue/navy source tokens are **not yet synchronized** and remain only in the draft code. This Figma is a design proposal, not production, and uses example synthetic case data. The queue prioritizes row scanability and contextual review, while mobile shows all status options and places authorized next actions before notes. Every presented affordance must map to a functioning existing API or be clearly marked nonfunctional in implementation planning.

**Editorial design QA:** six native editable screens rebuilt and old rejected Figma nodes removed; owner acceptance pending, no interactive prototype or authoritative Code Connect mapping. If approved, update components/CSS and browser tests in a new reviewed source checkpoint rather than falsely claiming design/code parity.

## 2026 visual proposal superseding earlier tokens — Service Ledger

**Current design source:** [Figma page `01 · SERVICE LEDGER / Prototype (CURRENT)`](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l?node-id=14-2). Both earlier blue/navy and forest/citron two-surface dashboard themes are **REJECTED directions** and should not be implemented as the final UI.

**Pattern decisions:** Single task-oriented surface, top navigation (Queue / New request), unobtrusive status labels, case list with clear reference and item, click-to-expand a row in place, deliberate separate decision screen, approval/rejection confirmation, mobile full-width queue and case detail. No fake analytics charts, mock KPIs, gratuitous dashboard tiles, or permanently reserved right-side column. Sample data must stay synthetic.

**Reference tokens from editable layers:** canvas `#F8F8F4`, surface `#FFFFFF`, primary ink `#232625`, secondary text `#66716F`, separator `#E0E4DF`, action accent `#D95337`; typography `DM Sans` and `IBM Plex Mono` for small operational metadata. These are design tokens for a **candidate**, not production code tokens.

**Prototyping:** Figma ON_CLICK / NAVIGATE / OVERLAY / CLOSE reactions connect selected-case reveal, queue status example, representative search, creation and decision flows. Verified **106 valid reactions and no missing destination nodes** in current page audit. Figma search is not actual typed input; one query “Meera” is demonstrated. Active tab self-links are deliberately omitted. Read-only sample preview frames for non-primary cases ensure record labels and statuses match the destination.

**Implementation accessibility gate:** WCAG 2.2 [2.5.8 Target Size (Minimum)](https://www.w3.org/TR/WCAG22/#target-size-minimum) and [2.4.11 Focus Not Obscured](https://www.w3.org/TR/WCAG22/#focus-not-obscured-minimum) are **acceptance criteria for the eventual code**, not proven by the Figma prototype. Use semantic links/buttons, visible keyboard focus, minimum viable tap target sizes, clear control names, noncolor status cues, scroll management after inline expansion, and no keyboard trap in confirmations.

**Code parity:** PR #9 currently has an unrelated older visual implementation with its own passing CI; do not represent that code as Service Ledger. Correct next engineering step is a focused CSS/component rewrite from newly approved Figma, retaining all real server-authorized actions and input semantics, followed by new exact-head E2E screenshots/QA on 375/390 and desktop. No API/database changes planned.
