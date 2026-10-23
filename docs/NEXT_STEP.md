# NEXT_STEP — CP-007 owner visual verdict, then Figma-to-code reconciliation

**Predecessor:** owner rejected the original generic Figma composition after source commit `86e4940`. The XFactor [editable Figma file](https://www.figma.com/design/fTxY2wtkJdTUzvo9Qb9J2l) now contains **six replacement Resolution Studio screens** with 390px mobile and 1440px desktop compositions. The rejected first six frames were removed from the active canvas. A visual self-review of all screen types has been performed; **owner signoff is NOT established**.

1. Ask owner to inspect replacement Queue desktop (`7:2`), Queue mobile (`9:2`), Detail mobile (`9:112`) in Figma. Capture explicit visual accept/reject with concrete feedback; do not claim they approved merely because the file exists.
2. If accepted, **reconcile the source implementation**: PR #9 currently passes CI for an older blue/navy UI but does NOT implement Resolution Studio's forest/citron component system. Update design tokens, sidebar, queue/selected-case workflow, mobile density, form and decision layout; ensure all actual controls remain API-backed and server-authorized. No fake functionality or API/DB schema changes.
3. Isolate and review the code diff; run lint, typecheck, unit and isolated PostgreSQL/HTTP, Playwright desktop + 375/390, keyboard/focus, loading/empty/uncertain states; screenshot inspect before committing/merging. Update CP-007 and RESEARCH_LOG only on verified checkpoints.
4. After owner accepts the updated production preview, merge PR #9 into integration, verify integrated CI, redeploy Render exact reviewed commit, retest live UI and persistence without reseeding. Finish CP-006 security and repo metadata/hours review; only then merge PR #1 to main and complete submission.

**DO NOT merge PR #9 or PR #1 or redeploy Render until reviewed parity and acceptance.** Deadline: 23 October 2026, 11:00 IST; report any schedule shortfall truthfully.
