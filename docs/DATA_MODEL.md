# Database and migration plan

Canonical SQL blueprint: architecture.md section 5; committed SQL/Drizzle schema and clean-only seed are implemented. PostgreSQL 16.15 CI migration, safe seed and 23 invariant checks passed at 0c9be124; application HTTP qualification remains separate.
PostgreSQL 16 target; Drizzle schema must match committed migration including generated columns, indexes and triggers.
Tables: return_requests and request_notes. request_events is optional after all required gates.

## Invariants
- UUID request PK; sequence BIGINT reference number; non-truncating RD- reference generated in database.
- Generated normalized order/item keys; partial UNIQUE on those keys for Open/In Review/Approved regardless of removed_at.
- Positive integer quantity; bounded non-empty text; at least one contact.
- Nullable NUMERIC(12,2) constrained by resolution/status. Service rejects precision loss before insertion.
- removed_at is soft removal; no physical deletion API.
- Notes use identity BIGINT, FK RESTRICT and UPDATE/DELETE refusal trigger; chronological order created_at,id.
- Service owns transitions, post-decision detail locking, version checks and timestamps. Static constraints do not enforce history.
- TRIM-based DB checks and application whitespace normalization have different coverage; test tabs/newlines at API boundary.

## Transaction protocol
Read visible parent FOR UPDATE, verify expectedVersion where applicable, validate state, mutate, increment detail version, commit. No network calls inside DB transactions. Notes lock parent but do not bump detail version.
Catch failed unique transactions outside the transaction; inspect named constraint. Do not query inside an aborted transaction.
Use a separate test DB and fail closed if test connection matches deployment. Migration on a clean DB is mandatory evidence. Do not claim rollback support without testing; restore destructive changes only with explicit authorization and known backup.

## Seed
36 visible rows = 25 status/reason combinations + 4 rows forming 2 terminal/live pairs + 7 varied examples. Notes on some, all resolution types represented. Transactional clean-only seed; existing rows produce a clear non-destructive stop. Record actual command after implementation.
