# Domain engineer handoff — CP-001 component

Baseline: `ed14c49d4de0cb5ad07c2f2263db405bef709429`. Branch: `engineer/domain`. Work is limited to `src/domain/requests/**` and this handoff. Component completion does not imply integrated checkpoint acceptance or user acknowledgment.

## Implemented contract

- `types.ts`: `REQUEST_STATUSES`, `RETURN_REASONS`, `RESOLUTIONS`; `RequestStatus`, `ReturnReason`, `Resolution`, `RequestDetails`, `RequestCapabilities` types.
- `policy.ts`: frozen `LEGAL_TRANSITIONS`, `canTransition(from, to)`, `getCapabilities({status, removedAt?})`. Removed requests have no actions; note capability remains true for visible terminal requests. Returned transition arrays cannot mutate the policy.
- `schemas.ts`: `createRequestSchema`, `patchRequestSchema`, `transitionRequestSchema`, `noteSchema`, `removalSchema`, `listQuerySchema`, `refundAmountSchema`; inferred `CreateRequestInput`, `PatchRequestInput`, `TransitionRequestInput`, `ListQuery`.
- `validateMergedDetails(current, patch)` returns a Zod safe-parse result and preserves omitted details while validating the merged contact rule.
- `validateTransitionDetails(input)` returns a Zod safe-parse result, requires an approval resolution, canonicalizes valid refunds to two fractional places, and rejects resolution fields on other transitions.

`transitionRequestSchema` deliberately validates shape only. The service must run shape validation, visible lookup, expected-version check, eligibility check, then `validateTransitionDetails`, in that order. This preserves 409 precedence for structurally valid forbidden transitions. General PATCH must similarly defer merged validation until after eligibility. These pure helpers do not enforce row locks, persistence, HTTP error mapping, uniqueness, or transition history.

Capabilities contain `canEdit`, `canAddNote`, `canRemove`, `allowedTransitions` and `approvalRequirements`. The latter is `{resolutionRequired:true, refundAmountRequiredFor:'REFUND'}` only for a visible In Review request; otherwise null. Clients must not interpret these as authorization.

## Fresh source inspection — 22 October 2026

1. [Zod API](https://zod.dev/api): strings, email, strict objects, partial objects, preprocessing, refinements and transforms. Applied strict allowlists, explicit null/omission behavior and narrow integer preprocessing instead of general coercion. Inspected live documentation; actual package version belongs to the build engineer's lockfile. No dependency changes were made here.
2. [From Runnable Code to Shippable Applications: Test-Driven Development for Full-Stack Web Application Generation](https://arxiv.org/html/2605.17242v1): abstract and methodology sections 3.1–3.4. Applied the acceptance-criteria/feedback approach by coordinating independent truth-table tests with QA. This is a preprint with placeholder publication metadata; it supplies workflow motivation, not proof of our application or a promised accuracy gain. Browser and deployed acceptance checks remain necessary later.

No predownloaded skill substituted for fresh source inspection. Requirements in the repository remain authoritative over research suggestions.

## Review and executed verification

Self-reviewed all new code against API_CONTRACT and architecture sections 9.1–9.2. Checks explicitly cover optional-contact omission vs clearing, unknown fields, server-owned fields, approval semantics, maximum SQL INTEGER quantity, string-only decimal money, and immutable policy arrays. No files owned by other engineers were changed.

Executed successfully against the integrator's installed dependencies (read-only):

- Standalone TypeScript check: `tsc --noEmit --strict --target ES2020 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --baseUrl /workspace/scratch/f23c2426ac35/returndesk/node_modules src/domain/requests/types.ts src/domain/requests/policy.ts src/domain/requests/schemas.ts`.
- In-memory TypeScript transpilation and Node strict assertions: independently enumerated 25 transition pairs; all removed-state actions disabled; contact trimming/defaults/merged last-contact rejection; empty/unknown PATCH rejection; money zero/type/exponent/fraction/overflow rejection and maximum/leading-zero canonicalization; approval and completion payload semantics; list defaults and malformed integer rejection.

The verification engineer additionally reported 99/99 independent Vitest 5.0.5 tests passing against a read-only copy of these domain files; the integrator must rerun their committed suite after integration. These smoke checks were executed, not persisted as a competing test suite. QA owns repeatable tests. No database, API route or browser test has been claimed. Integration must rerun using the final lockfile and project config. The domain does not claim complete assignment compliance without the original assignment source.

## Next working step and review gate

The integrator reviews this commit and ownership scope, integrates domain plus the build/database/verification branches serially, and runs the independent QA suite. Resolve failures before any remote push. After successful integration update STATUS, NEXT_STEP, RESEARCH_LOG and CP-001; record actual user acknowledgment separately.

The next implementation slice is the transactional service and Route Handlers using these schemas and the database constraints. Its fresh research should inspect current official Next.js Route Handler and PostgreSQL locking/error semantics, then retain evidence alongside independent direct-HTTP tests. Existing compiled policy is the dependency for that slice; do not fork business rules into UI or routes. No push or merge was performed by this engineer.
