# Parallel engineering and deadline

User-confirmed deadline: **23 October 2026, 11:00 AM Asia/Kolkata (05:30 UTC)**.
Internal release-freeze target: 10:00 AM IST. This is a target, not a guarantee of completion or unattended overnight execution.

## Assigned ownership (agents currently stopped by usage limit)

| Engineer | Isolated branch | Exclusive write scope |
|---|---|---|
| Domain | engineer/domain | src/domain/requests/**; docs/engineers/domain.md |
| Database | engineer/database | drizzle/**; src/server/db/**; scripts/migrate.ts; scripts/seed.ts; docker-compose.yml; drizzle.config.ts; .env.example; docs/engineers/database.md |
| Frontend/build | engineer/frontend | package/lockfile; framework/config files; src/app/layout.tsx, page.tsx, globals.css, favicon.ico; public/**; docs/engineers/frontend.md |
| Verification | engineer/verification | tests/**; vitest.config.ts; docs/engineers/verification.md |
| Integrator | integration/foundation | Shared docs, integration fixes after ownership handoff, commits/PRs/publishing |

## Conflict prevention

All four worktrees start from ed14c49d4de0cb5ad07c2f2263db405bef709429. Engineers must not edit another owner's files, shared status/research logs, or another worktree. Only the frontend/build owner changes dependency manifests and lockfiles. Communicate requested interface/dependency changes first.
Each engineer performs fresh research, implements, reviews its exact diff and commits locally. No engineer pushes or merges. Report sources, checks, limitations, commit SHA and next step in its dedicated Markdown handoff.
The integrator checks each changed-file list against ownership, reviews the diff, integrates commits serially and reruns combined checks. A conflict means STOP and reconcile with its owners; never overwrite with ours/theirs blindly. No force pushes. Remote main changes require rebase/reconciliation and renewed review before publication.
Only reviewed, verified candidates are published on a feature/integration branch. Open a PR; main remains protected by this workflow, not by an unconfigured technical branch-protection claim. User acknowledgment is tracked separately from technical review.

## Dependencies and continuity

CP-000 documentation enables CP-001 Foundation. Domain and database contracts are built in parallel; frontend owns the executable environment; QA independently writes expected outcomes. Isolated component completion is not integrated success.
After CP-001: assign API/service ownership explicitly, expand frontend to real screens, and extend QA to direct HTTP/browser scenarios. Keep the same single-integrator rule and document new file ownership before edits.
At each accepted checkpoint update STATUS, NEXT_STEP, RESEARCH_LOG and its checkpoint record. At actual user acknowledgment record the message and timestamp; do not infer sign-off from the deadline instruction.

## Time priorities

1. Foundation and real PostgreSQL checks.
2. Complete business-rule APIs and server-side query composition.
3. Connect required UI and 36 visible seed rows.
4. Verify deployment, mobile and failure cases.
5. Freeze features by 10:00 AM IST if possible; reserve the last hour for release smoke checks and submission links.
If time tightens, drop optional timeline/idempotency extensions first. Preserve truthful README and submit actual work. Submission email sending requires separate explicit authorization.

## Execution interruption
All four agents reported a usage-limit error without commits or changes in their assigned worktrees. Worktree status was checked: all four remain clean at the baseline. They are not running in the background. Integrator may continue sequentially in the integration worktree; resume parallel work only after capacity is actually restored and ownership re-established. No deliverable or independent review is credited to the interrupted agents.

## Temporary handoff
The integrator takes frontend/build ownership while agents are stopped. An existing create-next-app scaffold was found outside the worktrees; its files were inspected and selectively adapted, preserving repository governance. No independent agent review is claimed.
