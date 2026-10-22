# Render demo deployment handoff — 23 October 2026

## Scope and verified resources
- QA-head full-suite pass: [GitHub CI 39834751867](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39834751867), SHA `a1ec583`. Reviewed merged source SHA: `89f11b5f1eb1221c8c11fec69d59cf4014feec07`; separate integration CI 39836989603 still needs an observed verdict.
- PostgreSQL16: [returndesk-demo-20261023](https://dashboard.render.com/d/dpg-dbd5rpo473hc73dh0vrg-a), Singapore, free, AVAILABLE; expiry 21 November 2026 UTC; no backups.
- Node web service: [returndesk-submission-demo](https://dashboard.render.com/web/srv-dbd5tcu7bikc73f7nno0), Singapore, free, source integration/foundation, autoDeploy OFF. Build `npm ci && npm run build`, start `npm start`, NODE_VERSION=24.19.0. Initial deploy `dep-dbd5tde7bikc73f7noug` reports LIVE on https://returndesk-submission-demo.onrender.com . No database connection or public functional smoke is verified. Nexa Care untouched.

## Outstanding release operations (do not mark done)
1. Securely retrieve Render's internal Postgres connection URL in its dashboard and set DATABASE_URL in the web-service Environment; the current connector does not return passwords/URLs. Never post credentials in chat or commit them.
2. From a trusted CLI with the provider's external database URL and required TLS, check out the exact source, `npm ci`, run `npm run db:migrate`, then `npm run db:seed` just once against an empty synthetic-demo database, outside NODE_ENV=production. Verify 36 visible requests and six notes. Do not weaken repeated-seed refusal, bypass protections or put migration/seed in build/http startup.
3. Once configured, inspect service startup and public API/queue/create/transition/resolution/edit/note/removal; check 375px layout and restart persistence. Trigger manual deploy only if necessary, since autoDeploy is OFF.
4. Review/update CP-006, STATUS, NEXT_STEP, release checklist, README verified URL and author-supplied hours before releasing draft PR #1. User acknowledgment remains PENDING.

Free Render instances have no shell or one-off jobs; pre-deploy commands are paid-only. Official resources: https://render.com/docs/free, https://render.com/docs/deploys. This is a provisioned-but-unqualified deployment handoff, not proof of a functional application. No paid resources, secrets or production customer records used.
