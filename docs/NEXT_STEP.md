# Next working step — verify integrated runtime

Predecessor: reviewed CP-000 plus CP-001 integrated source, component handoffs and local checks. The verified domain/client and build outputs support the runtime candidate; they do not prove PostgreSQL/API/browser workflows.

## Immediate gate
1. Review final exact source/docs/workflow diff and lockfile provenance; publish the reviewed integration branch candidate. Keep PR draft while real runtime results remain unknown.
2. Observe GitHub Actions on that exact remote head. It must run real PostgreSQL 16 migration twice, safe 36-row/6-note seed and explicit repeated-seed refusal, database invariants, 57 direct-HTTP cases and 12 browser scenarios. Inspect concrete failures; fix owners' paths through reviewed commits, then rerun affected checks. Missing/blocked execution is not PASS.
3. Record exact CI command/results/revision in CP-001, STATUS and this next-step file. Only actual runtime success can accept CP-001 and the API/UI checkpoints.
4. Provision an authorized hosting account and hosted PostgreSQL; run migrations and synthetic seed once, deploy the reviewed code, verify persistence after app restart and externally smoke-test the public URL. Keep deployment credentials out of Git. If account access is missing, prepare the exact handoff and record the blocker.
5. Freeze features, update README with observed live URL, outstanding work and author's actual hours, and review submission links before the user sends the assignment reply. Deadline: 23 October 2026, 11:00 AM Asia/Kolkata.

## Research and ownership
Freshly recheck primary official docs for any actual CI/deployment failure before changing architecture. RESEARCH_LOG and per-engineer Markdown records preserve inspected paper sections and limitations. Do not substitute skills for fresh evidence or loosen assignment rules to make tests pass.
Four-agent isolated ownership is recorded in TEAM_PLAN; component tasks are finished, integration/review is serial. Assign a focused fix back to its owner if runtime finds a defect. Reestablish ownership before another parallel slice. Every change must be reviewed before push; every successful/acknowledged checkpoint records the next action and actual acknowledgment separately.
