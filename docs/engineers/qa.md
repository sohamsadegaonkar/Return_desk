# Independent API and browser verification handoff

Date: 22 October 2026. Branch: engineer/qa. Predecessor: integrated foundation 0efb2a2, containing the reviewed domain/database/frontend/verification components. Owner scope: tests/**, vitest.config.ts, playwright.config.ts, scripts/verify-api.sh and this handoff. User acknowledgment: pending. No push or merge was performed.

## Delivered acceptance cases

- 57 independently specified real HTTP cases in tests/integration/requests.api.test.ts. Includes all 25 status pairs, valid approvals and decimal refusals, normalized parallel duplicate creation, duplicate edit, reapplication after terminal status, removed Open uniqueness, locked details, merged contact edits, stale version precedence, simultaneous edits and approve/edit, remove/note race, append-only SQL refusals, chronological note identity tie, soft removal visibility, malformed/unknown/repeated query boundaries, combined filters/count/paging and literal wildcard search.
- Regression for an independently discovered API defect: SELECT id::text AS id with ORDER BY id can sort tied notes lexically. Inserts 12 same-timestamp notes crossing a numeric digit boundary and asserts HTTP order by exact numeric IDs. The API owner was informed by the database reviewer and supplied a qualified-column fix. Direct fixture insertion uses explicit IDs only in the isolated test database and never resets its sequence.
- Twelve Playwright scenarios: queue search/375px width, form creation/reload persistence, approval refund toggle and legal-action changes, two-tab stale edit preserving the unsaved draft, external removal clearing cached actions, and a note committed before an HTTP500 response. Each runs on desktop 1440×1000 and mobile 375×812. The response-loss test forwards the real mutation before replacing its response and checks the saved note, retained draft and disabled retry. Assertions use user-visible labels/roles, not implementation policy or CSS snapshots.
- Default npm test runs 99 domain tests plus seven client-boundary regression cases. HTTP suite has separate tests/integration/vitest.config.ts and must be invoked explicitly; this prevents accidental server/database writes during unit tests.

## Test isolation and execution

Start the app with DATABASE_URL equal to the isolated TEST_DATABASE_URL; the test runner's DATABASE_URL can identify a different demo/seed database. Require ALLOW_TEST_WRITES=1, TEST_DATABASE_URL with a test-marked database name, and loopback TEST_BASE_URL. Refuse a database matching optional DEMO_DATABASE_URL or PRODUCTION_DATABASE_URL. Suites first insert a connection probe directly into the known test database and retrieve it through the read-only API; only after that succeeds do they issue API writes. This avoids writing an API probe to an accidentally targeted demo app. Fixtures use unique identifiers and are retained; no truncation, deletion or cleanup mutates existing data.

Commands after migrations and local test-server startup:

```sh
ALLOW_TEST_WRITES=1 TEST_DATABASE_URL=<isolated-test-url> TEST_BASE_URL=http://127.0.0.1:3000 ./scripts/verify-api.sh
ALLOW_TEST_WRITES=1 TEST_DATABASE_URL=<isolated-test-url> TEST_BASE_URL=http://127.0.0.1:3000 npm run test:e2e
```

Executed locally:
- Strict standalone TypeScript checks of integration tests/config and browser tests/config: exit 0.
- ESLint of tests and configurations: exit 0.
- Domain and client-boundary suites: 106/106 passed, 3 files passed. Client tests ran in a temporary integration copy of the UI engineer’s latest pure helpers and this branch’s tests, using the parent-installed dependencies read-only. Mock fetch responses prove client uncertainty semantics only, never database behavior.
- Playwright discovery: twelve scenarios listed successfully. Discovery is not execution.
- HTTP suite without opt-in environment: exit 1 with explicit safety refusal before connection/writes. The cases were skipped because beforeAll failed, not counted as passed.
- Standard Playwright Chromium installation: exit 1 after download retries returned 0 MiB / corrupt ZIP. No browser executable was installed. No bypass attempted.

Real PostgreSQL/HTTP/business-rule/browser assertions remain NOT RUN in this local environment. CI with PostgreSQL16 and a normal Playwright browser download is the next runtime gate. No deployed app, seed runtime, persistence across process restart, browser visual certification or complete assignment compliance is claimed.

## Fresh primary evidence

Inspected on 22 October 2026:
- https://playwright.dev/docs/test-webserver — webServer lifecycle/configuration. Parent CI will start the real application explicitly; tests consume TEST_BASE_URL rather than reuse an unknown server.
- https://vitest.dev/guide/ — configuration and current runtime requirement Node22.12+. Actual installed Vitest5.0.5 is used with explicit configs; Vite emits a future config-loader warning, not an executed test failure.
- https://arxiv.org/html/2605.17242v1 — abstract and methodology3.1–3.2. Requirement-derived cases and observable browser outcomes inform this suite. Runtime failures must produce repairs rather than be reclassified as source-review successes. Preprint template publication metadata is not treated as a confirmed venue; no benchmark gains are promised.

No downloaded skill was the sole basis for these decisions.

## Review and next dependent step

Self-reviewed source/expected outcomes against the frozen API contract, owned-file scope, refusal precedence, safe test setup, exact numeric ordering, and observable browser labels confirmed with UI engineer. API DTO contracts were confirmed directly with API engineer. No implementation code was changed to satisfy these tests. Parent must review exact commit, integrate with API/UI/runtime checks, and execute the real PostgreSQL16/HTTP/Playwright gates before publishing a successful checkpoint. Update shared STATUS, NEXT_STEP, research log and checkpoint with actual results; acknowledge user approval only when received. Address concrete CI failures in their owning component and rerun affected checks.

## Runtime-review follow-up
The parent identified the mobile card’s accessible link name includes more than its reference. Queue tests now match an anchored reference prefix while excluding the separate Open-reference link. The database reviewer identified full-DTO spread leaking readonly properties into edit payloads; seven independent client cases now check the exact eight-field write allowlist against a DTO containing readonly fields, plus mutation500/408 uncertainty. The existing two-tab scenario includes a successful first edit before stale refusal, exercising the real browser edit boundary. The UI owner supplied explicit-field helpers and server404 recovery; tests consume those changes without modifying them. Updated files were self-reviewed, strict types and lint passed, and the twelve browser cases were discovered; actual browser execution remains blocked locally. The temporary lint run warned that a Next pages directory was absent in that minimal test copy; it still exited0. Parent integrated-tree checks are required.

## Framework normalization clarification
The parent’s production HTTP diagnostic showed Next16.4.2 removes a `__proto__` query key before the Route Handler sees it. Independently inspected installed official Next source `next/dist/shared/lib/router/utils/querystring.js`: `searchParamsToUrlQuery` reconstructs through an ordinary object, and `urlQueryToSearchParams` uses Object.entries. Thus422 cannot be required for an input no longer observable at the route boundary. The HTTP case now expects a normal200 list/data array for that normalized request, while requiring422 for ordinary unknown and constructor keys and400 for repeated known page keys. This clarifies framework input normalization, not a change to any of the five business rules. No framework patch, proxy workaround or weakened business-rule oracle was introduced. Direct module smoke remains distinct from production HTTP behavior. Full PostgreSQL-backed HTTP execution is still pendingCI.

## Success screenshot evidence
The existing queue scenario now captures `test-results/queue-desktop.png` and `test-results/queue-mobile-375.png` after a real searched record becomes visible and the no-horizontal-overflow assertion passes, before navigating to detail. These full-page screenshots support actual visual review through CI artifacts without adding or weakening a test case. Source change self-reviewed; no successful browser run or screenshot artifact is claimed until CI executes the scenario.

## 23 October 2026 — exact-head Playwright alert-locator repair

Predecessor: `integration/foundation` at `58d024f91f06bf3007f78f89472b36258afb377d` (draft PR #1). Actual GitHub Actions run [39831149037](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39831149037), job 120007303383, completed with a failed browser gate. The run passed install, lint, typecheck, 106 domain/client tests, PostgreSQL 16 migrations/seed/23 direct database assertions, production build, browser install and all 57 real HTTP tests. Ten of twelve Playwright executions passed. The two desktop/mobile failures are the same locator strictness error, not yet evidence of a failed product path: `page.getByRole("alert")` matched both the visible application's `ErrorBox` and Next's empty `__next-route-announcer__`.

Assigned fix scope: one assertion in `tests/e2e/workspace.spec.ts`, with no product/API/schema or acceptance-behaviour change. Scope the role=alert locator with the existing user-visible error heading `That action could not be completed`; independently assert the not-found/removed message, the absence of the removed request heading and the absence of edit/start-review controls. Do not use `.first()` to hide an ambiguous selector, skip a test or relax a required result.

Fresh official guidance consulted: https://playwright.dev/docs/locators (Strictness and Chaining filters); https://playwright.dev/docs/best-practices (user-facing locators and filtering); https://playwright.dev/docs/test-assertions (auto-retrying toContainText assertions). Technical decision is limited to selector uniqueness; no new research performance claim or feature-scope change.

Pre-publication review: exact source change inspected against failing CI log, actual `ErrorBox` heading, existing scenario and framework role-announcer collision; all other test assertions remain untouched. Runtime acceptance: **PENDING a new exact-head PostgreSQL+HTTP+desktop/mobile Playwright CI run**. Previous green checks are evidence only for `58d024f91f06bf3007f78f89472b36258afb377d`, not for a new head. User acknowledgment: PENDING; no acknowledgment inferred.

Next dependent step: publish this self-reviewed QA fix as a separate PR targeting `integration/foundation`; observe its actual CI. If both browser variants pass, integrator reviews PR diff, merges without overwriting other work, reruns the integrated exact-head gate and updates CP-001/STATUS/NEXT_STEP/RESEARCH_LOG. If CI fails, diagnose and fix the specific observed failure without masking acceptance criteria.
