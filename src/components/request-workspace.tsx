"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { RESOLUTIONS } from "@/domain/requests/types";
import type { RequestStatus, Resolution } from "@/domain/requests/types";
import type {
  RequestDetailDTO,
  RequestDTO,
  NoteDTO,
} from "@/server/requests/dto";
import { api, ApiError, asError } from "@/lib/api";
import { fullDate, money, reasonLabels, resolutionLabels } from "@/lib/display";
import { ErrorBox, FieldError, Loading, Status } from "./ui";
import {
  draftFrom,
  draftPayload,
  RequestFields,
  type DetailsDraft,
} from "./request-fields";

type Action = "edit" | "approve" | "remove" | "reject" | "review" | "complete";
export function RequestWorkspace({ id }: { id: string }) {
  const [request, setRequest] = useState<RequestDetailDTO | null>(null);
  const [readError, setReadError] = useState<ApiError | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [noteError, setNoteError] = useState<ApiError | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [noteBusy, setNoteBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState<Action | null>(null);
  const [draft, setDraft] = useState<DetailsDraft | null>(null);
  const [actionVersion, setActionVersion] = useState(0);
  const [resolution, setResolution] = useState<Resolution>("REFUND");
  const [refundAmount, setRefundAmount] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const readSequence = useRef(0);
  const load = useCallback(
    async (signal?: AbortSignal) => {
      const sequence = ++readSequence.current;
      try {
        const result = await api<{ data: RequestDetailDTO }>(
          `/api/requests/${id}`,
          { signal },
        );
        if (sequence !== readSequence.current || signal?.aborted) return false;
        setRequest(result.data);
        setReadError(null);
        return true;
      } catch (error) {
        if (!signal?.aborted && sequence === readSequence.current) {
          const failure = asError(error);
          setReadError(failure);
          if (failure.code === "REQUEST_NOT_FOUND") setRequest(null);
        }
        return false;
      }
    },
    [id],
  );
  useEffect(() => {
    const controller = new AbortController();
    const sequence = ++readSequence.current;
    api<{ data: RequestDetailDTO }>(`/api/requests/${id}`, {
      signal: controller.signal,
    })
      .then((result) => {
        if (sequence !== readSequence.current || controller.signal.aborted)
          return;
        setRequest(result.data);
        setReadError(null);
      })
      .catch((error) => {
        if (!controller.signal.aborted && sequence === readSequence.current) {
          const failure = asError(error);
          setReadError(failure);
          if (failure.code === "REQUEST_NOT_FOUND") setRequest(null);
        }
      });
    return () => controller.abort();
  }, [id]);
  function open(next: Action) {
    if (!request) return;
    lastTrigger.current = document.activeElement as HTMLElement;
    setAction(next);
    setActionVersion(request.version);
    setDraft(draftFrom(request));
    setResolution("REFUND");
    setRefundAmount("");
    setActionError(null);
    dialog.current?.showModal();
  }
  function close() {
    if (busy) return;
    dialog.current?.close();
    setAction(null);
    setActionError(null);
    lastTrigger.current?.focus();
  }
  async function submitAction(event: React.FormEvent) {
    event.preventDefault();
    if (!request || busy || uncertain) return;
    setBusy(true);
    setActionError(null);
    setNotice("");
    let url = `/api/requests/${id}`;
    let method = "POST";
    let body: Record<string, unknown> = { expectedVersion: actionVersion };
    if (action === "edit" && draft) {
      method = "PATCH";
      body = { ...body, ...draftPayload(draft) };
    } else if (action === "remove") method = "DELETE";
    else {
      url += "/transitions";
      const target: Partial<Record<Action, RequestStatus>> = {
        review: "IN_REVIEW",
        approve: "APPROVED",
        reject: "REJECTED",
        complete: "COMPLETED",
      };
      body.toStatus = action ? target[action] : undefined;
      if (action === "approve") {
        body.resolution = resolution;
        if (resolution === "REFUND") body.refundAmount = refundAmount;
      }
    }
    try {
      const result = await api<{ data: RequestDTO }>(url, {
        method,
        body: JSON.stringify(body),
      });
      if (action === "remove") {
        router.push("/");
        return;
      }
      ++readSequence.current;
      setRequest((current) =>
        current && result.data.version >= current.version
          ? { ...result.data, notes: current.notes }
          : current,
      );
      setReadError(null);
      dialog.current?.close();
      setAction(null);
      lastTrigger.current?.focus();
      setNotice(
        action === "edit"
          ? "Request details saved."
          : "Request updated. The current state is shown below.",
      );
      await load();
    } catch (error) {
      const failure = asError(error);
      setActionError(failure);
      if (failure.code === "REQUEST_NOT_FOUND") {
        ++readSequence.current;
        setReadError(failure);
        setRequest(null);
      }
      if (failure.uncertain) setUncertain(true);
      if (
        failure.uncertain ||
        failure.code === "STALE_REQUEST" ||
        failure.code === "DETAILS_LOCKED" ||
        failure.code === "INVALID_TRANSITION"
      )
        await load();
    } finally {
      setBusy(false);
    }
  }
  async function addNote(event: React.FormEvent) {
    event.preventDefault();
    if (noteBusy || uncertain) return;
    setNoteBusy(true);
    setNoteError(null);
    setNotice("");
    try {
      const result = await api<{ data: NoteDTO }>(`/api/requests/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ body: note }),
      });
      ++readSequence.current;
      setRequest((current) => {
        if (
          !current ||
          current.notes.some((existing) => existing.id === result.data.id)
        )
          return current;
        const notes = [...current.notes, result.data].sort((a, b) => {
          const time = a.createdAt.localeCompare(b.createdAt);
          return (
            time ||
            (BigInt(a.id) < BigInt(b.id)
              ? -1
              : BigInt(a.id) > BigInt(b.id)
                ? 1
                : 0)
          );
        });
        return { ...current, notes };
      });
      setNote("");
      setNotice("Note added to the record.");
      await load();
    } catch (error) {
      const failure = asError(error);
      setNoteError(failure);
      if (failure.code === "REQUEST_NOT_FOUND") {
        ++readSequence.current;
        setReadError(failure);
        setRequest(null);
      }
      if (failure.uncertain) {
        setUncertain(true);
        await load();
      }
    } finally {
      setNoteBusy(false);
    }
  }
  const sync = (
    <div className="mt-3 space-y-3 text-sm">
      <p>
        Your draft is preserved. Compare it with the latest saved record before
        taking another action.
      </p>
      <button
        type="button"
        className="button secondary"
        onClick={async () => {
          if (await load()) {
            setUncertain(false);
            setNotice(
              "Current record loaded. Review it before submitting again.",
            );
          }
        }}
      >
        Refresh the current record
      </button>
      {!uncertain &&
        actionError?.code === "STALE_REQUEST" &&
        request &&
        actionVersion !== request.version && (
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setActionVersion(request.version);
              setActionError(null);
            }}
          >
            Use version {request.version} with my draft
          </button>
        )}
    </div>
  );
  if (!request)
    return (
      <>
        <Link href="/" className="back-link">
          ← Back to queue
        </Link>
        {readError ? (
          <div className="surface p-8">
            <ErrorBox error={readError} />
            <button
              className="button secondary mt-4"
              onClick={() => void load()}
            >
              Try loading again
            </button>
          </div>
        ) : (
          <Loading label="Opening request…" />
        )}
      </>
    );
  const cap = request.capabilities;
  const actionTarget: Partial<Record<Action, RequestStatus>> = {
    review: "IN_REVIEW",
    approve: "APPROVED",
    reject: "REJECTED",
    complete: "COMPLETED",
  };
  const currentActionLegal =
    action === "edit"
      ? cap.canEdit
      : action === "remove"
        ? cap.canRemove
        : action
          ? cap.allowedTransitions.includes(actionTarget[action]!)
          : false;
  const actionTitles: Record<Action, string> = {
    edit: "Edit request details",
    approve: "Approve this request",
    remove: "Remove from the desk?",
    reject: "Reject this request?",
    review: "Start reviewing this request?",
    complete: "Complete this request?",
  };
  return (
    <>
      <Link href="/" className="back-link">
        ← Back to queue
      </Link>
      <div className="page-heading detail-heading">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1>{request.reference}</h1>
            <Status status={request.status} />
          </div>
          <p className="page-description">
            Opened {fullDate(request.createdAt)}
            <span className="mx-2 text-slate-300">·</span>Version{" "}
            {request.version}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {cap.canEdit && (
            <button
              className="button secondary"
              disabled={busy || uncertain}
              onClick={() => open("edit")}
            >
              Edit details
            </button>
          )}
          {cap.canRemove && (
            <button
              className="button quiet-danger"
              disabled={busy || uncertain}
              onClick={() => open("remove")}
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="progress-strip" role="group" aria-label="Request progress">
        {(request.status === "REJECTED"
          ? (["OPEN", "IN_REVIEW", "REJECTED"] as const)
          : (["OPEN", "IN_REVIEW", "APPROVED", "COMPLETED"] as const)
        ).map((step, index, steps) => {
          const current = [...steps].map(String).indexOf(request.status);
          return (
            <div key={step}
              className={"progress-step " + (index < current ? "progress-step-done " : "") + (index === current ? "progress-step-active" : "")}
              aria-current={index === current ? "step" : undefined}>
              <span className="progress-number" aria-hidden="true">{index < current ? "✓" : index + 1}</span>
              <span>{step === "IN_REVIEW" ? "In review" : step === "OPEN" ? "Open" : step === "APPROVED" ? "Approved" : step === "REJECTED" ? "Rejected" : "Completed"}</span>
            </div>
          );
        })}
      </div>
      {notice && (
        <div role="status" className="success-box">
          ✓ {notice}
        </div>
      )}
      <ErrorBox error={readError}>
        <button className="text-button mt-2" onClick={() => void load()}>
          Refresh request
        </button>
      </ErrorBox>
      {uncertain && (
        <div className="warning-box">
          <p className="font-semibold">A response was interrupted.</p>
          <p className="mt-1 text-sm">
            The action may have been saved. Review the current record and notes
            before submitting again. Your draft is preserved.
          </p>
          <button
            className="button secondary mt-3"
            onClick={async () => {
              if (await load()) {
                setUncertain(false);
                setNotice(
                  "Current record refreshed. Check it before trying another action.",
                );
              }
            }}
          >
            Refresh and review current record
          </button>
        </div>
      )}
      <div className="workspace-grid">
        <div className="space-y-6">
          <section
            className="surface detail-surface"
            aria-labelledby="item-title"
          >
            <div className="section-topline">
              <span className="eyebrow">THE REQUEST</span>
              <span className="quantity-tag">Qty {request.quantity}</span>
            </div>
            <h2
              id="item-title"
              className="mt-4 text-2xl font-semibold tracking-tight"
            >
              {request.itemName}
            </h2>
            <p className="mt-2 break-words font-mono text-xs text-slate-500">
              {request.itemIdentifier}
            </p>
            <dl className="detail-grid mt-7">
              <div>
                <dt>Order reference</dt>
                <dd>{request.orderReference}</dd>
              </div>
              <div>
                <dt>Return reason</dt>
                <dd>{reasonLabels[request.reason]}</dd>
              </div>
            </dl>
          </section>
          <section
            className="surface detail-surface"
            aria-labelledby="customer-title"
          >
            <p className="eyebrow">THE CUSTOMER</p>
            <h2 id="customer-title" className="mt-3 text-xl font-semibold">
              {request.customerName}
            </h2>
            <dl className="detail-grid mt-5">
              <div>
                <dt>Email address</dt>
                <dd>
                  {request.customerEmail ? (
                    <a
                      href={`mailto:${request.customerEmail}`}
                      className="text-link"
                    >
                      {request.customerEmail}
                    </a>
                  ) : (
                    <span className="text-slate-400">Not provided</span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Phone number</dt>
                <dd>
                  {request.customerPhone ? (
                    <a
                      href={`tel:${request.customerPhone}`}
                      className="text-link"
                    >
                      {request.customerPhone}
                    </a>
                  ) : (
                    <span className="text-slate-400">Not provided</span>
                  )}
                </dd>
              </div>
            </dl>
            {!cap.canEdit && (
              <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">
                These details are locked after a decision. Notes can still be
                added below.
              </p>
            )}
          </section>
        </div>
        <aside className="space-y-5">
          <section className="decision-panel" aria-labelledby="next-title">
            <p className="eyebrow">THE NEXT STEP</p>
            <h2
              id="next-title"
              className="mt-3 text-2xl font-semibold tracking-tight"
            >
              {request.status === "OPEN"
                ? "Review this return"
                : request.status === "IN_REVIEW"
                  ? "Choose a resolution"
                  : request.status === "APPROVED"
                    ? "Finish the return"
                    : "Decision recorded"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {request.status === "OPEN"
                ? "Check the order and the customer’s concern, then move this request into review."
                : request.status === "IN_REVIEW"
                  ? "Agree on a resolution with the customer. Approval or rejection will lock the request details."
                  : request.status === "APPROVED"
                    ? "Once the agreed resolution has been handled outside ReturnDesk, mark the request as completed."
                    : request.status === "REJECTED"
                      ? "This request was rejected. Keep any follow-up context in the notes."
                      : "This return has reached the end of its journey. Notes remain open for follow-up."}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {cap.allowedTransitions.includes("IN_REVIEW") && (
                <button
                  className="button primary"
                  disabled={busy || uncertain}
                  onClick={() => open("review")}
                >
                  Start review <span aria-hidden="true">→</span>
                </button>
              )}
              {cap.allowedTransitions.includes("APPROVED") && (
                <button
                  className="button primary"
                  disabled={busy || uncertain}
                  onClick={() => open("approve")}
                >
                  Approve request <span aria-hidden="true">→</span>
                </button>
              )}
              {cap.allowedTransitions.includes("REJECTED") && (
                <button
                  className="button secondary"
                  disabled={busy || uncertain}
                  onClick={() => open("reject")}
                >
                  Reject request
                </button>
              )}
              {cap.allowedTransitions.includes("COMPLETED") && (
                <button
                  className="button primary"
                  disabled={busy || uncertain}
                  onClick={() => open("complete")}
                >
                  Mark completed <span aria-hidden="true">✓</span>
                </button>
              )}
            </div>
          </section>
          {request.resolution && (
            <section className="surface detail-surface">
              <p className="eyebrow">AGREED RESOLUTION</p>
              <h2 className="mt-3 text-xl font-semibold">
                {resolutionLabels[request.resolution]}
              </h2>
              {request.refundAmount && (
                <p className="mt-2 text-3xl font-semibold text-teal-800">
                  {money(request.refundAmount)}
                </p>
              )}
              <p className="mt-4 text-xs leading-6 text-slate-500">
                This records the agreed resolution; it does not transfer money
                or dispatch a replacement.
              </p>
            </section>
          )}
          <div className="px-1 text-xs leading-6 text-slate-400">
            Last updated {fullDate(request.updatedAt)}
          </div>
        </aside>
        <section
          className="surface detail-surface detail-notes"
          aria-labelledby="notes-title"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 id="notes-title" className="text-lg font-semibold">
              Notes & context
            </h2>
            <span className="count-badge">{request.notes.length}</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            A lasting record of the conversation. Notes can’t be edited or
            removed.
          </p>
          <div className="notes-list">
            {request.notes.length ? (
              request.notes.map((n) => (
                <article className="note" key={n.id}>
                  <div className="note-dot" aria-hidden="true" />
                  <time dateTime={n.createdAt}>{fullDate(n.createdAt)}</time>
                  <p>{n.body}</p>
                </article>
              ))
            ) : (
              <p className="my-7 text-sm text-slate-400">
                No notes yet. Add the context that helps the next person.
              </p>
            )}
          </div>
          {cap.canAddNote && (
            <form onSubmit={addNote} className="note-form">
              <label className="field-label" htmlFor="note-body">
                Add a note
              </label>
              <textarea
                id="note-body"
                className="input min-h-28 resize-y"
                maxLength={4000}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What should the next person know?"
                disabled={noteBusy || uncertain}
              />
              <FieldError errors={noteError?.fieldErrors || {}} name="body" />
              <ErrorBox error={noteError} />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {note.length} / 4,000
                </span>
                <button
                  className="button secondary"
                  disabled={noteBusy || uncertain || !note.trim()}
                >
                  {noteBusy ? "Adding note…" : "Add note"}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
      <dialog
        ref={dialog}
        className={`action-dialog ${action === "edit" ? "wide-dialog" : ""}`}
        onCancel={(e) => {
          if (busy) e.preventDefault();
          else close();
        }}
        onClose={() => {
          if (!busy) {
            setAction(null);
            lastTrigger.current?.focus();
          }
        }}
      >
        <form onSubmit={submitAction} noValidate>
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">{request.reference}</p>
              <h2>{action ? actionTitles[action] : "Request action"}</h2>
            </div>
            <button
              type="button"
              className="icon-button"
              aria-label="Close dialog"
              disabled={busy}
              onClick={close}
            >
              ×
            </button>
          </div>
          <div className="dialog-body">
            {action && !currentActionLegal && (
              <p className="warning-box">
                The current request no longer permits this action. Your draft is
                preserved; close this dialog to review the latest state.
              </p>
            )}
            <ErrorBox error={actionError}>
              {(actionError?.uncertain ||
                actionError?.code === "STALE_REQUEST") &&
                sync}
            </ErrorBox>
            {action === "edit" && draft && (
              <>
                <p className="mb-6 text-sm leading-6 text-slate-500">
                  Update the details while this request is Open or In review.
                </p>
                <RequestFields
                  draft={draft}
                  onChange={setDraft}
                  errors={actionError?.fieldErrors || {}}
                  disabled={busy || uncertain || !currentActionLegal}
                />
              </>
            )}
            {action === "approve" && (
              <>
                <p className="mb-6 text-sm leading-7 text-slate-600">
                  Choose the agreed resolution. Approving locks the customer and
                  item details.
                </p>
                <label className="field-label" htmlFor="resolution">
                  Resolution
                </label>
                <select
                  id="resolution"
                  className="input"
                  value={resolution}
                  disabled={busy || uncertain}
                  onChange={(e) => {
                    setResolution(e.target.value as Resolution);
                    setRefundAmount("");
                  }}
                >
                  {RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>
                      {resolutionLabels[r]}
                    </option>
                  ))}
                </select>
                <FieldError
                  errors={actionError?.fieldErrors || {}}
                  name="resolution"
                />
                {resolution === "REFUND" && (
                  <div className="mt-5">
                    <label className="field-label" htmlFor="refundAmount">
                      Refund amount (INR)
                    </label>
                    <input
                      id="refundAmount"
                      className="input"
                      inputMode="decimal"
                      value={refundAmount}
                      disabled={busy || uncertain}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="0.00"
                    />
                    <FieldError
                      errors={actionError?.fieldErrors || {}}
                      name="refundAmount"
                    />
                    <p className="field-hint">
                      Enter a positive amount, with up to two decimal places.
                    </p>
                  </div>
                )}
                <p className="info-callout mt-5">
                  This records the agreed resolution; it does not transfer
                  money.
                </p>
              </>
            )}
            {action === "remove" && (
              <>
                <p className="text-sm leading-7 text-slate-600">
                  This request will be hidden from the desk. Its record and
                  notes are retained.
                </p>
                {request.status === "OPEN" && (
                  <p className="warning-box mt-5">
                    Removing an Open request does not free this order and item
                    for a new request. It remains a live request under the
                    lifecycle rules.
                  </p>
                )}
                <p className="mt-4 text-sm font-medium">
                  This action cannot be undone in ReturnDesk.
                </p>
              </>
            )}
            {action === "review" && (
              <p className="text-sm leading-7 text-slate-600">
                Move the request into review. Details remain editable while you
                check the customer’s concern.
              </p>
            )}
            {action === "reject" && (
              <p className="text-sm leading-7 text-slate-600">
                This records a final rejection and locks the request details.
                You can continue to add notes.
              </p>
            )}
            {action === "complete" && (
              <p className="text-sm leading-7 text-slate-600">
                Confirm that the agreed resolution has been handled. The
                recorded resolution will be kept, and this status is final.
              </p>
            )}
          </div>
          <div className="dialog-footer">
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={close}
            >
              Cancel
            </button>
            <button
              className={`button ${action === "remove" || action === "reject" ? "danger" : "primary"}`}
              disabled={
                busy ||
                uncertain ||
                actionVersion !== request.version ||
                !currentActionLegal
              }
            >
              {busy
                ? "Saving…"
                : action === "edit"
                  ? "Save details"
                  : action === "approve"
                    ? "Confirm approval"
                    : action === "remove"
                      ? "Remove request"
                      : action === "reject"
                        ? "Confirm rejection"
                        : action === "complete"
                          ? "Mark completed"
                          : "Start review"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
