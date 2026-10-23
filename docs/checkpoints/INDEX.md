# Checkpoint index

CP-002–005 retain historical isolated-CI qualification on reviewed source `d01f7e54958ed1287c1c29c0925b45f3b9f42967` ([run 39838667897](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39838667897)). Current hosted evidence is recorded in CP-006 on `83873e98d87ad432d91b26877a346fd73bbe1b1d`: migration/seed, public API read/write smoke and persistence across a completed Render deployment **PASS**. A physical host restart was not independently verified. Final release gates remain open.

| ID | Record | Verified state |
|---|---|---|
| CP-000 | [Pre-development](CP-000-predevelopment.md) | Initial research and specifications |
| CP-001 | [Foundation](CP-001-foundation.md) | Historical source/DB/QA audits; later integrated and hosted evidence in CP-006 |
| CP-002 | [Create/find](CP-002-create-find.md) | Isolated CI PASS; hosted API create/read/search/filter smoke PASS in CP-006 |
| CP-003 | [Lifecycle](CP-003-lifecycle.md) | Isolated CI PASS; hosted legal lifecycle/refund-decision smoke PASS in CP-006 |
| CP-004 | [Edits/notes/removal](CP-004-edit-notes-removal.md) | Isolated CI PASS; hosted edit/note/removal smoke PASS in CP-006 |
| CP-005 | [Workspace/recovery](CP-005-workspace-recovery.md) | Isolated CI PASS; live hosted desktop/375px browser acceptance pending |
| CP-006 | [Render deployment/submission](CP-006-render-release.md) | PARTIAL: hosted API/DB/persistence PASS; final browser, security/ops, metadata/hours and release gates pending |
| CP-007 | [UI/UX redesign v2](CP-007-ui-ux-redesign.md) | UNMERGED CANDIDATE: exact `455accf` CI PASS; editable Figma, user visual approval and hosted redesign acceptance pending |
| CP-008 | [Parallel review/accessibility](CP-008-ui-review-accessibility.md) | Four reviews integrated; 28afb979 source CI/refreshed images PASS; owner/Figma/hosted approval pending |

UI predecessor: `455accfbd2385d315dc567d87aa0d16954056fae`, [CI 39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084) **PASS** with 106 unit/client, 57 HTTP, 23 PostgreSQL assertions and 16 desktop/375px browser project scenarios. These are isolated tests; public Render still shows the earlier UI. PR #9 and release PR #1 remain draft/unmerged.

User acknowledgment remains PENDING. [Checkpoint template](../templates/CHECKPOINT_TEMPLATE.md). [Current status](../STATUS.md). [Next dependent step](../NEXT_STEP.md).
