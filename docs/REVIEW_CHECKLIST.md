# Mandatory pre-push review

Every step, including Markdown changes, must be reviewed before publication.
Record reviewer, review type (self/separate), base SHA, candidate manifest/diff, findings and disposition.

- [ ] Scope maps to requirement IDs and previous checkpoint.
- [ ] Fresh sources are inspected and applicability/limitations recorded.
- [ ] Required stack and assignment rules are preserved.
- [ ] Inputs/errors/serialization and UI/server contracts agree.
- [ ] Transaction boundaries and unique constraints cover races.
- [ ] Existing behaviours affected by this change are rechecked.
- [ ] No hidden-data leak, secret, unsafe cleanup or false completion claim.
- [ ] UI legal actions, mobile/error states checked when affected.
- [ ] Changed documentation, links and example commands are accurate.
- [ ] Checkpoint, STATUS and NEXT_STEP describe actual state and dependency.
- [ ] Blocking findings fixed; applicable checks pass or limitations clearly prevent success status.
- [ ] Exact final candidate frozen after review; any later edit reviewed again.
- [ ] Publish only reviewed bytes; verify remote head afterwards.

Docs-only applicability: review content/links and contract consistency; build/database/browser tests are N/A, not passed.
Automation can check evidence fields and run tests, but cannot prove a meaningful human/agent review occurred. Branch protection is not established by this document.
