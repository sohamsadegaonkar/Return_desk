#!/usr/bin/env bash
set -euo pipefail
# Opt-in only. The tests create synthetic fixtures without deleting existing data.
: "${ALLOW_TEST_WRITES:?Set ALLOW_TEST_WRITES=1 for the isolated test database}"
: "${TEST_DATABASE_URL:?Set a separate PostgreSQL test database URL}"
: "${TEST_BASE_URL:?Start the app locally against that test database first}"
if [[ "$ALLOW_TEST_WRITES" != "1" ]]; then
  echo "Refused: ALLOW_TEST_WRITES must equal 1." >&2
  exit 1
fi
npx vitest run --config tests/integration/vitest.config.ts
