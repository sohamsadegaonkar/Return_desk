# CP-006 — Hosted release rehearsal (PARTIAL / FINAL GATES OPEN)

**Date:** 23 October 2026 IST. **Dependency:** CP-001–CP-005 and exact integration head `83873e98d87ad432d91b26877a346fd73bbe1b1d`. **Requirement IDs:** STACK-01, DATA-01, SEED-01, SUB-01, SUB-02, SUB-03. **Review:** integrator self-review, not an independent evaluation. **Human acceptance:** PENDING.

## Current authoritative evidence

Verified evidence chain: [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316) SUCCESS on 83873e98d87ad432d91b26877a346fd73bbe1b1d; Render deploy `dep-dbd8k9brjlhs73ccuuc0` LIVE at 03:43:43 IST on 23 Oct 2026 (22:13:43 UTC on 22 Oct) at exact commit. The operator reported public GET list HTTP 200 (36 initial visible rows) and seed detail HTTP 200 (one note), then `test:live:run` PASS on create/read/edit/In Review/Approved with synthetic REFUND/Completed/locked edit/append note/search/status-filter/soft removal. After the confirmed Live deployment was communicated, the operator reran `test:live:verify`; HTTP 200 on saved Completed item and HTTP 404 on removed item; all assertions PASS. That chronological evidence qualifies **persistence across a completed deployment**. It does not prove an underlying VM/DB instance was physically restarted, nor does it substitute for live browser verification.

**Other evidence:** [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316) green on the same SHA with 106 domain/client cases, 57 isolated HTTP, 23 isolated DB invariant checks, 12 desktop/375px Playwright cases, offline public smoke harness, production build/lint/typecheck. The **hosted** user-terminal smoke is separate from isolated CI. Initial hosted seed list had 36 records before public smoke created two synthetic records (one Completed visible, one removed). Six seed notes proved in isolated CI; only one checked directly on hosted seed.

## Scope and limitations
- No application-route, schema, security model, payment integration or real-customer-data change was made to accomplish hosted smoke. The public app deliberately has **no authentication or tenant segregation** and must remain disposable synthetic-demo-only.
- Read-after-deployment with confirmed Render replacement is PASS; no independent evidence of underlying machine restart. The script does not generate a deployment event by itself.
- Live **375px public-browser** layout and manual usability pass **NOT RUN**. CI Playwright at 375px uses isolated application/DB.
- Historic pre-migration failures, initial HTTP 500 and old checkpoint conclusions are **superseded** by the evidence above.

## Remaining gates
1. Browser acceptance on actual hosted URL at desktop + 375px, record screenshot/issues.
2. Security/history/dependency review, revoke any temporary PostgreSQL external-IP allowlist, verify synthetic-only data.
3. GitHub metadata (description/homepage), actual author hours and user acknowledgment.
4. Final reviewed PR #1 integration → main, successful main CI, submission links by **11:00 IST 23 October**. Email not sent.

**Verdict:** hosted read/write lifecycle and cross-deployment persistence **PASS**; release remains **PARTIAL** due open tasks. [NEXT_STEP](../NEXT_STEP.md) is the next dependency.
