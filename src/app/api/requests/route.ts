import { requests } from "../../../server/requests/service";
import { handle, json, queryInput, readJson } from "../../../server/requests/http";

export const runtime = "nodejs";
export async function GET(request: Request) {
  return handle(async () => json(await requests.list(queryInput(request))));
}
export async function POST(request: Request) {
  return handle(async () => json({ data: await requests.create(await readJson(request)) }, 201));
}
