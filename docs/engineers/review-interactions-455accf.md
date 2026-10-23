# Independent interaction review — PR #9 at 455accf

Reviewed on 23 October 2026 by the interaction-review agent, independently of the implementation author. Candidate: `455accfbd2385d315dc567d87aa0d16954056fae`; predecessor: `b52256872cc7026d11ccc1884763d8ff8b6eba64`. Branch: `review/interactions-455`. This handoff changes no application, test, contract or shared checkpoint files.

## Scope and acceptance

Read `AGENTS.md`, README, STATUS, NEXT_STEP, CP-007, UI_SPEC, API_CONTRACT and REQUIREMENTS before reviewing the exact candidate diff and complete affected interaction paths. This review depends on the CP-007 candidate and its existing exact-head CI, not on the older hosted deployment. Requirements: LIST-01, UI-01, UI-02, RULE-01/02/04/05 and NOTE-01. Acceptance: real controls must preserve server-owned legality, URL/query consistency, draft recovery and clear visible current state; review-only work must not mutate live data or collide with another engineer's ownership.

## Outcome

**No new blocking interaction regression found in the PR #9 diff.** This is a source review supported by existing CI and two inspected CI screenshots; it is not a new live-browser acceptance or human visual approval. Existing accessibility and navigation follow-ups below remain explicit.

| Interaction | Inspected behavior and evidence | Assessment |
| --- | --- | --- |
| Status chips and pending search | `queue.tsx:37–59,103–118`: chips use the same `change` function as select controls. It flushes the current trimmed search and deletes page; other filters remain. Timer cleanup prevents an obsolete debounce after query change. | No separate, drifting filter implementation introduced. |
| Clear search and reset | `queue.tsx:146–155`: clears the local input and removes `q` and `page`, preserving status/reason/sort. Clear filters navigates to `/`. Query changes resynchronize the controlled input. | Correct static flow; CI covers ordinary clear-search behavior. Very rapid concurrent router navigations are not independently exercised here. |
| Read races/loading | Queue aborts old reads and checks the abort signal before applying either success or failure. `pending` compares the loaded query to the active URL. Workspace retains sequence guards around initial/manual reads and known mutations. | No stale-response regression found. |
| Real navigation | Shell supplies links to `/` and `/requests/new`, section-specific current styling, and request links point to real detail routes. Detail remains keyed by ID. | No decorative navigation controls or cross-record draft reuse added. |
| Progress and mobile action order | Saved status drives `aria-current="step"`; Rejected takes the valid Open→In review→Rejected branch. Progress has no mutation controls. Notes follow the decision aside in DOM. | Consistent with legal server capabilities. CI checks Open→In review and mobile decision-before-notes geometry; other progress states were inspected statically. |
| Decision forms/dialogs | Existing native-modal open/cancel/close behavior and focus-return attempt are unchanged. Refund selection still clears its amount when switching resolution, omits it from other-resolution payloads and uses server capability checks for visible legal actions. | No rule enforcement change. Focus behavior when a successful action removes its own trigger is not proven by existing tests. |
| Stale version and removed records | Dialog records the opening version; server failures refresh current state without overwriting the draft. Submission stays disabled until explicit draft/version reconciliation. REQUEST_NOT_FOUND clears cached record/actions. | Recovery remains intact; existing CI scenarios cover stale edit and external removal. |
| Interrupted writes and notes | `api.ts` classifies write transport/unreadable/5xx/408 responses as uncertain. Workspace blocks further submission, preserves input and requires authoritative refresh/review. Known note success appends by ID with timestamp/BIGINT ordering. | No automatic replay introduced. Existing interrupted-note test proves one submitted note despite a fabricated post-commit 500, not general exactly-once delivery. |

## Inherited follow-ups, not new PR #9 regressions

1. **Dialog accessible name:** `request-workspace.tsx:617–635` has a visible heading but no `aria-labelledby`/`aria-label` on the native dialog. Wire the heading ID to the dialog in a narrowly reviewed follow-up; verify its computed accessible name and keyboard closure/focus. W3C APG explicitly requires a dialog name. Existing role-only Playwright locators do not check that name. This does not invalidate the business workflow, but the interface should not be described as comprehensively accessibility-verified.
2. **Filtered return path:** queue→detail browser Back retains the URL entry, whereas the visible “Back to queue” links and All requests navigation use `/`, clearing the filtered queue. This predates the redesign. A return-to-query feature would need an explicit contract and safe internal URL handling; do not claim the visible back link preserves the queue query.
3. **Focus after a successful transition:** the existing code tries to refocus the old trigger even when that trigger disappears because the action is no longer legal. A future keyboard pass should confirm a meaningful next target, such as the status summary or next legal action. No new keyboard-runtime verification was performed in this review.

## Fresh evidence inspected

Evidence was retrieved online during this review, rather than relying only on a bundled skill. These sources guide the review method; they do not prove this app correct.

- [Le et al., Automated Web Application Testing, arXiv:2506.02529v1](https://arxiv.org/html/2506.02529v1): read sections 3.1/3.2 (navigation edges, conditional form states/backtracking), 5.3 (interaction/coverage metrics) and 6.1/6.2 (dynamic-form/validation limitations). Applied separate checks for reachable navigation, conditional refund-field transitions and recovery states. The paper's form-field coverage metric is not equivalent to exhaustive lifecycle or concurrency coverage; no “all failure modes solved” claim follows.
- [React 19.3 useEffect](https://react.dev/reference/react/useEffect): read dependency/cleanup reference and “Fetching data with Effects,” including stale-response guards and the stated tradeoffs of manual fetching. Applied to queue abort checks and workspace generation guards. Installed React is 19.3.0.
- [Next.js 16.4.2 useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params): read read-only query semantics, Suspense requirement, layout staleness and query-update example. Queue owns the client hook and the page retains Suspense.
- [Next.js useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router): read push/replace/history and trusted URL guidance. `replace` keeps one active queue entry rather than creating history per search keystroke; normal detail links still create a returnable history entry. Installed Next is 16.4.2.
- [W3C APG modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): read keyboard focus/closure and accessible-name requirements. Used to document the inherited name/focus limitations above, without claiming a screen-reader audit.

## Verification actually performed

- Read the exact `b522568..455accf` interaction diff and the affected queue, Shell, form, detail, API-client and route-key source; inspected the eight browser scenarios in `tests/e2e/workspace.spec.ts`.
- Parent integrator supplied exact-head successful [CI run 39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084): 106 unit/client, 57 HTTP, 23 PostgreSQL assertions and 16 desktop/mobile browser runs. This reviewer did not rerun those suites or independently retrieve job logs.
- Visually inspected exact-head CI `queue-mobile-375.png` and `detail-mobile-375.png` in the supplied evidence directory. All six status chips are visible and wrapped; the detail decision panel precedes notes. These are still images from the isolated browser test, not a hosted walkthrough.
- No live Render requests, synthetic writes, seed/reset operations or full test reruns were performed. No deployment, merge, push, Figma authorship or user acknowledgment is asserted.
- Final handoff diff self-reviewed and `git diff --check` passed before local commit. Application assessment is independent of the author; this report's own wording review is self-review.

## Next dependent step

Integrator should reconcile this handoff with the other parallel reviews, accurately update CP-007/STATUS/NEXT_STEP, and decide whether to land a small dialog-name/focus follow-up before final browser acceptance. Share the exact candidate screenshots with the owner for actual visual acknowledgment, then perform the authorized merge/deployment and hosted acceptance in dependency order. Existing green CI does not replace that acknowledgment or hosted checks. This local review is ready for integration; it has not been pushed.

## Authorized follow-up after the review commit

The integrator explicitly requested the dialog-name fix after review commit `175b09c`. `RequestWorkspace` now calls React `useId` unconditionally and connects the native dialog's `aria-labelledby` to its visible action heading. The existing approval browser scenario now asserts the computed accessible name “Approve this request.” The focus-after-disappearing-trigger and filtered return-path observations remain unchanged.

Freshly read [React 19.3 useId documentation](https://react.dev/reference/react/useId), specifically the unique accessibility ID example, top-level Hook restriction and hydration discussion, alongside the W3C dialog naming requirements above. This confirms the small implementation choice; no package or behavior redesign was needed.

Verification on this local follow-up: targeted ESLint for the changed component and browser spec **passed**; TypeScript `--noEmit --incremental false` **passed**; exact three-file follow-up diff self-review and `git diff --check` **passed**. Existing dependencies were linked from the sibling checkout; no install or lockfile change occurred. The new browser assertion was **not run locally**, and the earlier 455accf CI cannot prove later follow-up bytes. Integrator must review this patch and run the affected approval browser scenario (desktop and mobile) before treating that behavior as verified. No push, merge, deployment or live mutation occurred. Shared checkpoint/research updates belong to the integrator.
