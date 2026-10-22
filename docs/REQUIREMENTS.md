# Requirement traceability

Local domain/client suite: 106 tests passed. Real PostgreSQL, HTTP workflow and browser acceptance remain pending the isolated CI gate. IDs below are stable test/review references.
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
| SEED-01 | At least 30 across all statuses/reasons, some notes | Plan: exactly 36 visible rows |
| SUB-01 | Public deployed app and public GitHub, no ZIP | Clean external smoke check |
| SUB-02 | README setup, env example, migrations/seed, assumptions, actual hours | Clean-machine rehearsal |
| SUB-03 | Genuine incremental commits and explainable own work | History and walkthrough |

Reasons: Damaged, Wrong Item, Size Issue, Not As Described, Changed Mind.
Rubric: business rules 25; data model 20; API 20; frontend 20; code quality 10; submission 5.
Mandatory assignment rules outrank research-driven preferences. Record any ambiguity in DECISIONS.md rather than changing acceptance tests to fit the implementation.
