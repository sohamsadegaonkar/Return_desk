# Request workspace engineering handoff

Date: 2026-10-22. Predecessor: integrated local foundation `0efb2a2` (domain, schema and independent domain tests). Branch: engineer/workspace. Only the assigned frontend routes/components/helpers/CSS and this handoff are changed. This component does not independently close CP-001 or later checkpoints.

## Delivered behavior

Real API-connected queue, new-request page and detail workspace at `/`, `/requests/new` and `/requests/:id`. Queue has URL-backed350ms debounced search, request cancellation and stale-read exclusion, combined status/reason/sort controls, deterministic server pagination, desktop table and375px card layout. Choosing a filter while typing preserves pending search text. Search URL changes preserve input focus; Back/navigation rehydrates its value.

Forms collect the frozen8 detail fields and use the shared domain create schema for creation. Editing uses an explicit editable-field allowlist on both DTO-to-draft and draft-to-payload boundaries; TypeScript parameter annotations do not strip runtime DTO keys. Client read DTOs are type-only imports from the API owner's canonical module.

Detail actions come only from server capabilities, including current-state rechecks after stale refresh. Native dialogs provide focus containment, Escape handling, and trigger-focus return. Approval clears refund amount immediately when switching resolution, sends string money only for Refund and explains that it records agreement without transferring money. Notes remain append-only and chronological per returned API order. Open removal warns that the normalized order/item remains blocked.

Drafts survive422/stale/network failures. Stale edits require an explicit current-version reconciliation before submitting again. Network/timeouts/unreadable responses and mutation5xx/408 enter uncertain-outcome recovery; no mutation auto-retries.20-second read/write fetch timeout prevents indefinite busy state.404 clears cached details, notes and capabilities. A monotonic read sequence prevents older refreshes from replacing newer records or a later404. Successful mutation DTOs update the authoritative displayed state immediately before refresh; known saved notes are appended without duplication, so a failed follow-up GET cannot restore old actions or hide known success. Removed records have a queue link and load refusal. New-request uncertainty links to an order search in a separate tab before explicit user continuation.

## Fresh evidence inspected

- React19.3 `useEffect`, https://react.dev/reference/react/useEffect — fetching data section including cleanup/race conditions and alternatives. Applied abort+sequence guards; retained Route Handler client reads required by the frozen architecture, while recognizing initial loading/no client cache tradeoff.
- Next16.4.2 `useSearchParams`, https://nextjs.org/docs/app/api-reference/functions/use-search-params — read-only query interface and static-rendering Suspense requirement. Queue is wrapped in Suspense; dynamic detail params are resolved below a Suspense boundary.
- TDDev2026, https://arxiv.org/html/2605.17242v1 — methodology3.1 and interactive-validation rationale. Acceptance scenarios are supplied to independent QA; build/source inspection is not claimed as browser correctness or as a performance gain from the paper. The preprint has template venue metadata.

## Review and executed checks

- `npm ci --no-audit --no-fund`: exit0,444 packages. Compatible pinned toolchain's ESLint and Drizzle upstream deprecation warnings retained.
- `npm run lint`: passed on final UI sources.
- `tsc --noEmit --target ES2020 --incremental false`: passed using a temporary read-only copy of API-owner DTO solely for local type resolution. That copy is excluded from the commit; API owner supplies the actual canonical DTO.
- Full local Next build attempt did not pass: first shared node_modules symlink was rejected by Turbopack's workspace boundary. Installed dependencies locally afterwards. The isolated baseline still targets ES2017, incompatible with foundation domain bigint literals; root integrator has fixed the target and cache configuration for the combined build. No successful final UI build or browser result is claimed here.
- Independent static review by database/runtime engineer found four actual defects: DTO spread leaking readonly fields into PATCH, cached removed-record rendering, mutation5xx uncertainty, and ignored successful mutation DTOs leaving stale state when follow-up reads failed. Fixed all four; reviewer re-inspected fixes. Added sequence guard for delayed detail refresh and passed the regression target to QA. Integrator independently reviewed current capability/recovery code and found the pending-search/filter issue, now fixed.
- Self-review covered exact owned file scope, no fake data/illegal action drawer, legal current actions, request cancellation, timeout recovery, narrow mutation payloads, labels, mobile wrapping, no secrets, and diff whitespace. Visual/mobile/real HTTP outcomes remain integration QA responsibilities.

## Next dependent work

Integrator reviews and cherry-picks this commit alongside the API owner's DTO/routes, runs lint/types/build and real PostgreSQL-backed browser journeys, then records exact results in shared checkpoint/STATUS/NEXT_STEP/RESEARCH_LOG before any push. QA has received accessible labels and the pure-helper regression target. Revisit primary sources for any material changes. No remote push or merge performed here. User acknowledgment remains pending; component delivery is not assignment completion.
