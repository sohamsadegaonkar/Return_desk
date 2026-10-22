# Next working step — UI v2 visual approval and editable Figma pages

**Verified predecessor:** exact source `28a25ceb479fa19c88b8e7260897a70b85372cfb` passed [CI 39870760077](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39870760077), 19/19 steps; browser evidence contains queue, create and detail screenshots for desktop and 375px. Source diff remains within UI/UX, isolated tests and docs. Hosted Render still runs previously accepted application; **PR #9 remains draft, unmerged** and CP-007 human approval is still pending.

1. Present **all three screen flows**, especially the 375px detail where decisions now precede notes. Obtain specific feedback on discoverability, readability and every real available user action. The screenshots were produced from isolated CI, not an editable Figma canvas or live Render.
2. Figma access was verified, but the account lists **two potential teams/workspaces**; ask the owner to select one before creating a new design file, per Figma creation procedure. Preferred deliverable: editable Figma frames for desktop/mobile Queue, Create, Detail and modal states, using [tokens and components](design/UX_REDESIGN_V2.md). This step has not been executed.
3. If the owner approves actual visual design and a Figma frame/component review passes, merge PR #9 into integration after checking exact status, CI and manifest. Verify merged integration CI and deploy Render exact SHA; no database reseed. Run hosted desktop/375px visual/keyboard and API read-only acceptance.
4. Finally complete CP-006 security/ops cleanup, author hours and repo metadata, review/merge PR #1 to main, and submit per [release checklist](RELEASE_CHECKLIST.md). Deadline remains **23 October 2026, 11:00 IST**. Do not invent signoff or claim delivery.

**Current stop boundary:** do not merge PR #9 or PR #1, and do not redeploy live Render until review/approval. The next dependency is human Figma workspace selection and UI visual signoff.
