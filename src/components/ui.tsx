import Link from "next/link";
import type { ReactNode } from "react";
import type { RequestStatus } from "@/domain/requests/types";
import { statusLabels } from "@/lib/display";
import { ApiError } from "@/lib/api";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <div className="header-inner">
          <Link href="/" className="brand">
            <span aria-hidden="true" className="brand-symbol">
              ↩
            </span>
            ReturnDesk
            <span className="brand-divider" />
            <span className="brand-subtitle">Customer care</span>
          </Link>
          <span className="workspace-label">
            <span aria-hidden="true" className="live-dot" />
            Returns workspace
          </span>
        </div>
      </header>
      <main id="main" className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        Thoughtful care. Clear resolutions.
      </footer>
    </>
  );
}
export function Status({ status }: { status: RequestStatus }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      <span aria-hidden="true" className="status-dot" />
      {statusLabels[status]}
    </span>
  );
}
export function ErrorBox({
  error,
  children,
}: {
  error: ApiError | null;
  children?: ReactNode;
}) {
  if (!error) return null;
  return (
    <div role="alert" className="error-box">
      <p className="font-semibold">
        {error.uncertain
          ? "We need to check what happened"
          : error.code === "STALE_REQUEST"
            ? "This request changed in another window"
            : "That action could not be completed"}
      </p>
      <p className="mt-1 text-sm">{error.message}</p>
      {children}
    </div>
  );
}
export function FieldError({
  errors,
  name,
}: {
  errors: Record<string, string[]>;
  name: string;
}) {
  return errors[name]?.length ? (
    <p id={`${name}-error`} className="field-error">
      {errors[name].join(" ")}
    </p>
  ) : null;
}
export function Loading({ label = "Loading workspace…" }: { label?: string }) {
  return (
    <div role="status" className="loading-panel">
      <span className="spinner" />
      {label}
    </div>
  );
}
