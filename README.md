# ReturnDesk

A guided returns workspace for a small online store.

## Current state

Architecture, governance and the Next.js foundation are present. Clean install, lint, typecheck and production build passed. This is a foundation preview: request workflows, PostgreSQL migration and deployment are not implemented.

## Start here

- [Repository instructions](AGENTS.md)
- [Documentation map](docs/INDEX.md)
- [Current checkpoint status](docs/STATUS.md)
- [Next working step](docs/NEXT_STEP.md)
- [Architecture specification](docs/architecture.md)

## Mandatory development workflow

Every coherent step must be verified and reviewed BEFORE pushing. Every successful checkpoint gets updated Markdown evidence and an explicit next step tied to its predecessor. Actual user acknowledgment is recorded separately and never fabricated. Material implementation decisions require freshly inspected research papers and current official documentation; downloaded skills alone are insufficient. See [workflow](docs/WORKFLOW.md) and [research policy](docs/RESEARCH_POLICY.md).

## Planned stack and product

Next.js App Router, React, Node.js Route Handlers, TypeScript, Tailwind CSS, PostgreSQL, Drizzle, Zod, Vitest and Playwright.

Searchable queue → request workspace → guided decision → reliable feedback. Required returns lifecycle, resolutions, live-item uniqueness, locked details, notes and soft removal are specified but not implemented.

## Implementation order

Foundation → Create & Find → Lifecycle → Record maintenance → Responsive UI/recovery → Release rehearsal. Setup commands, environment variables, live URL and actual hours will be documented as they become real. Never use this README as evidence that planned features already work.

## Run the foundation

Requires Node.js >=20.9 (verified with 24.19.0) and npm (verified with 11.9.0).

```sh
npm ci
npm run dev
```

Verification: `npm run lint`, `npm run typecheck`, `npm run build`.
Production start: `npm start`. No environment variables are required for this preview.
No customer records can be created yet. See docs/checkpoints/CP-001-foundation.md for limitations.
