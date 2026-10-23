# API/service handoff — transactional requests

Date: 2026-10-22. Predecessor: locally integrated foundation `0efb2a2`. Owner: `engineer/api`, isolated `returndesk-api` worktree. Scope is only `src/server/requests/**`, `src/app/api/**` and this handoff. Requirement targets: CREATE-01, LIST-01, REF-01, API-01, RULE-01 through RULE-05, NOTE-01 and DATA-01. Foundation supplies domain schemas/policy and committed PostgreSQL schema; actual database verification remains an integration gate.

## Implemented

All seven required route operations use Node.js Route Handlers and one `RequestService`. Input schemas stay canonical in the domain. Transactions use one checked-out node-postgres client, BEGIN/COMMIT/ROLLBACK and finally release. Writes lock the visible parent FOR UPDATE, check expectedVersion before operation eligibility and semantic validation, and increment version for detail/status/removal mutations. Notes lock the parent, append only and leave detail version unchanged. Duplicate create/edit maps only named unique index `one_live_request_per_order_item` after rollback.

List combines parameterized literal search, exact status/reason filters, allowlisted sort/direction, deterministic UUID tie-breaker and paging. List count/rows and detail/notes use read-only repeatable-read snapshots. Oversized valid page offsets use BigInt arithmetic and return empty beyond total, avoiding precision loss or SQL bigint offset overflow. Search escapes percent, underscore and backslash. DTOs serialize BIGINT as strings and dates as ISO strings; money remains decimal strings. Response types in `dto.ts` were agreed directly with frontend and QA. All responses set Cache-Control no-store. Malformed JSON/UUID and repeated query keys get structured 400 errors; strict shape errors get 422, missing/removed parents 404, refusals 409, unexpected errors generic 500 without SQL/customer data/connection-string logging.

The database/Drizzle schema remains canonical for migrations; service uses the supported node-postgres driver directly for transparent bound SQL and explicit interactive transactions. No new endpoints or ORM dependencies were added.

## Fresh primary-source inspection

- https://nextjs.org/docs/app/api-reference/file-conventions/route — HTTP methods, Request/Response APIs, promised dynamic context params, runtime configuration. Applied async context params and runtime=nodejs; no separate mutation Server Actions.
- https://www.postgresql.org/docs/16/explicit-locking.html — §13.3.2 row locks, FOR UPDATE blocking/re-evaluation after another write. Applied visible-parent locking to serialize concurrent edits/notes/removal.
- https://www.postgresql.org/docs/16/transaction-iso.html — transaction isolation and repeatable-read snapshot; read-only transactions keep count/result predicates on one snapshot. Mutation transactions retain read committed with explicit parent locking, avoiding implicit blind serialization retries.
- https://node-postgres.com/features/transactions — full transaction example and requirement that every statement use one client. Applied this directly; never BEGIN via pool.query.
- https://node-postgres.com/features/queries — parameterized query and identifier limitations. Applied bound user values and fixed SQL allowlists.
- https://arxiv.org/html/2605.17242v1 — methodology §§3.1–3.2 reread: requirement-grounded acceptance scenarios followed by interactive execution. Applied by coordinating independent direct-HTTP cases with QA before handoff. This preprint motivates verification discipline; it does not prove this implementation or transfer performance numbers.

These sources were freshly retrieved during this slice; downloaded skills were not substituted for evidence. Parent owns the shared research-log update.

## Review and executed checks

- `next typegen`: exit 0.
- Unmodified inherited tsconfig targets ES2017 and fails BigInt literal checking already introduced in the domain. Parent has reported an ES2022 target correction. Verification here used `tsc --noEmit --target ES2022 --incremental false`: exit 0. An initial incremental run retained the old target diagnostics; disabling incremental produced a clean check. No owned-file type error remained.
- `eslint src/server/requests src/app/api`: exit 0.
- Node/tsx smoke under `--conditions=react-server`: six expected malformed-ID/body/query/payload refusals returned the intended 400/422 envelopes with zero DB connection attempts. An additional prototype-key smoke confirmed `__proto__` is retained as an own query key and rejected with 422 by the strict list schema. These are boundary checks, not database/API integration evidence.
- Exact file diff self-reviewed for transaction ownership and rollback/release, SQL binding and allowlists, named constraint-only handling, version/error ordering, amount preservation on completion, removed resource visibility and note immutability path. Type-only DTO module contains no server runtime import. Query dictionary uses a null prototype for untrusted keys.
- No PostgreSQL runtime, successful mutation, browser or deployed test is claimed here. Root infrastructure and independent QA own those gates. No package/domain/database/test/shared-doc file changed; no remote push or merge.

## Next step

Integrator reviews this exact commit, integrates with frontend/QA/DB changes, and runs clean build plus real PostgreSQL-backed HTTP scenarios before publishing. QA should inspect all 25 transition pairs, version/refusal precedence, exact refund rules, normalized create/edit races, literal wildcard search, note/removal serialization, note version independence and hidden-parent endpoints. Resolve runtime findings before claiming a passing CP-002/003/004. Record exact commands/results in checkpoint, STATUS, NEXT_STEP and RESEARCH_LOG. User acknowledgment stays PENDING until actually received.

## Independent review correction — note identity ordering
Database-runtime reviewer found that the detail notes query selected `id::text AS id` then ordered by bare `id`; PostgreSQL can resolve that name to the text output alias, sorting 10 before 2 when timestamps tie. Changed the order expressions to qualified base columns `request_notes.created_at ASC, request_notes.id ASC`. This preserves SQL BIGINT ordering while keeping lossless string JSON. QA has been asked to exercise ten same-timestamp notes through direct SQL fixture and HTTP detail read. This correction is a separate reviewed commit; no claim of executed PostgreSQL evidence is made here. Typecheck and lint were rerun on the corrected source.

## Production correction — unknown query keys
Parent's production Next.js HTTP check returned 500 for `?__proto__=x` while ordinary unknown keys returned 422. The earlier isolated Node/tsx smoke was rerun and still returned 422 for own `__proto__`, `constructor` and unknown keys with no connection attempts; that result did not establish production behavior. Replaced reliance on Zod unknown-key traversal alone with an explicit query-boundary allowlist derived from `Object.hasOwn(listQuerySchema.shape, key)`, preserving one canonical set of names. Unsupported keys now throw structured 422 before service/database access, independently of production Zod parsing behavior. Direct Node/tsx query-boundary checks, typecheck and lint reran successfully. Actual production HTTP correction remains for parent to rebuild and retest; no new production success is asserted in this handoff.

## Real PostgreSQL CI correction — explicit transition enum type
Parent reported GitHub Actions run `39830254331`, job `120004203401`, candidate `0c9be124…`: PostgreSQL 16 migration/seed and 23 invariant assertions passed; API tests had 17 passes and 40 failures associated with status transitions/setup. PostgreSQL's exact error was `inconsistent types deduced for parameter $2`, with `text versus return_status`. My earlier review assumption that the UPDATE target alone would consistently infer the parameter's enum type across the timestamp CASE comparisons was incorrect. Static TypeScript/lint and boundary checks did not parse this SQL against PostgreSQL.

Freshly inspected PostgreSQL 16 [PREPARE](https://www.postgresql.org/docs/16/sql-prepare.html), Description/Parameters (unspecified parameter types are inferred from context), and [Operator Type Resolution](https://www.postgresql.org/docs/16/typeconv-oper.html), §10.2 (unknown inputs and preferred string types). The shared status parameter now has explicit `::return_status` casts in all three contexts: UPDATE assignment, decided-at CASE and completed-at CASE. This removes competing enum/text inference while preserving all legal transition and timestamp behavior. No test expectations or business rules changed.

Self-reviewed the exact three-expression SQL diff and reran `tsc --noEmit --target ES2022 --incremental false`, scoped ESLint and whitespace checks successfully. Real PostgreSQL rerun belongs to parent CI after integration; a fix pass is not claimed from source checks.

Parent's later framework diagnostic also explains the earlier `__proto__` production discrepancy: installed Next.js normalizes the query through its own plain-object conversion before the handler, dropping that key. The original direct-module refusal checks were valid for the module, but did not describe framework-normalized HTTP input. The derived handler allowlist remains defense in depth; parent owns the accurately adjusted HTTP expectation and shared evidence.
