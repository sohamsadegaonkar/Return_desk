# ReturnDesk final scoped release/security review

**Date:** 23 October 2026 (Asia/Kolkata). **Reviewed implementation:** `integration/foundation` `56fa9cfb1eac0734800f3e95338a04fda14e5ad1`. **Review method:** integrator self-review of actual repository inventory, selected source files, Render metadata and executed GitHub CI; **not** a comprehensive secrets scan, independent pentest or production security certification.

## Reviewed evidence and findings

| Area | Observed evidence | Verdict and residual risk |
|---|---|---|
| Repository privacy | GitHub repository is public. Recursive tracked tree contains `.env.example` but no actual `.env` file, `.pem`/`.key` private key or hidden credentials archive. `.gitignore` excludes `.env`, `.env.*` except example, build outputs and screenshots. | **PASS scoped inventory**; not a scan of past deleted commits, external systems or private GitHub alerts |
| Connection secrets | `src/server/db/connection.ts` reads the runtime `DATABASE_URL` from process environment and rejects missing/non-Postgres URL. No connection string is intentionally logged. Render tools return DB metadata, not password/connection URL. | **No secret exposed in this review**. Presence and correctness of the user's pasted Render setting **not verified** |
| API errors and input | `src/server/requests/http.ts` maps known domain errors and returns sanitized 500 messages, without SQL/credentials; schemas validate inputs. | **Scoped pass**; HTTP route handlers **do not authenticate callers**, by explicit trusted-agent demo design |
| SQL / business integrity | `src/server/requests/service.ts` uses parameter binding for user-provided values, fixed allowlisted sort fields and transactions; DB partial uniqueness, note immutability and action/version checks are verified by CI. | **Isolated CI PASS**: 23 DB checks and 57 HTTP cases. Not a proof against all injection or concurrency attacks |
| Environment/test safety | `scripts/seed.ts` is clean-only, transactional, creates synthetic `example.test` records, and refuses seed in NODE_ENV=production. `scripts/check-db.ts` requires a test-named isolated DB; browser tests refuse protected or nonlocal targets. | **Pass for reviewed guards**; do not run test suites or destructive scripts against public/hosted demo |
| Public deployment | Free Render Node service reports LIVE, public URL reserved, Postgres AVAILABLE. No completed public DB-backed smoke or restart persistence. | **BLOCKED**; do not publish real customer contacts or use as a production multi-user support system |

## Required gates before submission
1. From a trusted machine obtain Render's external database URL privately, use narrow temporary IP access and provider-required TLS, run committed migrations and one-time safe synthetic seed, then remove temporary allowlist rule.
2. Publicly smoke-test list/create/transition/refund recording (no payment processor)/notes/edit/removal and 375px layout; verify data survives service restart. No genuine customer information should be entered.
3. Re-run a full code/history secret scan with appropriate GitHub/repository tooling and review provider variables; verify no confidential brief or private assignment email entered the public commit history. This scoped review does **not** close that gate.
4. Confirm exact reviewed final SHA, update README and repository metadata, author-reported hours, final CI/PR merge into main, and submit links by deadline. User acknowledgment remains **PENDING**.

**Risk acceptance:** Public unauthenticated write APIs are acceptable **only for a temporary synthetic training demo under the brief's trusted-agent assumption**. This application must not be represented as secure for real support agents or real customer records without adding authentication, authorization, tenant separation and abuse controls in a separate reviewed scope.

Supporting records: [CI run 39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279), [CP-006](checkpoints/CP-006-render-release.md), [project requirements](REQUIREMENTS.md), [Render free docs](https://render.com/docs/free).
