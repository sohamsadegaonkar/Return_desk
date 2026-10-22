# ReturnDesk

A focused returns workspace for customer-care teams. Built from create-next-app with Next.js App Router, React, Node.js Route Handlers, PostgreSQL 16 and Tailwind CSS. TypeScript/Zod define the shared input contract; Drizzle defines migrations/schema; the service uses explicit, parameterized node-postgres queries.

## Current state

The required ReturnDesk source and responsive UI are implemented and reviewed on `integration/foundation`, the [open draft implementation PR](https://github.com/sohamsadegaonkar/Return_desk/pull/1) into `main`. The **latest integrated head `56fa9cfb1eac0734800f3e95338a04fda14e5ad1` passed [GitHub Actions CI 39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279)**: 106 domain/client tests, PostgreSQL 16 migrations plus safe 36-request/six-note seed and 23 database checks, 57 direct HTTP tests, 12 desktop/375px Playwright tests, lint, typecheck and build. These outcomes are on an **isolated CI database**. The `main` branch is **not yet merged or release-qualified**.

The Render Node service reports a successful deployment of reviewed application code. **Its public database-backed user journeys are not verified**, and hosted PostgreSQL migrations/seed have not been confirmed. Use only synthetic demo records: the application intentionally has **no authentication or tenant isolation**, and approval records do not send payments. See [status](docs/STATUS.md), [CP-006](docs/checkpoints/CP-006-render-release.md), and the [release checklist](docs/RELEASE_CHECKLIST.md).

## Setup from a clean checkout

Requires Node.js **22.13 or newer** (verified host: 24.19.0), npm (verified:11.9.0), and PostgreSQL 16. Docker Compose provides a local option.

```sh
git clone https://github.com/sohamsadegaonkar/Return_desk.git
cd Return_desk
git checkout integration/foundation
npm ci
cp .env.example .env
docker compose up -d postgres
npm run db:migrate
npm run db:seed
npm run dev
```

Open http://localhost:3000. If using hosted PostgreSQL, replace `DATABASE_URL` in `.env` and omit Docker. Configure TLS according to the provider's connection URL; never disable certificate validation to work around a connection error. The seed runs only on an empty database, creates 36 visible synthetic requests and 6 notes, and refuses reruns without changing existing data. It is disabled when NODE_ENV=production; seed the dedicated demo database deliberately from a nonproduction CLI process before serving the demo. No reset or destructive cleanup command is included.

Production build/start: `npm run build`, then `npm start`. Migrations are a separate release step and never run during a web request/build. The server needs DATABASE_URL at runtime; the build initializes no database connection.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The default test suite is independent domain/client testing. Real PostgreSQL/HTTP/browser suites are explicitly separate:

1. `docker compose --profile test up -d postgres-test` creates an isolated local test service on 5433.
2. Set TEST_DATABASE_URL from `.env.example`; migrate that database with `DATABASE_URL="$TEST_DATABASE_URL" npm run db:migrate` (set/export the shell variable first).
3. Run `npm run db:check` with TEST_DATABASE_URL set and DATABASE_URL identifying the separate demo database, or unset. The checks roll back fixture rows; sequence values can still advance.
4. Start a second app process against the test database: `DATABASE_URL="$TEST_DATABASE_URL" npm run dev -- --hostname 127.0.0.1 --port 3001`.
5. In another terminal, set TEST_BASE_URL=http://127.0.0.1:3001, TEST_DATABASE_URL, and ALLOW_TEST_WRITES=1; run `npm run test:api`.
6. `npx playwright install chromium`, then `npm run test:e2e` with the same isolated test variables. Tests cover desktop and 375px layouts.

Test variables must be exported into each terminal; copying `.env.example` does not export shell variables. Tests add uniquely named synthetic fixtures and refuse a protected demo/production target. They never truncate existing data. Use a disposable test database. The reviewed [GitHub Actions verification workflow](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279) **passed on the exact `56fa9cf` integration commit** with fresh PostgreSQL16 containers, migrations, repeat-seed safeguards, all HTTP and browser tests. This does not prove the Render database was initialized or that the public URL is functional.

## Product and architecture

Queue search, status/reason filters, sorting and pagination are combined in SQL; the browser waits 350ms before searching. A request workspace offers server-computed legal actions, chronological append-only notes, conditional approval resolution, detail editing before decision and soft removal. Structured API errors retain drafts and explain refusals. An uncertain mutation response requires checking authoritative state before another attempt. A recorded resolution does not transfer money or fulfil a replacement.

- Lifecycle: Open→In Review→Approved→Completed, or In Review→Rejected. Terminal states stay final.
- One live request means Open/In Review/Approved for the normalized order+item pair. **Removing an Open request still reserves that item**, following the assignment's literal status rule. A follow-up is allowed only after the earlier request genuinely reaches Rejected or Completed; decide its outcome from the customer case. There is no restore API.
- Customer name and at least email or phone are required; item identity is the provided stable SKU/identifier, independent of display name. Quantity is a positive PostgreSQL integer.
- Money is a decimal string with at most two fractional places, stored as NUMERIC(12,2), displayed as INR. Notes and reference sequence IDs travel as strings to preserve BIGINT precision.
- Parent row locks serialize writes. expectedVersion rejects stale edits/status/removal; adding a note does not invalidate open detail forms. A partial unique index protects duplicate races.
- PostgreSQL owns static constraints and note immutability; the service owns legal transition history, detail locks, visibility and version checks. Native SQL alone does not enforce the whole workflow.
- This assignment demo assumes trusted support agents; it has no authentication/tenant separation. Use synthetic data. No payment provider is integrated.

See [architecture](docs/architecture.md), [API contract](docs/API_CONTRACT.md), [data model](docs/DATA_MODEL.md), and [test plan](docs/TEST_PLAN.md) for the detailed contracts.

## Delivery and remaining work

**Public GitHub repository:** https://github.com/sohamsadegaonkar/Return_desk (source candidate on `integration/foundation`; `main` is not yet updated).

**Reserved Render URL:** https://returndesk-submission-demo.onrender.com . Render reports that its web process deployed successfully, but **this link is not yet accepted as a functional submission demo**. The connected tools cannot read the stored Render `DATABASE_URL` value, and public requests from this execution environment could not resolve/reach the hostname. User reported setting the environment variable; actual database connectivity, migrations, 36-row seed, end-to-end hosted workflows and restart persistence are **not yet verified**.

**Host configuration:** Free PostgreSQL16 and a Free Node web service are created in Singapore. On Render, use the internal Postgres URL for the web-service `DATABASE_URL`, without posting credentials in Git/chat. From a trusted CLI use the provider's external URL, narrow IP allowlisting and required TLS to run committed `npm run db:migrate` and then `npm run db:seed` once on the designated empty synthetic-demo database (with `NODE_ENV` not `production`). Do not run migration/seed during build, app startup or public requests. See [deployment handoff](docs/engineers/deployment.md). Free Render Postgres expires **21 November 2026 UTC** and has no backups; this is a temporary demo, not production storage.

**Remaining release gates:** verify externally that the public queue, creation, status transitions, notes, edits and soft removal work with persistent hosted data; test the 375px layout and persistence after a restart; finish release/security review; update the repo description and README with *verified* links, obtain the author's actual hours, and merge [PR #1](https://github.com/sohamsadegaonkar/Return_desk/pull/1) to `main` only after its gates pass. The submission email has **not been sent**.

**Author's actual development hours:** **NOT SUPPLIED**. Do not invent a number. **Submission deadline:** 23 October 2026 at 11:00 AM Asia/Kolkata. Dependencies still report the existing ESLint9 deprecation warning; optional event timelines and idempotency keys are deferred.

## Working protocol

Every coherent change is reviewed before pushing. Every checkpoint updates its Markdown evidence and the next dependent step. User acknowledgment is recorded separately. Earlier four-engineer implementation and review history is recorded in the handoffs; current continued work is performed by an integrator, not four continuously running subagents. Freshly inspected primary research and official documentation inform material decisions; predownloaded skills alone are insufficient. Start with [AGENTS](AGENTS.md), [documentation map](docs/INDEX.md), [team plan](docs/TEAM_PLAN.md), [status](docs/STATUS.md), and [next step](docs/NEXT_STEP.md).
