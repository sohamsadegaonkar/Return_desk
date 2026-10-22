import type { ZodError } from "zod";

export class RequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fieldErrors: Record<string, string[]> = {},
    public readonly details?: Record<string, unknown>,
  ) { super(message); }
}

export function validationError(error: ZodError): RequestError {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (fields[key] ??= []).push(issue.message);
  }
  return new RequestError(422, "VALIDATION_ERROR", "Check the highlighted fields and try again.", fields);
}

/** Inspect the named invariant only; unrelated uniqueness failures remain internal errors. */
export function databaseError(error: unknown): unknown {
  if (typeof error === "object" && error !== null && "code" in error && "constraint" in error
    && error.code === "23505" && error.constraint === "one_live_request_per_order_item") {
    return new RequestError(409, "LIVE_REQUEST_EXISTS", "This order and item already have an open, in-review, or approved request. A removed open request still reserves this item.", {
      itemIdentifier: ["A live request already exists for this order and item."],
    });
  }
  return error;
}
