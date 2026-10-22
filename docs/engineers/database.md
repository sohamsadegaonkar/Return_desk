# Database foundation handoff

Date: 2026-10-22. Owner: database engineer. Branch: engineer/database.
Predecessor: ed14c49d4de0cb5ad07c2f2263db405bef709429, reviewed CP-000 contracts. Read the integrator's TEAM_PLAN and partial CP-001 read-only; no changes to another owner's files.
Deadline: 23 October 2026, 11:00 AM Asia/Kolkata. User acknowledgment of this unseen implementation: PENDING.

## Scope and acceptance

Foundation for architecture business rules 1–5 and data model: PostgreSQL 16 schema, lossless money/BIGINT representation, strict status-only live-item uniqueness, nontruncating sequence references, database append-only notes, lazy server-only client, migration runner, separate local demo/test database services, and 36 initially visible synthetic seed rows. The service still owns transitions, locks/version checks, removal eligibility and timestamp updates. This handoff does not claim those behaviours are implemented.

## Fresh evidence inspected

- PostgreSQL 16 generated columns: https://www.postgresql.org/docs/16/ddl-generated-columns.html — stored generation, forbidden direct assignment, immutable expressions and base-column dependencies. Applied to display reference and normalized keys.
- PostgreSQL 16 constraints: https://www.postgresql.org/docs/16/ddl-constraints.html — CHECK/NULL and uniqueness; inspected during the initial research pass. Explicit contact/resolution null tests and partial uniqueness retained.
- Drizzle PostgreSQL setup: https://orm.drizzle.team/docs/get-started/postgresql-new — native node-postgres driver, schema/migration layout. Current page suggests release-candidate packages; this implementation instead compiles against the frontend owner's pinned stable drizzle-orm 0.45.4 / drizzle-kit 0.31.11, pg 8.23.1.
- Drizzle transactions: https://orm.drizzle.team/docs/transactions — transaction callback and rollback behaviour. Seed uses one transaction with table locks before its empty check.
- Drizzle migrations: https://orm.drizzle.team/docs/migrations — inspected migration fundamentals and SQL/codebase approaches. Committed SQL and matching snapshot are the migration baseline; trigger is deliberately custom SQL and must be retained in future migrations. Do not replace this with schema push.
- TDDev, https://arxiv.org/html/2605.17242v1 — freshly inspected methodology §§3.1–3.2, requirement-derived acceptance checks and actual interactive verification. This supports independent QA and honest unrun evidence, not a claim that static checks prove a working database. The document contains placeholder venue metadata; no venue or benchmark gain is asserted.

## Verification and review

- `command -v psql`, `command -v postgres`, `command -v docker`: none available. Parent reported package-manager installation blocked by sandbox permissions; no bypass attempted. Actual PostgreSQL migration, constraint/concurrency tests, seed execution and repeated-seed refusal: **NOT RUN**, remain required gates.
- Strict TypeScript check of all owned TypeScript files using frontend's read-only dependencies: `tsc --noEmit --strict --skipLibCheck --target ES2020 --module esnext --moduleResolution bundler --esModuleInterop src/server/db/schema.ts src/server/db/connection.ts src/server/db/index.ts scripts/migrate.ts scripts/seed.ts drizzle.config.ts` — exit 0.
- Drizzle baseline generation — exit 0, two tables. Repeated `DATABASE_URL=<dummy-local-url> drizzle-kit generate` — exit 0, “No schema changes, nothing to migrate.” This does not connect to PostgreSQL.
- Self-review: compared generated migration/schema/snapshot, checked count arithmetic (25 + 4 + 7), clean-only locked seed transaction, sequence formatting, null/refund cases, status-only uniqueness including removed rows, no destructive cleanup, no credentials in errors, no top-level connection during Next build. Diff whitespace check passed.
- Verification engineer independently reviewed the initial SQL constraints/index/trigger and found no static blocker. Their caveat is retained: PostgreSQL numeric rounds extra fractional digits; strict decimal input validation is the API/domain responsibility. No independent runtime verification occurred.

## Integration contract and limitations

Exports: `getDb()` and `getPool()` from `src/server/db/index.ts`; tables `returnRequests`, `requestNotes`; `ReturnRequestRow`, `RequestNoteRow`. Database and timestamps remain server-side; serialize BIGINT as strings. `numeric(12,2)` uses Drizzle's string mode. Generated columns match SQL nullability; application serializer must check reference is present.

Frontend owner supplies dependencies and npm `db:migrate` / `db:seed`. Run commands from repository root after setting DATABASE_URL. Docker development credentials are intentionally local examples and ports bind to localhost. Test service uses a different port/database and tmpfs; no reset helper is included. Seed refuses production mode and any existing request row, takes an exclusive table lock so concurrent application writes cannot race the empty check, and never deletes/resurrects existing data. Sequence values can have gaps after failed transactions; no contiguous-reference promise is made.

## Next step and publication gate

Integrator must review the exact commit, integrate serially with domain/frontend/verification, and update shared checkpoint/status/next-step/research docs before any push. Then run migration twice against an empty isolated PostgreSQL 16 database, independent constraint/concurrency tests, seed once (36 visible rows), and a second seed (refusal with unchanged rows). Only those successful gates open the service/API slice. Retain the real PostgreSQL blocker if infrastructure is still unavailable; no production readiness claim. No remote push or merge by this engineer.
