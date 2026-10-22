# ReturnDesk release and submission checklist

**Updated:** 23 October 2026 (Asia/Kolkata). Exact integration head `83873e98d87ad432d91b26877a346fd73bbe1b1d`; [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316) **SUCCESS**. Checked boxes denote only the evidence specifically stated; author acknowledgment is not inferred.

## Verified gates
- [x] Next.js App Router/React/Node/PostgreSQL16/Tailwind stack, production build and source-verified architectural contracts.
- [x] On isolated CI DB: 106 unit/client, 57 direct HTTP, 23 PostgreSQL invariant, 12 desktop/375px Playwright, clean migration, 36-record/six-note seed, repeat-seed refusal and offline opt-in-smoke harness tests.
- [x] Hosted synthetic DB initialized: initial GET list returned HTTP 200, 36 visible/36 returned; seeded-detail GET HTTP 200, one note.
- [x] **Public live write smoke passed** from user's Codespaces: create/read/edit, review/approve/complete, recorded synthetic refund (no payment), terminal edit rejection, append/read note, search/status-filter, soft removal and hidden 404.
- [x] **Persistence across real Render deployment passed:** `dep-dbd8k9brjlhs73ccuuc0` exact `83873e98d87ad432d91b26877a346fd73bbe1b1d` confirmed Live, then user explicitly reran read-only `test:live:verify` with HTTP 200 saved Completed request, HTTP 404 removed request. This does not prove physical host restart.
- [x] Existing 36 seeded records are protected from the smoke: new synthetic A/B only. Public demo has no auth/tenant boundaries; this limitation is documented.

## Release blockers / human tasks
- [ ] Manually inspect actual **public hosted UI** on desktop and 375px, including menu, queue/detail, error message, note controls, input focus and overflow; record observed screenshots/results.
- [ ] Final repository-history secret review, npm/dependency advisory review and Render config review; remove temporary Postgres external-IP allowance.
- [ ] Confirm aggregate six hosted seeded notes if required; isolated CI has six and live check observed one on the inspected seed record.
- [ ] Set GitHub repository description/homepage; verify source/demo links.
- [ ] Obtain author-reported **actual development hours**, currently unknown.
- [ ] Final release review and user acknowledgment; mark draft PR #1 ready, merge to `main` only when release gates pass, verify `main` CI.
- [ ] Submit source/demo links before **23 October 2026 11:00 IST**; no ZIP; no email sent yet.

Render Free PostgreSQL expires 21 November 2026 UTC and has no backups; synthetic demo only.
