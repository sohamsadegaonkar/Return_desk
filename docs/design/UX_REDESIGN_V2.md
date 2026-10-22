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
