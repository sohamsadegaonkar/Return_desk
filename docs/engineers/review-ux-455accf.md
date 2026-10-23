# Independent UX visual/source review — PR #9 at 455accf

Date: 23 October 2026. Reviewer: parallel agent `ux_review_current`. Review scope is frozen at `455accfbd2385d315dc567d87aa0d16954056fae`; local branch `review/ux-audit-455` starts at that commit. This report is the only owned change. No product code, shared checkpoint, release state, or public demo data was changed.

## Dependency and acceptance criteria

Predecessor: CP-006 accepted hosted backend/workflow evidence → CP-007 unmerged UI v2 candidate. Read `AGENTS.md`, `README.md`, `docs/STATUS.md`, `docs/NEXT_STEP.md`, CP-007, the UX v2 handoff and requirement traceability before reviewing. Requirement references: UI-01, UI-02, CREATE-01, LIST-01, RULE-01–05, NOTE-01.

Acceptance criteria for this independent review:

- Inspect all six supplied exact-head CI screenshots, including 375px layouts.
- Check source for navigation, status clarity, task order, legal action visibility and likely focus/error usability.
- Distinguish screenshot/source evidence from actual browser interaction and human approval.
- Report concrete findings without adding product scope or weakening assignment rules.

## Evidence and limits

The integrator supplied CI run [39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084), job 120203014748, at the exact review head. Screenshot artifact 12474030697 has integrator-verified SHA256 `25a841ecd664c73b50a673d992af627294c300e3a9acf2b2bdca5c2529c059de`. This reviewer inspected the extracted PNGs directly using the image-view tool; did not independently re-download the artifact, rerun CI or claim the supplied CI outcome as a new test run.

All six inspected files were in `/workspace/scratch/f23c2426ac35/ci-evidence-uxv2-455accf/`:

| File | Observed state | Assessment |
| --- | --- | --- |
| `queue-desktop.png` | Filtered single Open request with deliberately long synthetic strings | Search, filters, reference, status, view link and pagination remain visible; columns wrap long content. |
| `queue-mobile-375.png` | Same kind of filtered queue rendered as a card | All six status chips are visible through wrapping; search/reset/filter controls and card remain within viewport. |
| `create-desktop.png` | Filled customer/order/item form | Grouped sections and right-side explanation provide clear hierarchy; primary submit follows fields. |
| `create-mobile-375.png` | Filled form stacked vertically | Labels and fields remain readable; action buttons are full width; helper content follows the form. |
| `detail-desktop.png` | In review, no notes | Saved status, customer/item context and next actions are distinct; decision panel is prominent. |
| `detail-mobile-375.png` | In review, no notes | Item/customer precede decisions; decisions precede notes; long synthetic identifiers wrap inside cards. |

These are isolated CI screenshots with synthetic fixtures. They are neither hosted Render UI v2 evidence nor editable Figma frames. Screenshot visibility cannot prove keyboard operation, screen-reader announcements, scrolling behavior, tap success, browser-native dialogs, network recovery, or all lifecycle states. Queue evidence has one filtered row; it does not show the unfiltered 36-row seed or multiple pagination pages. The detail screenshots show In review only.

Reviewed source: `src/components/{ui,queue,new-request,request-fields,request-workspace}.tsx`, `src/app/globals.css`, and `src/domain/requests/policy.ts`. Comparison against integration `b52256872cc7026d11ccc1884763d8ff8b6eba64` was used to distinguish inherited issues from v2 changes.

## Result and findings

**No blocker or major visual regression established within the six screenshots.** Two concrete medium-priority accessibility issues merit a bounded follow-up before final accessibility acceptance. They do not justify claiming full WCAG conformance or changing the domain/API.

### UX-01 — mutation dialogs have no programmatic accessible name (medium; inherited)

`src/components/request-workspace.tsx:617–635` renders a native `<dialog>` and visible action `<h2>`, but neither `aria-labelledby` nor `aria-label` associates a name with the dialog. The nested heading alone does not name the dialog. This affects edit, approval, removal and other confirmation actions. Native `showModal()` supplies modal behavior, but does not create an accessible name from an arbitrary heading.

The same omission exists in the integration predecessor, so this is an existing accessibility defect rather than evidence that UI v2 broke modal naming. Minimal follow-up: give the action heading a stable ID, reference it from the dialog with `aria-labelledby`, and check the rendered accessibility tree plus keyboard opening/closing. Existing `onCancel`, visible close/cancel controls and trigger-focus restoration are present in source; actual focus behavior remains unverified here. When a completed action removes its original trigger, verify focus moves to a logical remaining element.

### UX-02 — low-contrast static progress text and placeholders (medium; v2 tokens)

`src/app/globals.css:1219–1233` renders future progress-step labels at 12px desktop / 10px mobile with `#8a98ad` on white, calculated **2.9267:1**. Number text uses `#8898ad` on `#f7f9fc`, calculated **2.7880:1**. These future-stage labels convey workflow information in ordinary static text; they are not disabled interactive controls. They should remain readable even though they are visually secondary.

Additionally, `.input::placeholder` at line 1112 uses `#8191aa` on white, calculated **3.1992:1**. WCAG contrast guidance includes placeholder text. This is visible on the note input; its visible label means the placeholder is not the sole instruction, but the contrast issue still exists. Minimal follow-up: choose darker text tokens that reach at least 4.5:1 on their actual backgrounds, retaining distinct active/completed styling. Ratios were calculated from source sRGB colors using WCAG relative luminance, not inferred from anti-aliased screenshot pixels. These checks cover the stated pairs only, not every color in the application.

## Source-supported positive observations

- Navigation uses actual Next links, and status chips use buttons with `aria-pressed`; the selected status and dropdown share URL state. Detail marks All requests as the active parent destination. No fake analytics or inactive navigation features were added.
- Customer/contact fields explain the name-plus-one-contact requirement; required markers sit beside labels. Create explains the generated reference and post-save destination. Long prefilled input values naturally scroll inside their controls rather than expanding layout.
- Status badges include text rather than relying only on color. The progress strip marks the current saved stage with `aria-current="step"`, changes to the rejected branch when status is Rejected, and is not presented as clickable navigation.
- Visible mutation buttons derive from server capabilities. Source preserves Open→In review, In review→Approved/Rejected, Approved→Completed; edit/removal eligibility comes from the existing capability contract. No forbidden action testing drawer is present. Conditional approval clears refund amount when resolution changes.
- Error boxes use `role="alert"`, success/loading use status roles, and common text-field errors use `aria-describedby`. Network uncertainty blocks blind repeat mutation and offers authoritative refresh while preserving drafts. This is source inspection, not a fresh exercised recovery test.
- Source has a skip link, focus-visible styles, native form controls, reduced-motion handling and large primary controls. At 375px, action controls appear adequately spaced in screenshots. The W3C target criterion is 24×24 CSS pixels with exceptions; an informal 44px design preference must not be presented as the WCAG minimum.

## Fresh source inspection, actual depth and bounded application

Accessed 23 October 2026 directly from the public internet. No predownloaded skill was used as sole design evidence.

| Primary source | Actual inspected content | Applied conclusion and limits |
| --- | --- | --- |
| [W3C Understanding Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | In Brief, SC, Intent, Basic text reflow, single-column discussion (opening sections through approximately line 80) | Review layout containment and preservation of information; the requirement discusses 320 CSS pixels. Passing supplied 375px screenshots cannot establish 320px/400% zoom conformance. |
| [W3C Understanding Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | SC, exceptions, Size requirement and Spacing introduction (through approximately line 96) | Review dense controls and distinguish the 24px criterion from optional larger targets. Screenshots do not supply DOM hit-box measurements. |
| [W3C APG Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | About, keyboard interaction, focus notes, roles/states/properties (through line 72) | Identify the missing dialog accessible name and specify a targeted browser check. Native semantics were not dismissed merely because explicit `role`/`aria-modal` are absent. |
| [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | SC/Intent, source-color advice, placeholder discussion (through approximately line 101) | Calculate concrete source-color ratios, distinguish static labels from inactive-control exceptions, and avoid a screenshot-only conformance claim. |
| [TDDev: From Runnable Code to Shippable Applications](https://arxiv.org/html/2605.17242v1) | Abstract, task formulation, methodology sections 3.1/3.2 and the opening methodology overview; not a full-paper replication or experiment audit | Adapt the requirements→observable browser outcome loop: recorded screenshots/source review are bounded evidence and cannot substitute for interactive deployed acceptance. This is an arXiv preprint; its displayed venue/DOI metadata includes template placeholders. No performance guarantee or venue endorsement is inferred. |

The research supports the review method and targeted accessibility corrections; it supplies no reason to add features, change the assignment lifecycle, or bypass visual approval.

## Validation, acknowledgment and next dependent step

Local validation performed for this report: exact review HEAD checked; six images viewed; source and predecessor compared; three stated contrast ratios calculated; report diff reviewed for scope, inaccurate interaction claims, unsupported approval and secrets; `git diff --check` passed before the local report commit. Application test suites were not rerun for this Markdown-only review.

Reviewer verdict: no major visual blocker found in the supplied states; two medium accessibility corrections are recommended for the integrator's decision. **Human visual acknowledgment remains PENDING.** This independent review is not owner approval and is not a merge/deploy authorization.

Next dependent step: the integrator consolidates parallel reviews, addresses accepted bounded findings, runs the relevant UI/accessibility checks on any resulting source head and refreshes evidence. Present the actual six-screen candidate for human visual review, resolve the known Figma authoring permission prerequisite, then follow the existing CP-007 merge/deploy gate. Hosted desktop/375px keyboard and visual acceptance remains a separate release check; do not reseed or make public writes for this review. Every accepted checkpoint must update its Markdown evidence and next dependent step; record human acknowledgment separately from test success and review before each push.
