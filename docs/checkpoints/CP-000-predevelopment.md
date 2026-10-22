# CP-000 — pre-development documentation

Date: 2026-10-22 (Asia/Kolkata).
Previous baseline: aae6763576d0f277300ac0abca5643e711e855b0 — README, architecture and gitignore present; no app.
Authorization: user requested every needed pre-development Markdown file, mandatory review-before-push, updated acknowledged checkpoints and fresh online research for next steps.

## Scope
Add repository instructions, current status/next step, workflow, requirement/contract summaries, test/review/research plans, decisions/risks/release checklist and checkpoint template. Preserve the technical architecture.
Fresh evidence: RESEARCH_LOG R-001 through R-008; newer IWC-Bench and 2026 TDDev methodology inspected along with official PostgreSQL/Next.js/Playwright guidance. Failed EvoWeb retrieval is explicitly not adopted.

## Review
Type: assistant self-review, not an independent reviewer.
Review checks: requirement/architecture consistency; no runtime success claims; distinction between technical review and user acknowledgment; correct 36-row arithmetic; pre-push sequencing; no new stack or product scope; relative documentation links.
Findings addressed before publication: avoid treating user authorization as acknowledgment; avoid making post-push CI the first review; record research depth and retrieval failure; do not claim hooks or branch protections exist.
Runtime tests/build/migrations: NOT RUN, N/A to docs-only change. Application remains unimplemented.
Pre-publication check: 30 relative Markdown links resolved successfully across the 20 changed files and existing architecture. Final content self-review: PASS for this docs-only scope. No application functionality was tested. This checkpoint's enclosing commit identifies its candidate; it cannot contain its own future SHA.

## Publication
Published documentation candidate: e58e55f6c939a21d721a405e6fcf94372b20a19c, tree 123808f74f1c05464d313f7fde1ecf933d85d2ee. Remote refs/heads/main was read back and matched that commit. Pre-publication review and 30-link check passed. CI is not configured; no runtime test success is claimed.\n\nThis receipt is a separate documentation-only amendment: self-reviewed against the returned commit/ref evidence before publication. It changes reporting only; no application or policy changes. Its enclosing Git commit is the receipt revision.
User acknowledgment of completed pack: PENDING.

## Next step
CP-001 Foundation, detailed in ../NEXT_STEP.md. Depends on this contract/review baseline, not on any claimed running code. Freshly verify framework/driver/migration compatibility, scaffold, run clean migration/build and document actual outcomes before the next push.
