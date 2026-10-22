# CP-004 — Edits, notes and removal

**Date:** 23 October 2026, Asia/Kolkata. **Predecessor:** CP-001, reviewed integrated application at `d01f7e54958ed1287c1c29c0925b45f3b9f42967`. **Requirement IDs:** RULE-04, RULE-05, NOTE-01, API-01. **User authorization:** continue ReturnDesk integration and release preparation by 11:00 AM IST.

## Implemented and verified
Version-guarded predecision edits, append-only chronological notes, parent-row locking and Open/Rejected-only soft removal with removed records hidden from detail/nested routes.

[GitHub Actions evidence](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39838667897): Exact merged-branch CI 39838667897 (job 120034052250) on d01f7e54958ed1287c1c29c0925b45f3b9f42967 PASSED: clean npm install, lint, typecheck, production build, PostgreSQL16 migration twice, seed of 36 synthetic requests and six notes with second-seed refusal, 23 database invariant assertions, 106 domain/client tests, 57 HTTP tests and all 12 desktop/375px Playwright scenarios. This used disposable CI PostgreSQL, not hosted Render.
Relevant coverage: HTTP and 23 DB assertions exercise immutable notes, stale edits, rollback constraints, forbidden removal and version conflicts. Browser cases verify preserved drafts on two-tab conflict, removed-item UI invalidation and uncertain note response no blind retry.

## Separate review and limitations
**Review:** Integrator self-review of documented existing source, test declarations and real job output; no code, acceptance test, API contract or deployment settings changed. Earlier independent owner reviews are in CP-001/handoffs. Acknowledgment: PENDING. Not all 57 HTTP tests belong to this single checkpoint.
**Technical verdict:** PASS in isolated PostgreSQL/HTTP/browser CI for the described tested behaviours, not public-host acceptance. Soft deletion retains DB records. Hosted restart/data verification and adversarial public traffic are not covered by CI.

## Next working step
Continue CP-005 responsive/recovery receipt; then run hosted synthetic edit/note/removal smoke.
