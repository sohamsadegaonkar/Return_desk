# ReturnDesk

A guided returns workspace for a small online store.

## Status

Architecture finalized. Application implementation, database setup, tests and deployment are pending. This repository does not yet contain a runnable application.

## Planned stack

- Next.js App Router and React
- Node.js Route Handlers
- TypeScript and Tailwind CSS
- PostgreSQL and Drizzle
- Zod, Vitest and Playwright

## Planned workflow

Searchable queue → request workspace → guided decision → clear feedback.

Requests follow Open → In Review → Approved → Completed, or In Review → Rejected. Server-side rules will protect resolutions, live-item uniqueness, locked details, append-only notes and soft removal.

## Implementation plan

See [the architecture specification](docs/architecture.md). It is a design contract, not a claim of implemented functionality.

1. Foundation: scaffold, PostgreSQL migrations and initial deployment.
2. Create and find: request creation and combined server-side list queries.
3. Lifecycle: review, approval, rejection and completion.
4. Record maintenance: editing, notes and removal.
5. Interface: responsive screens and failure recovery.
6. Submission: 36-row seed, clean setup verification and deployment checks.

## Setup and deployment

Setup commands, environment variables and the deployed URL will be added when the corresponding functionality exists. No tests have been run yet. Actual implementation time will be recorded as work progresses.
