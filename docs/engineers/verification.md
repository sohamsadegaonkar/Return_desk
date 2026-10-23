# Verification engineer handoff — CP-001 foundation

Date: 2026-10-22. Predecessor: CP-000 reviewed documentation baseline `ed14c49d4de0cb5ad07c2f2263db405bef709429`. Branch: `engineer/verification`. Owner scope: `tests/**`, `vitest.config.ts`, this handoff. Deadline: 23 October 2026, 11:00 AM Asia/Kolkata.

## Delivered and reviewed

Two independent domain contract suites and a Node-environment Vitest configuration. The lifecycle oracle hardcodes all 25 source/destination outcomes from the frozen assignment contract rather than importing implementation expectations. Tests cover visible/removed action capabilities; strict creation; contact normalization; integer boundaries; partial contact edits against merged state; approval resolution and exact decimal limits; deferred approval semantics; notes; removal versions; list defaults and allowlists.

Requirement coverage: RULE-01 lifecycle policy; RULE-02 approval validation; RULE-04 edit policy; RULE-05 removal policy; CREATE-01 payload validation; NOTE-01 body validation; LIST-01 query validation. These are domain-level checks only. Direct HTTP status/response behavior, database concurrency/immutability, rendered UI, deployment and complete assignment compliance remain unverified by this suite.

## Fresh source evidence

Inspected online on 2026-10-22; this work was not based solely on a downloaded skill.

| Source | Reading depth | Decision and limitation |
|---|---|---|
| [Vitest getting started](https://vitest.dev/guide/) | Installation/runtime requirements and configuration guide | Use explicit Vitest imports and isolated Node tests; host Node 24.19.0 satisfies current documentation baseline of Node 22.12+. Installed Vitest is 5.0.5. |
| [Playwright best practices](https://playwright.dev/docs/best-practices) | Testing philosophy: user-visible behavior and test isolation | Next browser slice must test actual actions/outcomes with independent state. No browser success is claimed for domain tests. |
| [From Runnable Code to Shippable Applications](https://arxiv.org/html/2605.17242v1), v1, 17 May 2026 | Methodology sections 3.1–3.4, not merely abstract | Define stable expected outcomes before integration, execute, report failures, retain regression tests. Browser validation is still required later. This is a preprint with template publication metadata; no venue or performance guarantee is asserted. |

## Execution evidence

Executed in `/tmp/returndesk-qa-foundation`, populated with copies of this branch's tests/config and domain engineer's `src/domain/requests`. Dependencies were linked read-only from frontend owner's installed `node_modules`; neither other worktree was changed.

- `node /tmp/returndesk-qa-foundation/node_modules/vitest/vitest.mjs run --root /tmp/returndesk-qa-foundation` — **99 tests passed, 2 files passed**, Vitest 5.0.5.
- `node /tmp/returndesk-qa-foundation/node_modules/typescript/bin/tsc --noEmit --target ES2022 --module ESNext --moduleResolution Bundler --strict --skipLibCheck --esModuleInterop /tmp/returndesk-qa-foundation/tests/domain/policy.test.ts /tmp/returndesk-qa-foundation/tests/domain/schemas.test.ts /tmp/returndesk-qa-foundation/vitest.config.ts` — exit 0.
- Temporary copy emitted a Vite future native-config-loader warning because it lacks a package manifest. This did not fail execution; integrated package configuration is owned by frontend and must be rechecked there.
- Exact staged diff reviewed for independent expected values, meaningful boundary coverage, TypeScript correctness, no secrets and ownership. `git diff --cached --check` passed before commit.

## Independent migration inspection

Read `returndesk-database/drizzle/0000_initial_schema.sql` without editing it. Checked null-safe status/resolution and refund constraints, normalized generated keys, non-truncating sequence formatting, status-only partial uniqueness including removed OPEN rows, note foreign key and UPDATE/DELETE refusal trigger. No static blocker found. Reported to database owner that PostgreSQL NUMERIC may round excess fractional precision: API validation remains necessary and tested independently. Timestamp/history/removal eligibility and locking are service responsibilities. Static inspection is not PostgreSQL execution evidence.

## Next working step and integration gate

The integrator must combine domain, database, frontend and this reviewed commit, rerun `npm test`, type-check and build against the actual combined tree, and record CP-001 evidence before any push. After foundation, implement services/Route Handlers; extend verification to real PostgreSQL-backed HTTP tests covering refusal precedence, parallel duplicate creation, stale versions, note/removal race, append-only behavior and literal removed-OPEN duplicate blocking. Then add isolated Playwright flows for the real screens, including two-tab conflict recovery and 375px layout.

Every step is reviewed before pushing. Every technically successful checkpoint updates its Markdown evidence and states its next dependent step; user acknowledgment must be recorded separately only when actually received. Fresh primary research/official documentation must inform each material next slice, with inspected sections and limitations logged. This handoff does not mark CP-001 globally complete and does not invent user acknowledgment.
