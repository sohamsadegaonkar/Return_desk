# UI v2 — actual six-screen review evidence

**Source:** `455accfbd2385d315dc567d87aa0d16954056fae`, [CI 39888722084](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39888722084), job `120203014748`, artifact `12474030697` (`browser-and-server-evidence`). Archive SHA256 **25a841ecd664c73b50a673d992af627294c300e3a9acf2b2bdca5c2529c059de** verified against provider digest. PNGs copied unchanged from isolated CI synthetic fixtures; not hosted, Figma or post-fix captures.

Root and independent UX reviewer inspected all six. No major visual blocker established: all six mobile status chips wrap, long labels remain within cards, mobile decisions precede notes, desktop actions are prominent. Unnamed dialog/faint progress and placeholder findings are corrected in [CP-008](../checkpoints/CP-008-ui-review-accessibility.md), requiring fresh CI. PNGs do not prove keyboard/screen-reader/all-state behavior. Queue sample is a single filtered fixture.

| Screen | Desktop 1440px | Mobile 375px | Review focus |
|---|---|---|---|
| Queue | [Open](evidence/455accf/queue-desktop.png) | [Open](evidence/455accf/queue-mobile-375.png) | Find/filter requests and read rows/cards. |
| Create | [Open](evidence/455accf/create-desktop.png) | [Open](evidence/455accf/create-mobile-375.png) | Contact requirement, item fields, save destination. |
| Detail | [Open](evidence/455accf/detail-desktop.png) | [Open](evidence/455accf/detail-mobile-375.png) | Saved status, legal decisions before notes. |

## Desktop queue

![Desktop queue](evidence/455accf/queue-desktop.png)

## Mobile detail

![Mobile detail](evidence/455accf/detail-mobile-375.png)

## Pixel provenance

| File | SHA256 |
|---|---|
| create-desktop.png | cd56a49df3ea82bd31b973b988831f6ac5f09de557ff9a8e71ea839630efb11d |
| create-mobile-375.png | bb5c0bee7f3be730e856749215f12c6c956e343a7b56f6dd5adbc1a5842de193 |
| detail-desktop.png | a90e25e07f5e9e7db83b5f39f3da9ab36448c219b9bdbf617d2501598fdf0ac9 |
| detail-mobile-375.png | e9486074ea922b29e35fe7b9d2467d6e98002b3b9653490f49434ff97f8261c5 |
| queue-desktop.png | 66d1d45317e1be58c18dcafac1f4930311cbd6a2f58959dc91215812030f552c |
| queue-mobile-375.png | 038d1bce38b29faf60c2e64485d7cbcd304003e68dd12374744fbc4b3d4dffec |

**Owner acknowledgment: PENDING.** Next: qualify CP-008 and obtain specific visual feedback; resolve editable Figma access. PR #9/#1 stay draft; no Render deployment or data reset is part of this review.

## Qualified accessibility follow-up — current review set

Exact source **28afb979491956716d08992f001771a7062fdd8b**, [PR #10](https://github.com/sohamsadegaonkar/Return_desk/pull/10), [CI 39895331140](https://github.com/sohamsadegaonkar/Return_desk/actions/runs/39895331140): all 19 steps PASS. Job 120224331084 confirms 106 unit/client, 57 HTTP, 23 PostgreSQL invariants, 16 browser project scenarios and 4 offline smoke tests. The new computed dialog-name assertion passed in the approval flow on both desktop and 375px. This is not a full assistive-technology audit.

Artifact **12476094254** archive SHA256 **a9e4f1b8148d74a32590eeb42dd53dd1c65f39afa153b66c480c2340fe9687a2**, verified against provider digest. Root inspected all six refreshed images. Future progress labels and note placeholder are visibly darker; responsive containment, wrapping chips and decision-before-notes remain. Synthetic long names vary across runs; images do not represent real customers. No hosted or owner acceptance is inferred.

| Screen | Desktop | Mobile 375px |
|---|---|---|
| Queue | [Open](evidence/28afb979/queue-desktop.png) | [Open](evidence/28afb979/queue-mobile-375.png) |
| Create | [Open](evidence/28afb979/create-desktop.png) | [Open](evidence/28afb979/create-mobile-375.png) |
| Detail | [Open](evidence/28afb979/detail-desktop.png) | [Open](evidence/28afb979/detail-mobile-375.png) |

| Current PNG | SHA256 |
|---|---|
| create-desktop.png | 31620d3b0654c9d4efdbbe09fe41a7c2f51d474179635f937ced0bb24c000821 |
| create-mobile-375.png | 5a3ec5192509a3b6a98405bc1a9c03feadca3a13b1e9c912d1338ac852f0610f |
| detail-desktop.png | e0a5cdec88b683b6e92ce3658c31b91518836370952d2aa3efdf88557cf47e0d |
| detail-mobile-375.png | a04acc2a8371a88f90da0c07b7f1a31019479c33db059393762b172d794e22a1 |
| queue-desktop.png | b5c0dbde657a80b74764b46a51c86e4d0f684283d766b318176a7b6f45002349 |
| queue-mobile-375.png | 3a4ec3a5de914c15cae4af97a6416144277d2aed65b982f974190710990d2302 |

Next: owner feedback on these actual screens and editable Figma destination. Existing visual/design gate remains; PR #10/#9/#1 draft/unmerged, Render unchanged.
