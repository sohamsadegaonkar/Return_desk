import Link from "next/link";
import type { ReactNode } from "react";
import type { RequestStatus } from "@/domain/requests/types";
import { statusLabels } from "@/lib/display";
import { ApiError } from "@/lib/api";

type Section = "queue" | "new" | "detail";

function NavIcon({ kind }: { kind: "queue" | "new" }) {
  return (
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round">
      {kind === "queue" ? (
        <><rect x="3.5" y="4" width="17" height="16" rx="2.5" />
        <path d="M7.5 9h9M7.5 13h9M7.5 17h5" /></>
      ) : (
        <><rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M12 7.5v9M7.5 12h9" /></>
      )}
    </svg>
  );
}

export function Shell({ children, section = "queue" }: {
  children: ReactNode;
  section?: Section;
}) {
  const queueActive = section !== "new";
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="app-frame">
        <aside className="app-sidebar" aria-label="Workspace">
          <Link href="/" className="brand" aria-label="ReturnDesk home">
            <span aria-hidden="true" className="brand-symbol">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7H4v4" />
                <path d="M4.5 11a8 8 0 1 1 .8 5" />
                <path d="M9 12h8M14 9l3 3-3 3" />
              </svg>
            </span>
            <span className="brand-wordmark">Return<span>Desk</span><small>OPERATIONS</small></span>
          </Link>
          <p className="sidebar-caption">WORKSPACE</p>
          <nav className="workspace-nav" aria-label="Primary navigation">
            <Link href="/" className={"nav-item " + (queueActive ? "nav-item-active" : "")}
              aria-current={queueActive ? "page" : undefined}>
              <NavIcon kind="queue" /> All requests
            </Link>
            <Link href="/requests/new" className={"nav-item " + (section === "new" ? "nav-item-active" : "")}
              aria-current={section === "new" ? "page" : undefined}>
              <NavIcon kind="new" /> New request
            </Link>
          </nav>
          <div className="sidebar-bottom">
            <span className="sidebar-demo-indicator"><span className="live-dot" /> Demo environment</span>
            <p>For synthetic customer records only. No payments are processed here.</p>
          </div>
        </aside>
        <div className="app-content">
          <header className="app-header">
            <div className="header-inner">
              <div className="header-context">
                <span className="header-breadcrumb">OPERATIONS <span aria-hidden="true">/</span> RETURNS</span>
                <span className="header-title">
                  {section === "new" ? "Create request" : section === "detail" ? "Request details" : "Returns overview"}
                </span>
              </div>
              <span className="workspace-label"><span className="live-dot" /> Demo workspace</span>
            </div>
          </header>
          <main id="main" className="app-main">{children}</main>
          <footer className="app-footer">
            <span>ReturnDesk</span>
            <span>Customer support operations · Synthetic demo data</span>
          </footer>
        </div>
      </div>
    </>
  );
}

export function Status({ status }: { status: RequestStatus }) {
  return (
    <span className={"status status-" + status.toLowerCase()}>
      <span aria-hidden="true" className="status-dot" />
      {statusLabels[status]}
    </span>
  );
}
export function ErrorBox({ error, children }: { error: ApiError | null; children?: ReactNode }) {
  if (!error) return null;
  return (
    <div role="alert" className="error-box">
      <p className="font-semibold">
        {error.uncertain ? "We need to check what happened"
          : error.code === "STALE_REQUEST" ? "This request changed in another window"
          : "That action could not be completed"}
      </p>
      <p className="mt-1 text-sm">{error.message}</p>
      {children}
    </div>
  );
}
export function FieldError({ errors, name }: { errors: Record<string, string[]>; name: string }) {
  return errors[name]?.length ? (
    <p id={name + "-error"} className="field-error">{errors[name].join(" ")}</p>
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
