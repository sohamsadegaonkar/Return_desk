# Next working step — integrated verification and public demo

Predecessor: QA revision `a1ec583` full-suite CI [39834751867](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39834751867) PASS; PR #2 reviewed and merged as integration SHA `89f11b5f1eb1221c8c11fec69d59cf4014feec07`. User acknowledgment remains PENDING.

1. Check exact integration [CI 39836989603](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39836989603); record observed pass/fail and exact SHA. Do not merge [draft PR #1](https://github.com/sohamsadegaonkar/Return_desk/pull/1) to main based solely on the QA-branch result.
2. Free Render PostgreSQL 16 and free Node web service are created in Singapore, but not connected. In the Render dashboard set web-service DATABASE_URL to the database's internal connection URL **without sharing or committing it**. From an authorized trusted CLI, with the provider's external connection URL and TLS requirements, run `npm ci`, `npm run db:migrate`, then deliberate `npm run db:seed` only for the empty demo DB outside NODE_ENV=production. Verify 36 visible requests/six notes. Free instances have no shell or pre-deploy command: migrations stay a separate release step rather than running during build or HTTP.
3. Inspect service startup and run actual public HTTP/browser smoke: create/queue/filters/status/resolution/edit/note/remove, 375px responsiveness and restart persistence. AutoDeploy OFF; trigger reviewed redeploy only when necessary. The reserved URL is NOT yet a qualified submission link.
4. Finish CP-002–006 evidence, release checklist, actual author hours and externally verified README links; review exact candidate before pushes and keep PR #1 draft if anything fails. Submission deadline 23 October 2026 at 11:00 IST.

Four engineer workstreams are historical and completed, not background agents currently running. See [deployment handoff](engineers/deployment.md), [research](RESEARCH_LOG.md), and [team plan](TEAM_PLAN.md).
