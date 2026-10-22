# Research register

Checked: 2026-10-22, Asia/Kolkata. Sources retrieved live during CP-000. This is a focused evidence review, not a systematic literature review. No experiments reproduced.

| ID | Primary source/version | Inspected depth | Finding and ReturnDesk adaptation | Limitation / decision |
|---|---|---|---|---|
| R-001 | [From Runnable Code to Shippable Applications](https://arxiv.org/html/2605.17242v1), 17 May 2026, v1 | Abstract and methodology sections 3.1–3.2 | Structured expectations followed by actual browser interactions and failure reports. Use requirement-led acceptance tests and actionable defect records. | Preprint; metadata contains template placeholders. No venue claim or transferred gain. Adopt workflow principle only. |
| R-002 | [IWC-Bench](https://arxiv.org/html/2609.15387v1), 14 Sep 2026, v1 | Abstract and sections 3.3, 4.1–4.4 | Organizes runtime interaction evidence and distinguishes requirement alignment, usability and appearance. Add exploratory interaction evidence to scripted acceptance checks. | Benchmark-specific instrumentation/judging; do not add its agent framework or adopt its score as our rubric. |
| R-003 | [PostgreSQL 16 partial indexes](https://www.postgresql.org/docs/16/indexes-partial.html), section 11.8 | Unique partial index example | Database uniqueness can apply only to rows satisfying a predicate. Retain status-based live-item unique index. | Query-planner index usage differs from uniqueness enforcement. Does not establish removal semantics; assignment interpretation does. |
| R-004 | [PostgreSQL 16 explicit locking](https://www.postgresql.org/docs/16/explicit-locking.html), section 13.3.2 | Row locking behaviour | FOR UPDATE serializes conflicting writers until transaction end. Use short existing-parent transactions plus version checks. | Locks do not prevent every deadlock or protect absent rows. Creation still needs unique index. |
| R-005 | [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist), current retrieved page | Routing, fetching/caching and security sections | Keep client boundaries deliberate and inspect caching/error behaviour. Client reads may use Route Handlers; avoid Server Components calling their own HTTP routes. | Version-sensitive; pin actual package first. We retain Route Handler mutations rather than adopting its Server Action suggestion. |
| R-006 | [Playwright best practices](https://playwright.dev/docs/best-practices), current retrieved page | Locator and web-first assertion sections | Prefer user-facing role/label selectors and awaited assertions. | Good test mechanics do not guarantee sufficient coverage. Adopt in UI test slice. |
| R-007 | [TDDev original](https://arxiv.org/abs/2509.25297), v2, 1 Oct 2025 | Metadata/abstract page only this pass | Confirms original paper identity for inherited architecture references. | Do not call this a full-paper review. R-001 provides the newly inspected methodology. |
| R-008 | [Screen Transition Graph testing](https://arxiv.org/abs/2506.02529), v2, 19 Feb 2026 | Metadata page only this pass | Confirms title/version for inherited reference. | Full relevant sections still to inspect when selecting navigation-test technique. |

## Discovery not yet adopted
EvoWeb, arXiv:2610.16402, surfaced in live search as October 2026 work on cumulative app development. Direct primary-page retrieval failed. Treat as a lead only, not studied evidence; no design decision depends on it.

## Search audit
- site.nextjs.org docs app production checklist data security route handlers
- site.arxiv.org 2509.25297 TDDev
- site.postgresql.org docs current explicit locking partial indexes
- site.arxiv.org 2026 web application generation testing agents benchmark (recent window)
Selected version-specific PostgreSQL 16 documentation rather than blindly adopting current-version behaviour.

## Next research question
CP-001: verify actual Next.js/Node/Drizzle compatibility, generated-column migration support and interactive PostgreSQL transactions on the selected deployment driver. Record exact pinned versions and official source sections. Current docs-only evidence does not settle these implementation details.

## R-009 — Foundation implementation recheck (2026-10-22)
Primary sources freshly retrieved: https://nextjs.org/docs/app/getting-started/installation (Quick start, system requirements and CLI defaults); https://arxiv.org/html/2605.17242v1 (abstract rechecked; methodology previously recorded in R-001).
Decision: use create-next-app scaffold with App Router, TypeScript and Tailwind; preserve repository instructions rather than replace them with generated AGENTS.md. Pin actual installed package versions and lockfile. Installed Next 16.4.2 and React 19.3.0; Node 24.19.0 satisfies documented minimum 20.9. Removed remote Google font dependency from layout to keep the build independent of font fetching.
Research implication: build success is only a foundation check, not evidence that business workflows pass acceptance tests. No paper performance figures are generalized to this project. Skills alone were not the evidence source. Generated cache defaults remain scaffold-only; review before adding dynamic request reads.
Caveat: npm warned that installed scaffold ESLint 9.39.5 is out of support. Lint passed; dependency support review remains open before release.

## R-010 — Parallel foundation and workflow implementation (2026-10-22)
Actual fresh source sections and limitations are retained in docs/engineers/domain.md, database.md, frontend.md, verification.md, api.md, workspace.md, qa.md and runtime.md. These are component evidence records; runtime success is not implied by source review. TDDev methodology 3.1–3.4 was freshly inspected by engineers to ground independent acceptance tests. No earlier claimed numeric gain is adopted.
Integrator additionally inspected https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs (setup-node, npm ci, build/test) and https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers (Ubuntu runner, health checks, port mapping), plus actions/checkout and actions/setup-node official repositories. Decision: PostgreSQL 16 service in CI provides a legitimate runtime gate where local nonroot process launch is blocked. This is pending observed execution, not a substitute success claim.
Fresh Next 16.4.2 docs https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents and https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config confirmed Cache Components disallows explicit runtime exports. Observed integrated build failure matched that documented incompatibility. Disabled scaffold Cache Components/partial-prefetch flags, keeping explicit Node runtime and dynamic Route Handlers. ES2022 target supports exact BigInt monetary arithmetic; stale incremental cache was cleared once after observed diagnostics.
Independent PostgreSQL ORDER BY review found id::text output alias sorting notes lexically on tied timestamps; API qualified base BIGINT columns, with an independent >=12-note regression. Actual production HTTP probing exposed special query-key normalization that direct module smokes did not reproduce. Diagnostic reads showed Next 16.4.2 removes __proto__ before the handler, so its request becomes a normal list read; missing local DB configuration explained the 500. Installed official Next source shared/lib/router/utils/querystring.js confirmed object/query reconstruction. A schema-derived own-key allowlist rejects retained unknown keys (including constructor); it cannot reject information removed by the framework. QA records this framework boundary separately from the five business rules. Record final production boundary probe after rebuild.

React state isolation recheck: https://react.dev/learn/preserving-and-resetting-state, “Option 2: Resetting state with a key” and “Resetting a form with a key” inspected. Applied per-request component identity; this is framework lifecycle behaviour, not a claim of new research performance.
