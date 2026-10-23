"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RequestDTO } from "@/server/requests/dto";
import { createRequestSchema } from "@/domain/requests/schemas";
import { api, ApiError, asError } from "@/lib/api";
import { ErrorBox } from "./ui";
import { blankDraft, draftPayload, RequestFields } from "./request-fields";
export function NewRequest() {
  const [draft, setDraft] = useState(blankDraft);
  const [error, setError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const router = useRouter();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || uncertain) return;
    const parsed = createRequestSchema.safeParse(draftPayload(draft));
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0] || "form");
        (fields[key] ||= []).push(i.message);
      });
      setError(
        new ApiError(
          "Please check the highlighted details.",
          "VALIDATION_ERROR",
          fields,
        ),
      );
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await api<{ data: RequestDTO }>("/api/requests", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      router.push(`/requests/${result.data.id}`);
    } catch (e) {
      const err = asError(e);
      setError(err);
      setUncertain(err.uncertain);
      setBusy(false);
    }
  }
  return (
    <>
      <Link href="/" className="back-link">
        ← Back to queue
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RETURNS / NEW REQUEST</p>
          <h1>New return request</h1>
          <p className="page-description">
            Enter customer and item details. Review your information before you create the request.
          </p>
        </div>
        <span className="status status-open">
          <span className="status-dot" />
          Starts as Open
        </span>
      </div>
      <div className="form-layout">
        <form className="surface form-surface" onSubmit={submit} noValidate>
          <ErrorBox error={error}>
            {uncertain && (
              <div className="mt-3 space-y-3 text-sm">
                <p>
                  Your draft is preserved. First check whether this order
                  already has a request.
                </p>
                <Link
                  href={`/?q=${encodeURIComponent(draft.orderReference)}`}
                  target="_blank"
                  className="text-button block"
                >
                  Check the queue in a new tab ↗
                </Link>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setUncertain(false);
                    setError(null);
                  }}
                >
                  I checked the queue; keep editing
                </button>
              </div>
            )}
          </ErrorBox>
          <RequestFields
            draft={draft}
            onChange={setDraft}
            errors={error?.fieldErrors || {}}
            disabled={busy || uncertain}
          />
          <div className="form-actions">
            <Link href="/" className="button secondary">
              Cancel
            </Link>
            <button
              type="submit"
              className="button primary"
              disabled={busy || uncertain}
            >
              {busy ? "Creating request…" : "Create request"}
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
        <aside className="helper-panel">
          <span className="helper-icon" aria-hidden="true">
            ↩
          </span>
          <h2>What happens next?</h2>
          <p>
            We’ll create a reference number automatically and open the request details once it is saved.
          </p>
          <div className="helper-divider" />
          <h3>One item, one live request</h3>
          <p>
            An order and item can have one Open, In review, or Approved request
            at a time.
          </p>
          <h3 className="mt-5">You can correct details during review</h3>
          <p>
            Once the request is approved or rejected, its details are locked. You can still add notes.
          </p>
        </aside>
      </div>
    </>
  );
}
