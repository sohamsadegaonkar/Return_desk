# Requirement traceability

As of 23 October 2026, **isolated UI-candidate CI passed** on exact source `455accfbd2385d315dc567d87aa0d16954056fae` ([run 39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084)): 106 unit/client tests, 23 PostgreSQL 16 assertions, 57 HTTP cases and 16 desktop/375px browser project scenarios (8 scenarios × 2 projects).

Separately, [CP-006](checkpoints/CP-006-render-release.md) records hosted migration/seed, public API read/write workflows and persistence **across a completed Render deployment** on `83873e98d87ad432d91b26877a346fd73bbe1b1d` as PASS. A physical host restart has not been independently verified. The UI v2 candidate is not deployed; final hosted desktop/375px browser acceptance and submission gates remain pending. IDs below are stable test/review references, not a claim that every acceptance gate is complete.

| ID | Requirement | Verification target |
|---|---|---|
| STACK-01 | App Router + React, Node backend, PostgreSQL, Tailwind | Dependency/build/runtime review |
| STACK-02 | Original scaffold; no admin/CRUD boilerplate or generated BaaS CRUD | Repository provenance and handwritten routes |
| DATA-01 | PostgreSQL persistence across application restart | Create, restart, retrieve |
| CREATE-01 | Customer/contact, order/item, quantity and exact five reasons | HTTP validation and browser create |
| REF-01 | System-generated human-readable unique reference | Parallel create and six-digit boundary |
| LIST-01 | Customer/order/reference search + status/reason + sort/page in SQL | Combined query assertions |
| UI-01 | No per-keystroke search; only legal actions; readable status | Debounce and state-specific browser checks |
| UI-02 | Loading/empty/error, useful refusal, usable at 375px | Rendered state checks |
| RULE-01 | Exactly four legal lifecycle edges; terminal states final | Independent 25-pair transition matrix |
| RULE-02 | Approval resolution; positive refund only for Refund | Null/zero/negative/precision/other-resolution cases |
| RULE-03 | One live normalized order/item, including removed Open | Concurrent create and duplicate edit |
| RULE-04 | Lock details after decision; notes remain allowed | Direct API calls across every status |
| RULE-05 | Soft removal only Open/Rejected; no later fetch | Visibility and DB retention |
| NOTE-01 | All notes chronological and append-only | Tie ordering and SQL mutation refusal |
| API-01 | Honest status codes and consistent JSON failures | Malformed input, missing, invalid, conflict |
| SEED-01 | At least 30 across all statuses/reasons, some notes | Clean seed creates 36 visible synthetic requests; later smoke writes change the count |
| SUB-01 | Public deployed app and public GitHub, no ZIP | Clean external smoke check |
| SUB-02 | README setup, env example, migrations/seed, assumptions, actual hours | Clean-machine rehearsal |
| SUB-03 | Genuine incremental commits and explainable own work | History and walkthrough |

Reasons: Damaged, Wrong Item, Size Issue, Not As Described, Changed Mind.
Rubric: business rules 25; data model 20; API 20; frontend 20; code quality 10; submission 5.
Mandatory assignment rules outrank research-driven preferences. Record any ambiguity in DECISIONS.md rather than changing acceptance tests to fit the implementation.
