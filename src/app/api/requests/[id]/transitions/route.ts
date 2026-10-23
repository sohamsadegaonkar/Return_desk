import { requests } from "../../../../../server/requests/service";
import { handle, json, readJson, type RequestRouteContext } from "../../../../../server/requests/http";

export const runtime = "nodejs";
export async function POST(request: Request, context: RequestRouteContext) {
  return handle(async () => json({ data: await requests.transition((await context.params).id, await readJson(request)) }));
}
