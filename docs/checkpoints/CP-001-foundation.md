# CP-001 — Foundation (partial)

Date: 2026-10-22. Predecessor: ed14c49d4de0cb5ad07c2f2263db405bef709429 (CP-000 receipt).
Authorization: user requested development continuation and four parallel engineers before the submission deadline.
Scope: Next.js App Router / React / Tailwind / TypeScript build foundation; team ownership and deadline governance. This does not satisfy business-rule requirements yet.

## Evidence
- Four assigned agents stopped with usage-limit errors. No agent commits or assigned-worktree changes were present. Integrator adapted a separately found default scaffold after inspection.
- `npm ci --no-audit --no-fund`: installed 370 packages; deprecated ESLint warning recorded.
- `npm run lint`: exit 0.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; static / and /_not-found generated.
- Default server start failed querying network interfaces in this environment. Explicit localhost start reported ready; follow-up HTTP request returned connection refused. HTTP smoke: NOT PASSED. Browser layout: NOT TESTED.
- PostgreSQL/migrations/domain/API tests/deployment: NOT RUN / not implemented.

## Review
Integrator self-review only. Reviewed source/configuration, package/lock consistency, documentation, preserved governance and scope. No template business app or remote fonts introduced. No secrets or customer data. Partial foundation may be published on integration branch; CP-001 overall remains INCOMPLETE. Main must not be represented as a finished product.
Publication: enclosing commit is the reviewed candidate; verify remote after push. User acknowledgment: PENDING.

## Next step
Continue CP-001 with pure domain schemas/policy and independent tests, then real PostgreSQL migration/connectivity. Fresh primary-source check required for those decisions. CP-002 depends on those gates; scaffold success alone does not open it.

## Parallel execution update
Following the user's correction, all four agents resumed concurrently and each confirmed execution available. Agent inventory showed all four RUNNING. Work remains incomplete until deliverables are integrated and gates executed. This update was self-reviewed against those tool responses; it does not erase the earlier usage-limit interruption or claim independent review has occurred.

## Integrated source candidate — 22 October 2026
Reviewed/combined domain f9d41f2, database 9a8025d, frontend 716f5aa, QA d8237b6; second parallel slice API 813287b+9729518+b0574f5, workspace 7611890, QA 956e9f7+c4a9c4a, runtime 444fbe0+803061d+b03e7b7+4c0391a. Local cherry-pick SHAs differ; original handoff identities are retained for review traceability. Ownership scopes checked; no cross-owner source overwrites or merge conflicts. Independent reviews are explicitly attributed in engineer handoffs.

Local integrated 106 unit/domain tests, lint, typecheck and production build passed. ES2022 target correction required clearing one stale incremental cache; Cache Components scaffold flags conflicted with explicit Node runtime and were removed after fresh official-source confirmation. Final workspace is keyed by request ID for record-state isolation. Clean dependency install passed with known tooling deprecation warnings.

Real PG launch blocked by environment identity/process restrictions; standard Chromium download failed. No bypass attempted. Authored isolated CI workflow uses a genuine PostgreSQL 16 service and local app; statically reviewed separately by API engineer. 57 HTTP and 12 browser scenarios are NOT YET EXECUTED. Migration/seed/constraints/concurrency remain pending CI. Checkpoint overall INCOMPLETE; API/UI source integration does not imply accepted CP-002–005.

Concrete review fixes: numeric note tie ordering, schema-derived retained-query-key allowlist, editable-only form payloads, mutation 5xx uncertainty, removed 404 view invalidation, async read sequencing and immediate known mutation state. Independent helper tests and focused regression cases retain these findings. README/setup/environment/test boundaries updated. Actual user acknowledgment stays PENDING.

Publication gate: exact final code/docs diff and workflow syntax checked before branch update; remote tree must match local reviewed tree. Keep PR draft until runtime gates clear. Next: observe exact-head CI, repair real failures, then provision deployment and validate public persistence; see NEXT_STEP.md. No deployment success is claimed.

Framework boundary clarification: production Next 16.4.2 normalizes __proto__ away before the Route Handler, confirmed by temporary local diagnostic keys[] and installed official querystring source. The resulting ordinary list requires PostgreSQL; missing DB caused 500 in the local diagnostic. Unknown retained keys and constructor are refused 422; duplicate parameters 400. Diagnostic logging was removed before the final candidate. Direct helper tests are not equivalent to raw production request normalization. QA expectation is adjusted to this observed framework contract without weakening any assignment business rule.

Final local evidence before publication: production build exit 0 after removing diagnostic code; production `/requests/new` HTTP 200; six actual HTTP boundary cases passed (malformed UUID 400, ordinary unknown query 422, constructor query 422, duplicate page 400, malformed JSON 400, invalid create body 422), all with consistent error envelopes and no database access. 106 unit/client tests passed; lint/typecheck passed; 12 browser scenarios discovered, not executed. 33 relative documentation links resolved, exact dependency pins/lockfile agreed, workflow YAML structure and all embedded shell blocks passed syntax checks. Separate integrator final diff review found no remaining blocker to publishing this explicitly incomplete runtime candidate. CI/postgreSQL/browser results remain pending; no acceptance is invented.
