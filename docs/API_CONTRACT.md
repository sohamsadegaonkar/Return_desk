# API contract summary

Canonical details: [architecture](architecture.md), sections 4, 6 and 9. Route Handlers and transactional service implemented; real PostgreSQL-backed HTTP execution is pending.
| Route | Success |
|---|---|
| GET /api/requests | 200 data array + pagination |
| POST /api/requests | 201 data request, always initially Open |
| GET /api/requests/:id | 200 data request, chronological notes and capabilities |
| PATCH /api/requests/:id | 200 data updated request |
| POST /api/requests/:id/transitions | 200 data updated request |
| POST /api/requests/:id/notes | 201 data new note |
| DELETE /api/requests/:id | 204 empty body |

PATCH, transitions and DELETE require positive expectedVersion in JSON. Notes require body only and do not bump request version. All existing-parent writes lock visible parent in one transaction; creation relies on the unique index.
PATCH omitted fields remain unchanged; null clears optional contact. Validate merged contact state. Reject unknown/server-owned fields and no-op empty edits.
Only In Review → Approved sets resolution/refund. Approved → Completed preserves them.
Removed resources return 404 on all detail and nested writes. Malformed UUID is 400; valid missing UUID is 404.

Failures: {error:{code,message,fieldErrors,details?}}.
400 BAD_REQUEST; 422 VALIDATION_ERROR; 404 REQUEST_NOT_FOUND; 409 INVALID_TRANSITION/LIVE_REQUEST_EXISTS/DETAILS_LOCKED/REMOVAL_NOT_ALLOWED/STALE_REQUEST; 500 INTERNAL_ERROR.
Parse/shape precedes lookup, version precedes business eligibility, then merged/operation-specific validation. Do not map every unique violation to duplicate-live-item.

Money and BIGINT are strings; timestamps are ISO strings. Refund amount is positive decimal, max 9999999999.99, at most two fractional places; output exactly two. Non-refunds carry no recorded amount.
List: q, status, reason, sort, direction, page, pageSize. Defaults page 1, pageSize 10, createdAt desc; max pageSize 50. Sort allowlist: createdAt, updatedAt, reference (numeric reference_number), customerName; id desc tie-breaker. Same snapshot/predicates for count and rows. Escape literal wildcards and bind user values. No automatic replay of uncertain writes.
