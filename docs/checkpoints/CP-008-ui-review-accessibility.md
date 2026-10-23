# CP-008 — Parallel review and bounded UI accessibility corrections

**Date:** 23 October 2026, IST. **State:** reviewed local candidate; exact published-head CI pending. **Dependency:** CP-006 hosted API/persistence → CP-007 UI v2 `455accfbd2385d315dc567d87aa0d16954056fae`. **Requirements:** UI-01, UI-02, SUB-01–03. **Human acknowledgment:** PENDING.

## Acceptance and changes

Four engineers worked concurrently in isolated branches/worktrees with disjoint ownership: [UX](../engineers/review-ux-455accf.md) inspected six actual screenshots/source; [interactions](../engineers/review-interactions-455accf.md) inspected state/recovery; [release](../engineers/review-release-455accf.md) independently inspected CI/logs/inventory; [docs](../engineers/review-docs-455accf.md) reconciled stale blockers. Root reviewed and integrated commits serially. No major visual/state blocker established within that scope.

Two medium findings accepted and corrected:

1. Native action dialog now uses React `useId` and `aria-labelledby` to reference its visible heading. Existing approval browser flow asserts computed name “Approve this request.”
2. Static future-stage labels/numbers and placeholders use `#62718a`: **4.9431:1 on white**, **4.6867:1 on #f7f9fc** by source sRGB luminance. Placeholder opacity explicitly 1; active/completed styling retained. These pairs alone do not prove whole-product WCAG conformance.

No API/domain/database/migration/seed/dependency/workflow change. Six exact predecessor PNGs retained unchanged with [provenance](../design/UI_V2_VISUAL_REVIEW.md); not refreshed post-fix or hosted screenshots. Current source identities, completed hosted milestones and XFactor selection/blocker reconciled in docs.

## Research and verification

Fresh W3C WCAG 2.2 contrast/APG naming guidance and TDDev abstract inspected; interaction engineer inspected React useId. [R-017](../RESEARCH_LOG.md) records actual depth/limits. Primary standards determine the specific fixes; no benchmark performance gain is transferred to ReturnDesk.

- Prior exact `455accf` [CI 39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084): all 19 steps PASS; 106 unit/client +57 HTTP +23 PostgreSQL +16 browser +4 offline smoke. Independently inspected job logs.
- Integrated local `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`: PASS, 106 tests. The first build could not resolve dependencies through an out-of-root symlink; replacing it with a local dependency copy from the matching lockfile resolved that environment issue without source/config changes. Source contrast calculated using WCAG relative luminance.
- New browser assertion awaits isolated CI. No local PostgreSQL/Chromium execution claimed; no Render writes, reseed, merge or deployment.
- Root exact code/docs diff review and whitespace checks PASS; all 63 targeted relative Markdown links resolve, and six PNG byte comparisons match the original artifact. Separate read-only UX reviewer inspected the exact integrated source/docs candidate and independently confirmed the corrected ratios, heading linkage, assertion, links and six PNG hashes: PASS, no blockers found. Reviewer did not run a browser. Root reviewed this final receipt before commit/push; publication/exact-head CI receipt is recorded separately, never inferred from predecessor success.

## Next dependent step and acknowledgment

Verify published exact head/CI and refreshed screenshots; present Queue/Create/Detail at both widths for owner feedback. Resolve editable Figma destination, then planned visual/design approval before UI integration/deployment. Hosted responsive/keyboard and remaining CP-006 release checks follow approved deployment without reseeding. Every successful checkpoint updates Markdown evidence and the next action; every acknowledgment records actual person/scope/time. **Owner acknowledgment remains PENDING.**
