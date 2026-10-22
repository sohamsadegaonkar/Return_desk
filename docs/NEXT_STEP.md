# Next working step: CP-001 Foundation

## Relationship to previous work
CP-000 supplies a reviewed architecture, requirement map, test expectations and research/review protocol. It does NOT supply executable software. Use those contracts to build the minimum runnable foundation.

## Entry gate
Read CP-000: documentation candidate e58e55f6c939a21d721a405e6fcf94372b20a19c was reviewed and remotely verified; use the current receipt commit as the final predecessor. Record its exact enclosing commit as predecessor. Explicit user acknowledgment remains separately tracked; do not claim it occurred.
Check available Node/package-manager/PostgreSQL versions and remaining assignment deadline from actual evidence.

## Fresh research before implementation
Recheck current Next.js App Router installation/Node runtime and caching guidance, Drizzle generated columns/migrations/transaction support, PostgreSQL 16 generated columns and locking, and the deployment driver's interactive transaction support. Inspect a relevant primary paper from RESEARCH_LOG and search for newer relevant evidence. Record inspected sections, versions, chosen approach and rejected alternatives. Existing downloaded skills alone do not satisfy this gate.

## Work
1. Scaffold from create-next-app with TypeScript, App Router and Tailwind, preserving existing docs and Git history.
2. Pin actual dependencies and commit the lockfile. Establish server-only DB access.
3. Add local PostgreSQL setup, environment example and committed initial migration aligned with architecture.md.
4. Add initial independent database/contract checks and safe isolated test configuration.
5. Prove fresh migration, a minimal build and PostgreSQL connectivity. Prepare an early deployment if credentials are available; otherwise document the exact blocker and continue authorized local work.
6. Build the seed during foundation/API work so UI development has data; do not postpone it to the final hour.

## Exit evidence
Actual commands and results for install/build, empty-database migration and relevant constraints; no secrets; review of exact diff; updated CP-001, STATUS, NEXT_STEP and research log. Do not invent scripts before package.json exists.
Next after success: CP-002 uses the verified schema/connection/contracts to implement create and combined list queries. No app runtime gate may be marked successful from source inspection alone.

## Confirmed deadline and execution mode
Submit by 23 October 2026 at 11:00 AM IST, as stated by the user. Internal freeze target is 10:00 AM IST. Four assigned agents stopped due to usage limits without commits in assigned worktrees; see TEAM_PLAN.md. The integrator may continue authorized work sequentially. Do not claim four active engineers until they actually resume.

## Continuation after the scaffold
The reviewed scaffold in CP-001 now supplies the executable Next.js toolchain. Next implement the pure domain contract and independent truth-table tests, then the PostgreSQL schema and migration; verify against a real isolated PostgreSQL instance. CP-001 remains incomplete until its database/runtime gates pass. Re-establish agent capacity before assigning parallel ownership. Read the current partial checkpoint before editing.

## Active parallel continuation
All four engineers have resumed concurrently with isolated write ownership (see TEAM_PLAN). Domain builds schemas/policy; database builds persistence/migration/seed; frontend owns manifests and build; verification writes independent tests. Integrator reviews exact commits and combines them serially. Do not describe unintegrated agent output as a passing checkpoint.
