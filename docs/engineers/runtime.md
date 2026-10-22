# PostgreSQL runtime verification handoff

Date: 22 October 2026. Branch: engineer/runtime. Predecessor: integrated local 0efb2a2 (domain/database/build/independent unit suites). Assigned scope: database runtime and scripts/check-db.ts. Root retains shared checkpoint/research/status documentation and publication ownership.

## Outcome and exact limitations

Local real PostgreSQL remains unavailable. No psql, postgres, initdb or docker executable was found in PATH or inspected common runtime locations. Execution host is root. PostgreSQL's official initdb documentation states that the cluster must run under its owning nonroot user. A normal Node child-process launch of `id` with the existing uid/gid 1000 returned EINVAL in this environment. No identity workaround, system-user creation, privilege escalation, binary patching or sandbox bypass was attempted. Parent directed that local launch attempts stop.

A temporary tools-only installation of embedded-postgres 16.14.0-beta.17 succeeded outside the repository. Its upstream README identifies zonky PostgreSQL binaries and describes a createPostgresUser option that changes the host; that option was not enabled, and no cluster was initialized or launched. The package was not added to the application or committed. This is installation evidence only, not database execution evidence.

Migration first/second runs, exact seed count, repeated-seed refusal, actual SQL constraints, concurrency and persistence: **NOT RUN locally**. Parent will use a PostgreSQL 16 service in GitHub Actions as the legitimate runtime environment. CI success must be observed before any such gate is marked passed.

## Delivered executable checks

`scripts/check-db.ts` connects only to explicit TEST_DATABASE_URL, requires a test-named PostgreSQL database, refuses production mode, and refuses the same normalized host/port/database identity as optional DATABASE_URL. Intended CI URLs: separate demo `returndesk` and test `returndesk_test`; never point it at a deployment database.

The script opens one transaction and always rolls back its fixture rows. It uses savepoints to recover from expected SQL errors without querying inside an aborted transaction. It verifies PostgreSQL major version 16; generated normalization; named live-item unique refusal; removed OPEN still blocks; terminal request allows follow-up; duplicate edit refusal; quantity/contact/status/refund constraints; maximum exact money; nontruncating references at 1, 999999 and 1000000; BIGINT note transport; append-only note UPDATE/DELETE trigger; and nonblank notes. Fixture identifiers are unique per run. Explicit reference boundaries must be unused (a fresh migrated test database or default 1001-based seed satisfies this).

All fixture rows roll back; PostgreSQL sequence counters are not transactional and may advance. This is acceptable only on the isolated test database. The script does not claim transition-history/version/API semantics or concurrency validation; the service and independent HTTP suite own those checks.

Run from root with `node --import tsx scripts/check-db.ts`. The standard tsx CLI hit local IPC socket listen EPERM; the supported Node loader entry loaded the script and correctly refused the absent TEST_DATABASE_URL. Do not work around OS permissions. CI may use either supported invocation.

## Fresh sources actually inspected

- https://www.postgresql.org/docs/16/app-initdb.html — description, ownership/nonroot requirements, cluster/auth initialization. Motivates stopping root-only local attempts rather than weakening PostgreSQL.
- https://www.postgresql.org/docs/16/ddl-constraints.html — CHECK semantics, NULL behavior, unique constraints. Compared with initial SQL and schema; no static discrepancy found.
- https://www.postgresql.org/docs/16/sql-savepoint.html — description and rollback/release examples. Applied to expected-failure probes in the test transaction.
- https://github.com/leinelissen/embedded-postgres — installation, usage, PostgreSQL version matrix, root-user option caveat. Inspected package provenance; npm reported the 16.14.0-beta.17 version and registry tarball. Not used as an application dependency.
- https://arxiv.org/html/2605.17242v1 — methodology sections 3.1–3.2 freshly inspected: acceptance criteria and observable runtime verification. Adopted independent expected outcomes and explicit unrun classification; no paper numbers or venue claims generalized.

## Executed verification and review

Strict standalone TypeScript check of scripts/check-db.ts passed with the integrated dependency set. `git diff --check` passed. The node-loader invocation without TEST_DATABASE_URL exited 1 with sanitized failure text, as required by fail-closed execution. Real PostgreSQL assertion execution remains NOT RUN.

Self-review checked transaction finally/rollback, pool release, controlled diagnostics, explicit constraint names against committed SQL, no permanent fixture cleanup or note deletion bypass, exact decimal string checks and isolated-database guard. Only scripts/check-db.ts and this handoff changed; no package, API, domain, UI or shared documentation was edited. No remote push or merge performed.

## Next dependent step

Integrator reviews this exact commit, adds the check to isolated PostgreSQL 16 CI after committed migration, observes results, and fixes any actual failures. Execute migration twice, seed once (36 visible + 6 notes), second seed refusal preserving counts, direct script, and QA's independent HTTP/browser suite. Update shared checkpoint, STATUS, NEXT_STEP and RESEARCH_LOG with actual CI evidence before claiming the foundation/runtime gate passed. User acknowledgment remains separate and pending.
