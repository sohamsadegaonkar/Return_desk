# Development, review and push protocol

## Step lifecycle
PLANNED → RESEARCHED → IMPLEMENTED → VERIFIED → REVIEWED → PUSHED.
ACKNOWLEDGED is a separate recorded human event, not an automatic consequence of tests or publication.
Any blocking finding moves the step to NEEDS_FIX. Missing infrastructure/evidence is BLOCKED, not PASS.

## Before each material step
Read its predecessor and identify which verified output makes this work possible. Confirm scope and requirement IDs. Run a focused fresh search; inspect at least one relevant primary paper and official documentation for the affected technology. If no relevant new paper is found, record the search and explain why the strongest existing source still applies. A newly published paper is not required for every step; newly checking the evidence is.
For a tiny formatting-only correction, record research as not applicable with a reason. Do not conduct artificial research to justify punctuation changes.
Do not rely solely on a downloaded skill, remembered API or a search snippet.

## Verification and review before every push
- Review the exact candidate diff for requirements, interfaces, invariants, error handling, privacy and regression impact.
- Run targeted meaningful checks; include previously working dependent flows. Record command, environment, revision, exit result and limitations.
- Perform a separate skeptical review pass. Trace at least one failure case for behaviour changes. Identify whether this is self-review or a genuinely separate reviewer.
- Fix all blocking issues and repeat relevant checks. A documentation-only change needs content/links/consistency review, not fabricated runtime tests.
- Update the checkpoint record, STATUS and NEXT_STEP in the same candidate. Update RESEARCH_LOG for newly inspected sources and DECISIONS for changed choices.
- Freeze the reviewed candidate using a content manifest/tree hash or exact staged diff and base SHA. Do not put a commit's own SHA into its own content. Record the resulting commit SHA in a subsequent reviewed receipt/checkpoint or use the enclosing Git commit as its identity.
- Review documentation edits too. Only then create/push the commit or update a remote branch. GitHub API publishing counts as pushing.
- Verify remote head; inspect applicable CI. If CI fails, mark the checkpoint as failed/blocked and repair before dependent work.

## Branches and integration
Use a small feature branch for application slices, with a reviewed PR before merging main. Local review occurs BEFORE the branch's first push; PR review is additional. Do not force-push shared history. Check base/head before any branch update and reconcile concurrent changes instead of overwriting them.
The initial documentation pack may be committed directly to main after the same pre-publication review. Later docs-only checkpoint receipts may also go directly to main after review if no protected-branch rule prohibits it.

## Acknowledgment and continuation
User instructions authorize work; they do not certify unseen results. Record explicit acknowledgment with timestamp and conversation reference/short quote only when it occurs. Never mark PENDING as acknowledged merely because work was pushed.
When acknowledgment arrives, update the successful checkpoint Markdown plus STATUS/NEXT_STEP in a reviewed docs change, or incorporate that update into the next reviewed checkpoint. Do not ask again for previously authorized work unless a real permission boundary or user-defined gate applies.
If a checkpoint is unacknowledged, continue authorized work only from its verified technical outputs and label the distinction.

## Handoff output
Report what changed, evidence, unresolved limitations, actual remote revision, acknowledgment status and exact next step. Keep runtime successes separate from documentation review.
