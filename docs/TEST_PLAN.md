# Verification plan

Status 23 October 2026: **PASS on isolated PostgreSQL16 CI** ([run 39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279), integration SHA `56fa9cf`): 106 domain/client, 23 PostgreSQL invariant assertions, 57 HTTP and 12 desktop/375px Playwright cases. Earlier 17/40 HTTP failure was corrected with enum casts and rerun; earlier browser selector failure was corrected. **Hosted external restart/persistence and public end-to-end flows remain NOT RUN.** Independent expected results come from REQUIREMENTS.md and assignment rules, never from the implementation policy under test.
Use Vitest plus real isolated PostgreSQL, direct HTTP Route Handler tests and Playwright. Do not use mock DB success as constraint evidence.

## Required cases
- All 25 status pairs: four legal edges, 21 illegal including self-transitions; use valid shape/current version.
- Approval resolutions: missing, invalid, null; refund zero/negative/excess precision/overflow; non-refund with amount; completion preserves resolution.
- Parallel identical normalized creates: one success, one conflict; duplicate edits; new live request after terminal status; removed Open still blocks.
- Edits frozen in Approved/Rejected/Completed; notes allowed in every visible state.
- Soft removal only Open/Rejected; retained DB rows; every removed-parent endpoint returns 404.
- Concurrent approve/edit and removal/note; stale versions cannot overwrite.
- References at 1, 999999 and 1000000; BIGINT JSON strings.
- Combined search/status/reason/sort/page; literal percent, underscore, backslash; matching total/count snapshot; out-of-range page.
- PATCH clearing last contact, omitted fields, whitespace-only contacts, forbidden fields, malformed IDs/JSON.
- Notes deterministic ordering and direct DB UPDATE/DELETE refusal.
- Restart persistence, clean migration, exact seed count and safe repeated seed refusal.
- Desktop/mobile browser journeys; debounce, stale-response handling, resolution toggle, two-tab conflict, persistent errors and uncertain-write messaging.

## Evidence and review
For each executed check record requirement ID, exact candidate, command, isolated environment, expected/actual, exit code, artifact/log reference and limitations. Avoid customer data/secrets in logs.
After each slice retest affected earlier paths; full release suite at CP-006. Use role/label locators and web-first assertions [R-006 in RESEARCH_LOG.md].
Add a bounded exploratory browser pass beyond scripted happy paths; separate automation failure from product failure. Runtime traces support correctness; coverage percentage alone does not.
Pre-push: applicable tests/build/type checks and exact diff review. Later CI repeats gates on the pushed SHA. The reviewed `.github/workflows/verify.yml` runs against an isolated PostgreSQL16 service on GitHub Actions. Its latest [successful exact-head outcome](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279) does not verify Render-hosted data. If a gate cannot run, record BLOCKED/NOT RUN rather than accepting it.

## New public smoke split: routine CI versus hosted acceptance
The `test:smoke-harness` Node test runner validates the live script's injected transport and opt-in guard **offline**. It makes zero network calls to Render. Manual `test:live:run` exercises synthetic public writes only with `RETURNDESK_LIVE_TEST=YES`; `test:live:verify` is read-only and must occur after actual Render restart to count as persistence evidence. Public seeded read-only evidence is user-provided HTTP 200 with 36 returned rows and one note on a fixed synthetic seed; production-write test result and restart persistence remain **NOT RUN**.
