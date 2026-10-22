# Next working step — opt-in live smoke, restart and release review

**Predecessor:** integration `81ae11ac03e1c558d7c66b691a869d873496f95b` passed [exact-head CI 39848278025](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39848278025). User Codespaces evidence: public GET list HTTP 200 (36 total/36 rows), fixed seeded detail HTTP 200 (one note). Hosted migration completed and synthetic seed was installed. No secret values were collected. **Public writes and restart persistence are still pending.**

1. Review the new `scripts/public-smoke.mjs` and source-controlled offline tests. In routine PR CI, `npm run test:smoke-harness` executes **offline**. Real public writes must never run automatically on a PR/push; the only sanctioned command is `RETURNDESK_LIVE_TEST=YES npm run test:live:run` from a trusted Codespace after reviewing the code, and it creates one visible Completed record and one soft-removed synthetic record. Treat uncertain failures as possibly committed and inspect first, not blindly repeat.
2. Only if live writes pass, perform a real Render service restart, then run `npm run test:live:verify`. The state file is `/tmp/returndesk-public-smoke-state.json`, retaining only synthetic IDs. Confirm records survived restart and 375px browser UI manually; collect actual evidence before modifying CP-006.
3. Complete scoped credential/history/dependency review and remove temporary external PostgreSQL IP access. Verify actual author hours and GitHub description/homepage; keep PR #1 draft until documented hosted write/restart/UI acceptance, exact CI and final review pass.
4. Release `main` and submit the source/demo links only when the gates pass. **Submission deadline: 23 October 2026 at 11:00 IST.** User acknowledgment remains pending; no email sent.

Source-controlled test harness work is the current step, not a claim of completed live testing. Existing Nexa Care resources must remain untouched.
