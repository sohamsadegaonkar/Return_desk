# ReturnDesk final scoped release/security review

**Date:** 23 October 2026 (Asia/Kolkata). **Historical scoped review baseline:** `56fa9cfb1eac0734800f3e95338a04fda14e5ad1`; current integrated evidence is `83873e9`.. **Review method:** integrator self-review of actual repository inventory, selected source files, Render metadata and executed GitHub CI; **not** a comprehensive secrets scan, independent pentest or production security certification.

## Reviewed evidence and findings

| Area | Observed evidence | Verdict and residual risk |
|---|---|---|
| Repository privacy | GitHub repository is public. Recursive tracked tree contains `.env.example` but no actual `.env` file, `.pem`/`.key` private key or hidden credentials archive. `.gitignore` excludes `.env`, `.env.*` except example, build outputs and screenshots. | **PASS scoped inventory**; not a scan of past deleted commits, external systems or private GitHub alerts |
| Connection secrets | `src/server/db/connection.ts` reads the runtime `DATABASE_URL` from process environment and rejects missing/non-Postgres URL. No connection string is intentionally logged. Render tools return DB metadata, not password/connection URL. | **No secret exposed in this review**. Hosted reads/writes and redeployment prove a functioning DB connection; the protected connection-string value was never inspected |
| API errors and input | `src/server/requests/http.ts` maps known domain errors and returns sanitized 500 messages, without SQL/credentials; schemas validate inputs. | **Scoped pass**; HTTP route handlers **do not authenticate callers**, by explicit trusted-agent demo design |
| SQL / business integrity | `src/server/requests/service.ts` uses parameter binding for user-provided values, fixed allowlisted sort fields and transactions; DB partial uniqueness, note immutability and action/version checks are verified by CI. | **Isolated CI PASS**: 23 DB checks and 57 HTTP cases. Not a proof against all injection or concurrency attacks |
| Environment/test safety | `scripts/seed.ts` is clean-only, transactional, creates synthetic `example.test` records, and refuses seed in NODE_ENV=production. `scripts/check-db.ts` requires a test-named isolated DB; browser tests refuse protected or nonlocal targets. | **Pass for reviewed guards**; do not run test suites or destructive scripts against public/hosted demo |
| Public deployment | Free Render Node service reports LIVE, public URL reserved, Postgres AVAILABLE. Public hosted synthetic read/write smoke passed and saved records survived an actual Live redeployment. | **PARTIAL**: hosted smoke passed, but no independent pentest; never use real customer contacts or a production support system |

## Required gates before submission
1. User-operated external migration and seed are complete. **Revoke the temporary PostgreSQL external client-IP allowlist** if no further trusted DB access is required; never share the URL or password.
2. Hosted API synthetic list/create/edit/transition/recorded refund/notes/removal and cross-deployment read passed. Still require live hosted **375px browser** inspection.
3. Re-run a full code/history secret scan with appropriate GitHub/repository tooling and review provider variables; verify no confidential brief or private assignment email entered the public commit history. This scoped review does **not** close that gate.
4. Confirm exact reviewed final SHA, update README and repository metadata, author-reported hours, final CI/PR merge into main, and submit links by deadline. User acknowledgment remains **PENDING**.

**Risk acceptance:** Public unauthenticated write APIs are acceptable **only for a temporary synthetic training demo under the brief's trusted-agent assumption**. This application must not be represented as secure for real support agents or real customer records without adding authentication, authorization, tenant separation and abuse controls in a separate reviewed scope.

Supporting records: [CI run 39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279), [CP-006](checkpoints/CP-006-render-release.md), [project requirements](REQUIREMENTS.md), [Render free docs](https://render.com/docs/free).

## R-015 post-deployment evidence addendum
Exact `83873e98d87ad432d91b26877a346fd73bbe1b1d` passed [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316); hosted Render deployment `dep-dbd8k9brjlhs73ccuuc0` reached Live and user-run synthetic write + post-Live read smoke passed. This confirms operational API function, **not** authentication, tenant isolation, past-commit secret clearance, dependency security or full mobile UX. These still require review. No real customer data should be entered.
