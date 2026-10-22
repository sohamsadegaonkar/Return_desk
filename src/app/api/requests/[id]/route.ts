import { requests } from "../../../../server/requests/service";
import { handle, json, readJson, type RequestRouteContext } from "../../../../server/requests/http";

export const runtime = "nodejs";
export async function GET(_request: Request, context: RequestRouteContext) {
  return handle(async () => json({ data: await requests.get((await context.params).id) }));
}
export async function PATCH(request: Request, context: RequestRouteContext) {
  return handle(async () => json({ data: await requests.patch((await context.params).id, await readJson(request)) }));
}
export async function DELETE(request: Request, context: RequestRouteContext) {
  return handle(async () => {
    await requests.remove((await context.params).id, await readJson(request));
    return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
  });
}
