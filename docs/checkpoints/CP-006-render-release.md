# CP-006 — Hosted release rehearsal (PARTIAL / BLOCKED)

**Current 23 October update:** The earlier uninitialized-database facts below are historical and superseded for read-only access by the latest evidence at the end of this checkpoint. The release gate is still BLOCKED on live writes/restart/UI.

**Date:** 23 October 2026, Asia/Kolkata. **Dependency:** CP-001 through CP-005 and exact integrated CI on `d01f7e54958ed1287c1c29c0925b45f3b9f42967`. **Requirement IDs:** STACK-01, DATA-01, SEED-01, SUB-01, SUB-02, SUB-03. **User acknowledgment:** PENDING.

## Actual execution evidence
- [GitHub Actions 39838667897](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39838667897) succeeded on the exact `d01f7e54958ed1287c1c29c0925b45f3b9f42967` commit. Exact merged-branch CI 39838667897 (job 120034052250) on d01f7e54958ed1287c1c29c0925b45f3b9f42967 PASSED: clean npm install, lint, typecheck, production build, PostgreSQL16 migration twice, seed of 36 synthetic requests and six notes with second-seed refusal, 23 database invariant assertions, 106 domain/client tests, 57 HTTP tests and all 12 desktop/375px Playwright scenarios. This used disposable CI PostgreSQL, not hosted Render.
- Render Singapore Free PostgreSQL 16 `dpg-dbd5rpo473hc73dh0vrg-a` is AVAILABLE, expires 21 November 2026 UTC, and offers no free automatic backups. [Database dashboard](https://dashboard.render.com/d/dpg-dbd5rpo473hc73dh0vrg-a).
- Render Singapore Free Node web service `srv-dbd5tcu7bikc73f7nno0`, autoDeploy OFF, successfully built Next.js, bound to port 10000 and reports LIVE at https://returndesk-submission-demo.onrender.com, on earlier reviewed app SHA `89f11b5`. [Service dashboard](https://dashboard.render.com/web/srv-dbd5tcu7bikc73f7nno0).
- Independently inspected saved desktop/375px queue screenshots from passing CI artifact: no obvious queue horizontal overflow. They depict the isolated CI app, not the live deployed URL.

## Blocking evidence and limits
- Render service `DATABASE_URL` has not been configured; **hosted** migrations, seed, public API/user journeys and server restart persistence were **NOT RUN**. The Render tool reports Postgres metadata but does not return connection password/URL. A read-only SQL attempt was blocked by an empty external IP allowlist; it was not relaxed. Web fetch from this environment and DNS lookup of the URL were unavailable. A LIVE web process is not proof of database-backed functionality.
- Free web services do not provide an interactive shell or pre-deploy migration command. Do not move seed into startup, create a public initialization endpoint, leak database credentials or open unrestricted network ingress. Initial site is not a submission-ready demo.
- Public draft PR #1 remains OPEN/UNMERGED, README author-reported actual hours missing. No real customer data; synthetic demo only.

## Review / checkpoint verdict
Integrator **self-review**, no code or schema change; available GitHub/Render results inspected. **PARTIAL/BLOCKED**, no claim of hosted acceptance or user acknowledgment. Fresh official operational references: [Render Free](https://render.com/docs/free), [Render deploys](https://render.com/docs/deploys). No new algorithmic or research-paper choice.

## Next working step
In the Render dashboards, privately set web `DATABASE_URL` using its Postgres internal URL. On a trusted local CLI using the permitted external connection/TLS, run `npm ci`, `npm run db:migrate`, then `npm run db:seed` once only against the empty demo DB (outside NODE_ENV=production), verifying 36 rows/six notes. Then reverify deployment, test all required flows externally at desktop/375px, check persistence after restart, and only after actual success review release PR #1, README, checklist and author's hours before 11:00 IST.

## Release owner update — 23 October 2026

Full exact merged integration CI [39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279) **SUCCESS** on `56fa9cfb1eac0734800f3e95338a04fda14e5ad1`: lint, typecheck, build, 106 unit/client, PostgreSQL16 migrations/repeat-safe synthetic seed/23 assertions, 57 HTTP and 12 browser cases. Render deployment `dep-dbd6jfrl550s73arv5lg` reports LIVE on application commit `d01f7e5`; the later `56fa9cf` commit changed documentation only. GitHub repository remains public, and PR #1 remains draft.

User reports having pasted Render `DATABASE_URL`, but the connector does not expose the stored setting. It is **not confirmed** that the connection works. Hosted migration, seed, API/browser flow and restart persistence remain **NOT VERIFIED**. A private read-only SQL attempt was blocked by Render's restricted external IP allowlist, which was not relaxed. The public onrender hostname also could not be fetched from this execution environment. No database credential was disclosed and no production data was touched.

Scoped release security review in [SECURITY_RELEASE_REVIEW.md](../SECURITY_RELEASE_REVIEW.md): source/API/database guardrails inspected, public unauthenticated routes documented as **synthetic trusted-agent-demo-only**, and repository file inventory checked for excluded environment/private-key files. This is a static targeted review, not a complete penetration test, GitHub code-scanning clearance or demonstration of live app security.

**Release verdict remains BLOCKED** on (1) owner-controlled one-time external CLI migration + seed, (2) external public smoke / 375px check / restart persistence, (3) GitHub description/homepage and final README hours, (4) final main PR merge and submission. User acknowledgment PENDING. Do not infer release completion from a deployed process or isolated CI.

## Next reviewed candidate — live workflow smoke harness
User supplied Codespaces outputs: public list HTTP 200, 36 visible/36 returned and seeded detail HTTP 200 with one note, following hosted migration and seed. **This is public read-only acceptance evidence; no live write or actual service restart acceptance yet.** A source-controlled opt-in synthetic smoke harness is being introduced with a fixed Render origin, `RETURNDESK_LIVE_TEST=YES` write guard, synthetic-only writes and a `/tmp` state receipt. Its offline injected-transport tests will run on regular CI; the real live mode is **manual-only and unexecuted**. Test origin and contract are reviewed against the existing 57 HTTP and 12 browser CI cases.

**Pre-push scope:** script + offline tests + npm scripts + narrow CI test step + README, checkpoint, STATUS, NEXT_STEP, TEST_PLAN, RESEARCH_LOG. No migrations, route handlers, Render config, production data, or main merge. Review type: integrator self-review, not an independent external reviewer. User acknowledgment remains PENDING. **Next:** exact-head PR CI then authorized live smoke, real restart and 375px visual acceptance.
