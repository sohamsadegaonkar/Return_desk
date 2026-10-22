# ReturnDesk release and submission checklist

**Updated:** 23 October 2026 (Asia/Kolkata). Exact integrated application CI: [39844358279](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39844358279) on `56fa9cfb1eac0734800f3e95338a04fda14e5ad1`, **SUCCESS**. CI exercises a disposable isolated PostgreSQL database; no hosted Render DB data has been verified. A checked box is **only the scoped evidence described beside it**, not complete release approval.

## Proven on reviewed integration source
- [x] Required Next.js App Router/React/Node/PostgreSQL16/Tailwind stack; source and build reviewed.
- [x] Five business rules exercised through real isolated PostgreSQL/HTTP tests (57 HTTP passed).
- [x] Combined SQL search, status/reason filtering, sort/pagination covered by isolated tests; no browser-only filtering.
- [x] Desktop/375px simulated browser journeys, legal actions, and recovery assertions (12 Playwright tests passed).
- [x] On isolated CI database only: migrate twice, safe synthetic seed of 36 visible requests/six notes and repeat-seed refusal; 23 DB invariant assertions.
- [x] Lint, typecheck, production build, 106 unit/client, 57 HTTP and 12 Playwright passed at the verified integration SHA.
- [x] Source history includes incremental engineer/integration/QA commits; implementation contracts and handoffs are linked in the repository.
- [x] User checkpoint acknowledgment is documented as **PENDING**, not invented.

## Release and human-dependent gates still open
- [ ] On **Render-hosted DB**, verify migration and 36 visible seeded requests plus six notes. The user's `DATABASE_URL` setup was reported but is not independently confirmed by this integration.
- [ ] Externally test public GET, create, list/filter, lifecycle, approval/resolution, edit, note, removal and 375px UI; confirm data survives actual app restart.
- [ ] Verify and accept deployed public URL using the attached PostgreSQL database; a Render **LIVE** process by itself does not qualify.
- [ ] Perform a final secrets/privacy review and ensure demo data is synthetic; no authentication or tenant isolation is implemented, so **do not put real customer data in the public demo**.
- [ ] Verify the exact final merge candidate, make PR #1 ready, merge into `main` and observe successful CI on `main`.
- [ ] Confirm all CP-000–006, research log, decisions, status and next step reflect the final submitted revision.
- [ ] Verify public GitHub and working Render URLs in README **and** set the missing GitHub repository description/homepage as appropriate.
- [ ] Include actual development hours supplied by the author; currently **not supplied**.
- [ ] Author confirms explanation of code/design/tradeoffs and submits the two links before **23 October 2026 11:00 IST**; no ZIP.

Email sending is a separate user-directed action requiring explicit authorization. No email has been sent. Render Free Postgres expires 21 November 2026 UTC with no backups; this is a disposable synthetic demo.
