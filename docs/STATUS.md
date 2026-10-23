# ReturnDesk release status — 23 October 2026 (Asia/Kolkata)

**Deadline:** 11:00 AM IST, 23 October 2026. **Verified integration head:** `83873e98d87ad432d91b26877a346fd73bbe1b1d`. **PR #1 integration → main:** still DRAFT/UNMERGED. **User release acknowledgment:** PENDING.

## Passed — provider, CI and actual hosted demo evidence
- [CI 39862332316](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39862332316) **SUCCESS** on `83873e98d87ad432d91b26877a346fd73bbe1b1d`: lint, typecheck, production build, 106 unit/client tests, 57 isolated real-HTTP tests, 23 PostgreSQL invariant checks, 12 desktop/375px Playwright tests, and offline public smoke harness. CI used disposable PostgreSQL, **not hosted Render**.
- Hosted Render web deployment `dep-dbd8k9brjlhs73ccuuc0` of exactly `83873e98d87ad432d91b26877a346fd73bbe1b1d` confirmed **LIVE** at 03:43:43 IST, 23 October. https://returndesk-submission-demo.onrender.com
- Hosted PostgreSQL migration and clean synthetic seed completed in Codespaces. Public GET list initially showed **HTTP 200, 36 visible / 36 returned**; fixed synthetic detail **HTTP 200, one note**.
- Public manual write harness `RETURNDESK_LIVE_TEST=YES npm run test:live:run` reported **LIVE WORKFLOW SMOKE PASSED**: synthetic create/read/edit, legal status chain, stored refund decision (no payment executed), blocked terminal edit, append/read note, search/status filter, soft removal and hidden 404. One added Completed request remains visible; no seeded record was mutated.
- The user ran `npm run test:live:verify` **again after the confirmed new deployment was Live**, reporting completed record HTTP 200 and removed record HTTP 404, ending **POST-RESTART READ VERIFICATION PASSED**. This is evidence of *persistence across Render deployment*; it does not independently verify the physical host actually restarted.

## Outstanding release gates
- Real **live public-browser acceptance at desktop and 375px**, including queue/workspace, note, action visibility, menu/overflow, focus/keyboard and error presentation. Isolated Playwright CI results do not prove this production-URL check.
- Full historical secret scan and dependency/advisory review, and removal of any temporary Render PostgreSQL external-client IP access. Public routes are intentionally unauthenticated; use **synthetic demonstration data only**.
- Repository description and homepage are unset. Author's actual development hours are **NOT SUPPLIED**; no hours invented.
- CP-006 human acceptance, review of the final merge candidate, PR #1 merge to main, successful main CI and required submission are **PENDING**. No submission email has been sent.

**Verdict:** Backend API, hosted database/write workflow and persistence across deployment **PASS**. Final public browser, security/ops, metadata/hours and release merge **PENDING**. See [release checklist](RELEASE_CHECKLIST.md), [CP-006](checkpoints/CP-006-render-release.md), [next step](NEXT_STEP.md).

## New user-requested UI redesign (UNMERGED CANDIDATE)
After the user rejected the old generic interface, the next design candidate adds adaptive navigation, URL-backed quick filters and search reset, clearer form labels and status progress, and a coordinated visual-token layer. API/database unchanged. **Source CI passed but the candidate is not deployed, authored in Figma, or approved by user.** The existing Render service remains the last accepted API deployment. See [CP-007](checkpoints/CP-007-ui-ux-redesign.md) and [UI design handoff](design/UX_REDESIGN_V2.md). Existing release gates remain open.

### CP-007 tested candidate update
Exact candidate CI [39868873522](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39868873522) **PASS** on bf1aa8d (19/19 workflow steps, 16 browser-project scenarios), following correction of the first browser failure. Desktop 1440 and mobile 375 screenshots were generated and integrator-inspected. **User design approval and Figma file are still pending**; PR #9 remains draft, and current Render continues to show the old UI.

### Latest UI v2 qualified source checkpoint
At `28a25ceb479fa19c88b8e7260897a70b85372cfb`, [CI 39870760077](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39870760077) passed 19/19 workflow steps with six screenshot files spanning queue, create and detail at desktop/375px. Manual screenshot review confirmed properly aligned search icon, six visible status chips and decision-before-notes on mobile. **Not yet deployed or user-approved; no editable Figma canvas authored.** PR #9 draft, main release PR #1 draft.

### CP-007 latest — replacement Figma direction B, user approval still pending
The owner **rejected the original Figma design** as repeating the dated generic UI. The XFactor Figma file has since been rebuilt with six newly composed native-editable Resolution Studio screens; old six frames removed. Integrator inspected revised desktop/mobile renderings. **Current app source in PR #9 has NOT been updated to match this second design direction**, so CI of prior source does not qualify the redesigned visual experience. PR #9 and PR #1 remain draft/unmerged; public Render remains the prior stable application. Next: owner visual verdict then exact code parity/review, tests and deployment.
