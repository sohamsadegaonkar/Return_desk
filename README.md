# ReturnDesk

A focused returns workspace for customer-care teams. Built from create-next-app with Next.js App Router, React, Node.js Route Handlers, PostgreSQL 16 and Tailwind CSS. TypeScript/Zod define the shared input contract; Drizzle defines migrations/schema; the service uses explicit, parameterized node-postgres queries.

## Current state

Domain contracts, PostgreSQL migration/seed, business-rule APIs and the workspace UI are being integrated on `integration/foundation` ([draft PR](https://github.com/sohamsadegaonkar/Return_desk/pull/1)). The main branch is not the implementation candidate yet. Local unit/build checks and remaining runtime gates are recorded in [STATUS](docs/STATUS.md). Do not treat authored integration tests as passed tests. No public deployment exists yet.

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

Test variables must be exported into each terminal; copying `.env.example` does not export shell variables. Tests add uniquely named synthetic fixtures and refuse a protected demo/production target. They never truncate existing data. Use a disposable test database. The reviewed GitHub Actions workflow provides fresh PostgreSQL 16 containers, migration/repeat-seed checks, build, HTTP tests and browsers; its actual result must be observed before claiming runtime success.

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

Public application URL: **pending**. Deployment account/database provisioning and external smoke verification remain required. Local PostgreSQL process launch and Chromium installation are blocked by the current execution environment; real results must come from the CI/deployment environment rather than mocks. Dependency maintenance: compatible Next lint plugins currently require deprecated ESLint 9; this is recorded, not hidden.

Optional event timeline and idempotency keys are deferred until the required workflow is verified. Actual hours spent by the author: **not yet supplied**; update before submission rather than inventing a figure. User-confirmed submission deadline: 23 October 2026, 11:00 AM Asia/Kolkata.

## Working protocol

Every coherent change is reviewed before pushing. Every checkpoint updates its Markdown evidence and the next dependent step. User acknowledgment is recorded separately. Four engineers use isolated worktrees and owned paths; one integrator reviews and merges their changes serially. Freshly inspected primary research and official documentation inform material decisions; predownloaded skills alone are insufficient. Start with [AGENTS](AGENTS.md), [documentation map](docs/INDEX.md), [team plan](docs/TEAM_PLAN.md), [status](docs/STATUS.md), and [next step](docs/NEXT_STEP.md).
