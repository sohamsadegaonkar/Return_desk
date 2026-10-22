export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public fieldErrors: Record<string, string[]> = {},
    public uncertain = false,
  ) {
    super(message);
  }
}

export async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      cache: "no-store",
      signal: init.signal
        ? AbortSignal.any([init.signal, AbortSignal.timeout(20000)])
        : AbortSignal.timeout(20000),
      headers: { "Content-Type": "application/json", ...init.headers },
    });
  } catch (error) {
    if (init.signal?.aborted) throw error;
    throw new ApiError(
      "The connection was interrupted. Check the current record before trying this action again.",
      "NETWORK_ERROR",
      {},
      init.method !== undefined && init.method !== "GET",
    );
  }
  if (response.status === 204) return undefined as T;
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      "The server response could not be read. Refresh the record to check what happened.",
      "UNREADABLE_RESPONSE",
      {},
      init.method !== undefined && init.method !== "GET",
    );
  }
  if (!response.ok)
    throw new ApiError(
      body?.error?.message || "The request could not be completed.",
      body?.error?.code || "REQUEST_FAILED",
      body?.error?.fieldErrors || {},
      init.method !== undefined &&
        init.method !== "GET" &&
        (response.status >= 500 || response.status === 408),
    );
  if (!body || typeof body !== "object" || !("data" in body)) {
    throw new ApiError(
      "The server response was incomplete. Refresh the record to check what happened.",
      "UNREADABLE_RESPONSE",
      {},
      init.method !== undefined && init.method !== "GET",
    );
  }
  return body as T;
}

export function asError(error: unknown): ApiError {
  return error instanceof ApiError
    ? error
    : new ApiError(
        "Something went wrong. Please refresh and try again.",
        "UNKNOWN",
      );
}
