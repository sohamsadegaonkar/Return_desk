"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { REQUEST_STATUSES, RETURN_REASONS } from "@/domain/requests/types";
import type { RequestDTO } from "@/server/requests/dto";
import { api, ApiError, asError } from "@/lib/api";
import { reasonLabels, shortDate, statusLabels } from "@/lib/display";
import { ErrorBox, Loading, Status } from "./ui";

/** Never forward unrelated page URLs (e.g. utm_source) to the strict list API. */
const REQUEST_LIST_QUERY_KEYS = [
  "q", "status", "reason", "sort", "direction", "page", "pageSize",
] as const;

export function Queue() {
  const params = useSearchParams();
  const apiQuery = new URLSearchParams();
  for (const key of REQUEST_LIST_QUERY_KEYS) {
    const value = params.get(key);
    if (value !== null) apiQuery.set(key, value);
  }
  return <QueueState query={apiQuery.toString()} />;
}
function QueueState({ query }: { query: string }) {
  const router = useRouter();
  const params = new URLSearchParams(query);
  const [searchState, setSearchState] = useState({
    query,
    value: params.get("q") || "",
  });
  if (searchState.query !== query)
    setSearchState({ query, value: params.get("q") || "" });
  const search = searchState.value;
  const setSearch = (value: string) => setSearchState({ query, value });
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [rows, setRows] = useState<RequestDTO[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [retry, setRetry] = useState(0);
  function change(values: Record<string, string>, reset = true) {
    const next = new URLSearchParams(query);
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    if (reset) {
      next.delete("page");
      if (search.trim()) next.set("q", search.trim());
      else next.delete("q");
    }
    router.replace(next.size ? `/?${next}` : "/", { scroll: false });
  }
  useEffect(() => {
    if (search === (new URLSearchParams(query).get("q") || "")) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(query);
      if (search.trim()) next.set("q", search.trim());
      else next.delete("q");
      next.delete("page");
      router.replace(next.size ? `/?${next}` : "/", { scroll: false });
    }, 350);
    return () => clearTimeout(timer);
  }, [search, query, router]);
  useEffect(() => {
    const controller = new AbortController();
    api<{ data: RequestDTO[]; pagination: typeof pagination }>(
      `/api/requests?${query}`,
      { signal: controller.signal },
    )
      .then((result) => {
        if (controller.signal.aborted) return;
        setLoadedQuery(query);
        setRows(result.data);
        setPagination(result.pagination);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setError(asError(error));
          setLoadedQuery(query);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [query, retry]);
  const pending = loading || loadedQuery !== query;
  const filtered = !!(
    params.get("q") ||
    params.get("status") ||
    params.get("reason")
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE RETURNS DESK</p>
          <h1>Every return, a clear next step.</h1>
          <p className="page-description">
            Keep the details close. Move each request forward with confidence.
          </p>
        </div>
        <Link href="/requests/new" className="button primary">
          <span aria-hidden="true">＋</span> New request
        </Link>
      </div>
      <section className="queue-panel" aria-labelledby="queue-title">
        <div className="panel-title">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="queue-title">Request queue</h2>
            {!pending && !error && (
              <span className="count-badge">{pagination.total}</span>
            )}
          </div>
          <span className="hidden text-xs text-slate-400 sm:block">
            A little care goes a long way
          </span>
        </div>
        <div className="queue-filters">
          <div className="search-wrap">
            <span aria-hidden="true">⌕</span>
            <label htmlFor="search" className="sr-only">
              Search requests
            </label>
            <input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, order or reference…"
              autoComplete="off"
              className="input search-input"
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="status-filter">
              Status
            </label>
            <select
              id="status-filter"
              className="input filter-input"
              value={params.get("status") || ""}
              onChange={(e) => change({ status: e.target.value })}
            >
              <option value="">All statuses</option>
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="reason-filter">
              Return reason
            </label>
            <select
              id="reason-filter"
              className="input filter-input"
              value={params.get("reason") || ""}
              onChange={(e) => change({ reason: e.target.value })}
            >
              <option value="">All reasons</option>
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {reasonLabels[r]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="sr-only" htmlFor="sort">
              Sort requests
            </label>
            <select
              id="sort"
              className="input filter-input"
              value={`${params.get("sort") || "createdAt"}:${params.get("direction") || "desc"}`}
              onChange={(e) => {
                const [sort, direction] = e.target.value.split(":");
                change({ sort, direction });
              }}
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="updatedAt:desc">Recently updated</option>
              <option value="reference:desc">Reference: highest</option>
              <option value="reference:asc">Reference: lowest</option>
              <option value="customerName:asc">Customer: A–Z</option>
              <option value="customerName:desc">Customer: Z–A</option>
            </select>
          </div>
        </div>
        {filtered && (
          <div className="filter-summary">
            <span>Showing matching requests</span>
            <button onClick={() => router.replace("/")} className="text-button">
              Clear filters
            </button>
          </div>
        )}
        <div className="px-5">
          <ErrorBox error={pending ? null : error}>
            <button
              className="text-button mt-3"
              onClick={() => {
                setLoading(true);
                setRetry((v) => v + 1);
              }}
            >
              Try loading again
            </button>
          </ErrorBox>
        </div>
        {pending ? (
          <Loading label="Finding your requests…" />
        ) : !error && rows.length === 0 ? (
          <div className="empty-panel">
            <span aria-hidden="true" className="empty-symbol">
              ↩
            </span>
            <h3>
              {filtered
                ? "No matching requests"
                : pagination.page > 1
                  ? "No requests on this page"
                  : "A fresh start for your returns desk"}
            </h3>
            <p>
              {filtered
                ? "Try a different search or clear the filters to see more."
                : "Create a request to keep its details and decisions in one place."}
            </p>
            {filtered || pagination.page > 1 ? (
              <button
                className="button secondary"
                onClick={() => router.replace("/")}
              >
                Show all requests
              </button>
            ) : (
              <Link href="/requests/new" className="button primary">
                Create your first request
              </Link>
            )}
          </div>
        ) : (
          !error && (
            <>
              <div className="hidden md:block">
                <table className="request-table">
                  <thead>
                    <tr>
                      <th scope="col">Request / customer</th>
                      <th scope="col">Order & item</th>
                      <th scope="col">Reason</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created</th>
                      <th scope="col">
                        <span className="sr-only">Open</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <Link
                            className="request-reference"
                            href={`/requests/${row.id}`}
                          >
                            {row.reference}
                          </Link>
                          <div className="mt-1 text-sm text-slate-500">
                            {row.customerName}
                          </div>
                        </td>
                        <td>
                          <div className="max-w-48 break-words font-medium">
                            {row.orderReference}
                          </div>
                          <div className="mt-1 max-w-48 break-words text-xs text-slate-500">
                            {row.itemName} · ×{row.quantity}
                          </div>
                        </td>
                        <td className="text-sm text-slate-600">
                          {reasonLabels[row.reason]}
                        </td>
                        <td>
                          <Status status={row.status} />
                        </td>
                        <td className="whitespace-nowrap text-xs text-slate-500">
                          {shortDate(row.createdAt)}
                        </td>
                        <td>
                          <Link
                            href={`/requests/${row.id}`}
                            className="row-link"
                            aria-label={`Open ${row.reference}`}
                          >
                            ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-cards md:hidden">
                {rows.map((row) => (
                  <Link
                    href={`/requests/${row.id}`}
                    key={row.id}
                    className="request-card"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="request-reference">{row.reference}</span>
                      <Status status={row.status} />
                    </div>
                    <h3 className="mt-4 font-semibold">{row.customerName}</h3>
                    <p className="mt-1 break-words text-sm text-slate-500">
                      {row.orderReference} · {row.itemName} ×{row.quantity}
                    </p>
                    <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <span>{reasonLabels[row.reason]}</span>
                      <time dateTime={row.createdAt}>
                        {shortDate(row.createdAt)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pagination">
                <p>
                  {pagination.total === 0
                    ? 0
                    : (pagination.page - 1) * pagination.pageSize + 1}
                  –
                  {Math.min(
                    pagination.page * pagination.pageSize,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} requests
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="page-button"
                    disabled={pagination.page <= 1}
                    onClick={() =>
                      change({ page: String(pagination.page - 1) }, false)
                    }
                    aria-label="Previous page"
                  >
                    ←
                  </button>
                  <span>
                    Page {pagination.page} of{" "}
                    {Math.max(1, pagination.totalPages)}
                  </span>
                  <button
                    className="page-button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() =>
                      change({ page: String(pagination.page + 1) }, false)
                    }
                    aria-label="Next page"
                  >
                    →
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </section>
      <p className="queue-footnote">
        A resolution records the agreement with your customer. Payments and
        fulfilment happen outside ReturnDesk.
      </p>
    </>
  );
}
