# Verification plan

Status: 106 domain/client unit tests passed locally; 57 real-HTTP cases and 12 browser scenarios authored, runtime execution pending CI. Independent expected results come from REQUIREMENTS.md and assignment rules, never from the implementation policy under test.
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
Pre-push: applicable tests/build/type checks and exact diff review. Later CI repeats gates on the pushed SHA. No CI workflow currently exists. If a gate cannot run, record BLOCKED/NOT RUN and do not claim successful checkpoint.
