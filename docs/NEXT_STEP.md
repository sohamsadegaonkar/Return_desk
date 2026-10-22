# Next working step — qualify the UI v2 candidate

**Predecessor:** CP-006 hosted API and cross-deployment persistence passed on the accepted application. User explicitly rejected the dated visual UI and requested new UX research and Figma-quality design. Existing integration CI [39865008569](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39865008569) passed on b522568; it did NOT test UI v2. The UI redesign is currently an **unmerged branch candidate**; public Render is unchanged.

1. Review [CP-007](checkpoints/CP-007-ui-ux-redesign.md) and [Figma/design-system handoff](design/UX_REDESIGN_V2.md); inspect exact source diff and accessibility/interaction impact. Do not claim a Figma design file exists without connection.
2. Run exact-head PR CI with lint, typecheck, 106 unit/client, isolated PostgreSQL/HTTP, existing browser flows plus the new nav/filter/progress tests, at desktop and 375px. Fix regressions before approving a merge.
3. Obtain user visual approval from a real browser screenshot/preview at 375px and desktop. Inspect keyboard navigation and every visible button/interaction.
4. Only after approval merge to integration, verify integrated CI, redeploy Render and conduct hosted UI/browser acceptance against the existing synthetic database. Do not re-seed.
5. Then finish CP-006 security/ops cleanup, author hours, GitHub metadata and PR #1 to main before 23 October 2026 11:00 IST. Do not invent signoff or completion.

User acknowledgement is PENDING.
