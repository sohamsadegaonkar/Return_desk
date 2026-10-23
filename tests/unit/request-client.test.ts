import { afterEach, describe, expect, it, vi } from "vitest";
import { patchRequestSchema } from "../../src/domain/requests/schemas";
import { draftFrom, draftPayload } from "../../src/lib/request-draft";
import { api, ApiError } from "../../src/lib/api";

afterEach(() => vi.unstubAllGlobals());

describe("UI write-boundary regressions", () => {
  it("full server DTO becomes only editable PATCH fields", () => {
    const dto = {id: "readonly", reference: "RD-001001", referenceNumber: "1001", status: "OPEN", version: 3,
      createdAt: "2026-10-22T00:00:00Z", capabilities: {canEdit: true}, notes: [{body: "context"}],
      customerName: "Asha", customerEmail: "asha@example.com", customerPhone: null,
      orderReference: "ORD-1", itemIdentifier: "SKU-1", itemName: "Cushion", quantity: 2, reason: "DAMAGED" as const};
    const draft = draftFrom(dto);
    draft.customerName = "Asha updated";
    const payload = draftPayload(draft);
    expect(Object.keys(payload).sort()).toEqual(["customerName", "customerEmail", "customerPhone", "orderReference", "itemIdentifier", "itemName", "quantity", "reason"].sort());
    expect(payload).toEqual({customerName: "Asha updated", customerEmail: "asha@example.com", customerPhone: null,
      orderReference: "ORD-1", itemIdentifier: "SKU-1", itemName: "Cushion", quantity: 2, reason: "DAMAGED"});
    expect(patchRequestSchema.safeParse({...payload, expectedVersion: dto.version}).success).toBe(true);
  });
  it.each([500, 502, 503, 408])("mutation HTTP%s means uncertain outcome without an automatic retry", async status => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({error: {code: "INTERNAL_ERROR", message: "Interrupted", fieldErrors: {}}}), {status, headers: {"Content-Type": "application/json"}}));
    vi.stubGlobal("fetch", fetcher);
    await expect(api("/api/requests/id/notes", {method: "POST", body: JSON.stringify({body: "context"})})).rejects.toMatchObject({uncertain: true});
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("a definitive validation refusal allows correction rather than claiming uncertainty", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({error: {code: "VALIDATION_ERROR", message: "Invalid amount", fieldErrors: {refundAmount: ["Use two decimal places"]}}}), {status: 422})));
    await expect(api("/api/requests/id/transitions", {method: "POST", body: "{}"})).rejects.toMatchObject({uncertain: false, code: "VALIDATION_ERROR", fieldErrors: {refundAmount: ["Use two decimal places"]}});
  });
  it("a failed read does not claim a mutation was committed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({error: {code: "INTERNAL_ERROR", message: "Read failed"}}), {status: 500})));
    await expect(api("/api/requests/id")).rejects.toBeInstanceOf(ApiError);
    await expect(api("/api/requests/id")).rejects.toMatchObject({uncertain: false});
  });
});
