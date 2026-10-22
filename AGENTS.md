# Repository instructions

These instructions apply to every development step, documentation change and checkpoint in ReturnDesk.

## Mandatory sequence
1. Read README.md, docs/STATUS.md, docs/NEXT_STEP.md, the previous checkpoint and affected contracts.
2. State the dependency on the previous checkpoint, acceptance criteria and affected requirement IDs.
3. Perform a fresh online evidence check for the next material implementation decision. Read primary research and version-appropriate official documentation. Record what was actually inspected in docs/RESEARCH_LOG.md.
4. Implement a small coherent change. Skills and cached knowledge may assist execution but are not sufficient evidence for architectural or implementation decisions.
5. Verify the changed behaviour and affected prior behaviour. Review the exact diff, not just a summary or passing test output.
6. Fix blocking findings; rerun affected checks. Update the checkpoint, STATUS, NEXT_STEP and affected contracts.
7. Review the final code-and-documentation candidate BEFORE pushing or publishing any branch update. No unreviewed work may be pushed.
8. Push only the reviewed candidate; verify the remote head and applicable CI. Post-push CI supplements, never replaces, pre-push review.
9. Record actual user acknowledgment separately. Never invent approval or infer acknowledgment of an unseen result.

## Review and checkpoint rules
- A step is a coherent reviewed change, not each keystroke. Review applies to every step, including docs-only updates.
- Use docs/WORKFLOW.md and docs/templates/CHECKPOINT_TEMPLATE.md.
- Every successful checkpoint needs a Markdown record, evidence, review outcome, dependency and next action. Every acknowledged checkpoint must additionally record who acknowledged it, what was acknowledged and when.
- Acknowledgment is not automatic permission to deploy or send email. Follow the user's existing authorization; do not create unnecessary confirmation loops.
- Unacknowledged reviewed work may continue within authorized scope if technical gates pass; keep acknowledgment marked PENDING. If the user explicitly makes acknowledgment a gate, stop at that gate.
- Use a separate review pass. Call it self-review unless another actual reviewer participated; do not fabricate independent review. No subagents are mandated by this file.
- Do not change reviewed bytes and then push without reviewing the changed candidate again.
- Never label planned tests, absent CI or an unrun migration as passed.

## Constraints
Assignment requirements control stack and product behaviour. Keep Next.js App Router, React, Node.js, PostgreSQL and Tailwind. No template CRUD repository, generated BaaS endpoints, MongoDB or browser-storage persistence.
Follow docs/architecture.md for technical behaviour. Record new findings in docs/DECISIONS.md before changing a frozen contract.
Never commit secrets or run destructive tests against the demo database. Do not publish the private assignment email.
Research does not authorize scope expansion. Fresh evidence may confirm an existing design; a newer paper is not automatically better.
