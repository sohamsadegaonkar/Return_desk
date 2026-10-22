# Risks and unresolved dependencies

| Risk | Current state | Response |
|---|---|---|
| Deadline 23 October 2026, 11:00 AM IST | User confirmed | Target 10:00 AM feature freeze; prioritize mandatory gates |
| No runnable app yet | Known | Begin foundation after reviewed docs |
| Runtime/package/hosting compatibility | Unverified | CP-001 fresh official-source check and real build/connection test |
| Deployment credentials/account access | Unverified | Identify blocker without committing secrets; continue local authorized work |
| Removed Open permanently blocks same item | Accepted literal interpretation | Explicit UI warning and README assumption |
| Duplicate note/create after lost response | Known limitation | No blind retries; idempotency deferred |
| SQL/Drizzle blueprint mismatch | Untested | Clean migration and schema inspection before API development |
| Tests accidentally hit demo DB | Preventable | Isolated test URL and fail-closed guard before cleanup |
| Public demo has no auth | Explicit scope | Synthetic data; do not market as production-ready |
| Stale paper summaries | Known | Fresh primary sources and recorded depth; no numerical promises |
| Docs governance mistaken for automation | Known | CI/branch protection not configured; do not claim technical enforcement |
| Self-review misses defects | Residual | Explicit failure cases, independent test expectations; never call self-review independent |

For each discovered defect record reproduction, observed/expected, severity, affected checkpoint, fix and recheck. Do not erase failures from checkpoint history.
