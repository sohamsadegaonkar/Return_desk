# ReturnDesk

A focused returns workspace for customer-care teams. Built from create-next-app with Next.js App Router, React, Node.js Route Handlers, PostgreSQL 16 and Tailwind CSS. TypeScript/Zod define the shared input contract; Drizzle defines migrations/schema; the service uses explicit, parameterized node-postgres queries.

## Current state

The implementation on `integration/foundation` at `83873e98d87ad432d91b26877a346fd73bbe1b1d` passed [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316): isolated PostgreSQL migrations/safe seed and DB checks, 106 unit/client, 57 HTTP, 12 desktop/375px Playwright, offline live-smoke harness, lint, typecheck and build.

The **actual hosted** Render URL, https://returndesk-submission-demo.onrender.com, passed an opt-in synthetic public read/write smoke, including create, edit, legal status transitions, approval decision, note, search/filter and soft removal. Render's reviewed `83873e9` deploy completed and became Live. A subsequent owner-run read-only verify **passed after that deployment**, confirming saved Completed and removed resources persisted. This does not prove a physical host restart or live 375px browser acceptance.

**The implementation PR [#1](https://github.com/sohamsadegaonkar/Return_desk/pull/1) into `main` remains draft/unmerged.** Live mobile UI, security/ops cleanup, metadata, author hours, final merge and submission are pending. This deliberately unauthenticated, non-multitenant app is for synthetic demonstration data only; no payment is executed. See [status](docs/STATUS.md) and [CP-006](docs/checkpoints/CP-006-render-release.md).

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

Test variables must be exported into each terminal; copying `.env.example` does not export shell variables. Tests add uniquely named synthetic fixtures and refuse a protected demo/production target. They never truncate existing data. Use a disposable test database. The reviewed [GitHub Actions verification workflow](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316) passed on exact merged integration commit `83873e9` against isolated PostgreSQL16, including offline smoke harness, all HTTP and browser tests. Separately, real public hosted read/write testing and post-deploy persistence passed in the owner's Codespace.

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


### Opt-in public demo smoke (synthetic-only)

The source-controlled `scripts/public-smoke.mjs` harness is exercised **offline** on every CI run with `npm run test:smoke-harness`; this never contacts Render. Live writes are deliberately **not** part of routine CI. When the demo already shows at least 36 synthetic seed records and the operator explicitly accepts adding two synthetic records (one Completed visible and one soft-removed), run from a trusted checkout:

```sh
RETURNDESK_LIVE_TEST=YES npm run test:live:run
```

The harness tests create → edit → In Review → Approved (recorded synthetic refund, no payment) → Completed, append-only note, search/status filter, forbidden edit and Open soft removal. It stores a synthetic record identifier under `/tmp/returndesk-public-smoke-state.json` without secrets. **After actually restarting the Render web service**, run `npm run test:live:verify` to check that state survived. The verification command alone does not prove a restart happened; it requires a genuine restart between modes. Do not rerun live writes casually, and do not use real customer data. The seeded 36 records are never mutated.

**Hosted acceptance evidence:** User Codespaces confirmed initial 36 synthetic records and one seed note; manual synthetic `test:live:run` PASS (write workflows) and read-only `test:live:verify` PASS **after** Render confirmed a new reviewed commit Live. See [CP-006](docs/checkpoints/CP-006-render-release.md).

## Delivery and remaining work

**Public source repository:** https://github.com/sohamsadegaonkar/Return_desk — reviewed current application code on `integration/foundation`; [PR #1](https://github.com/sohamsadegaonkar/Return_desk/pull/1) to `main` remains draft.

**Live hosted demo:** https://returndesk-submission-demo.onrender.com — Render deployment `dep-dbd8k9brjlhs73ccuuc0` at `83873e9` **Live**; initial seeded public list/detail GET, manual synthetic writes and read-after-deployment verification **passed**.

**Hosting:** Free PostgreSQL 16 and Free Node service, Singapore. Web service `DATABASE_URL` is private; do not publish secrets. Run schema migration/seed only from trusted CLI against a fresh, dedicated demo database, never on server build/start/HTTP. Already initialized; **do not rerun seed**. Remove temporary external Postgres IP permission. Free hosted Postgres expires **21 November 2026 UTC** and has no backups.

**Remaining release gates:** live **375px/desktop hosted browser** walkthrough and evidence, targeted secrets/history/dependency review, access cleanup, GitHub description/homepage, actual author's working hours, user acknowledgment, reviewed PR #1 merge and success CI on `main`, then submission before 11:00 IST.

**Author hours:** **NOT SUPPLIED**; do not invent. **Deadline:** 23 October 2026, 11:00 AM IST. **Submission email:** not sent.

## Working protocol

Every coherent change is reviewed before pushing. Every checkpoint updates its Markdown evidence and the next dependent step. User acknowledgment is recorded separately. Earlier four-engineer implementation and review history is recorded in the handoffs; current continued work is performed by an integrator, not four continuously running subagents. Freshly inspected primary research and official documentation inform material decisions; predownloaded skills alone are insufficient. Start with [AGENTS](AGENTS.md), [documentation map](docs/INDEX.md), [team plan](docs/TEAM_PLAN.md), [status](docs/STATUS.md), and [next step](docs/NEXT_STEP.md).
