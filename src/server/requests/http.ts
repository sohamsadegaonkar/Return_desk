import { RequestError } from "./errors";
import { listQuerySchema } from "../../domain/requests/schemas";

const headers = { "Cache-Control": "no-store" };
export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers });
}

export async function readJson(request: Request): Promise<unknown> {
  try { return await request.json(); }
  catch { throw new RequestError(400, "BAD_REQUEST", "Send a valid JSON request body."); }
}

/** Keep repeated query parameters explicit instead of silently taking the last value. */
export function queryInput(request: Request): Record<string, string> {
  const params = new URL(request.url).searchParams;
  const value: Record<string, string> = Object.create(null);
  for (const [key, item] of params) {
    if (Object.hasOwn(value, key)) throw new RequestError(400, "BAD_REQUEST", `Supply the ${key} query parameter once.`);
    if (!Object.hasOwn(listQuerySchema.shape, key)) throw new RequestError(422, "VALIDATION_ERROR",
      "Check the query parameters and try again.", { _form: [`Unrecognized query parameter: ${key}`] });
    value[key] = item;
  }
  return value;
}

export async function handle(work: () => Promise<Response>): Promise<Response> {
  try { return await work(); }
  catch (error) {
    if (error instanceof RequestError) return json({ error: {
      code: error.code, message: error.message, fieldErrors: error.fieldErrors,
      ...(error.details ? { details: error.details } : {}),
    } }, error.status);
    // Avoid logging SQL, payloads, connection strings or customer contact data.
    console.error("ReturnDesk request operation failed.");
    return json({ error: { code: "INTERNAL_ERROR", message: "The request could not be completed. Please try again after checking the latest state.", fieldErrors: {} } }, 500);
  }
}

export type RequestRouteContext = { params: Promise<{ id: string }> };
