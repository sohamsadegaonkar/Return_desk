import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";

type Status = "OPEN" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
type Case = { id: string; reference: string; referenceNumber: string; status: Status; version: number; resolution: string | null; refundAmount: string | null; customerEmail: string | null; customerPhone: string | null; customerName: string; orderReference: string; itemIdentifier: string; quantity: number; notes: {id: string; body: string}[] };
type Envelope = { data: Case; error?: {code: string; fieldErrors: Record<string, string[]>} };
const marker = `QA-${randomUUID()}`;
let pool: Pool;
let base: string;

// This suite writes only uniquely named synthetic fixtures; it never truncates or deletes.
// The app under test must be started with DATABASE_URL=$TEST_DATABASE_URL.
beforeAll(async () => {
  if (process.env.ALLOW_TEST_WRITES !== "1" || !process.env.TEST_DATABASE_URL || !process.env.TEST_BASE_URL) {
    throw new Error("Integration refused: require ALLOW_TEST_WRITES=1, isolated TEST_DATABASE_URL and TEST_BASE_URL.");
  }
  const testUrl = new URL(process.env.TEST_DATABASE_URL);
  if (!["postgres:", "postgresql:"].includes(testUrl.protocol) || !/test/i.test(testUrl.pathname)) {
    throw new Error("Integration refused: PostgreSQL database name must identify a test database.");
  }
  const identity = (value: string) => { const url = new URL(value); return `${url.hostname}:${url.port || "5432"}${url.pathname}`; };
  for (const protectedUrl of [process.env.DEMO_DATABASE_URL, process.env.PRODUCTION_DATABASE_URL]) {
    if (protectedUrl && identity(protectedUrl) === identity(testUrl.href)) throw new Error("Integration refused: protected database matches test database.");
  }
  const api = new URL(process.env.TEST_BASE_URL);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(api.hostname)) throw new Error("Integration refused: API server must be local and connected to the isolated test database.");
  base = api.origin;
  pool = new Pool({ connectionString: testUrl.href, max: 4 });
  const db = await pool.query<{name: string}>("select current_database() as name");
  if (!/test/i.test(db.rows[0].name)) throw new Error("Integration refused: connected database is not marked test.");
  const probe = await pool.query<{id: string}>(`insert into return_requests
    (customer_name, customer_email, order_reference, item_identifier, item_name, quantity, reason)
    values ($1,'qa@example.com',$2,'QA-CONNECTION-PROBE','QA connection probe',1,'DAMAGED') returning id`,
    [marker, `PROBE-${randomUUID()}`]);
  const fetched = await call(`/${probe.rows[0].id}`);
  if (fetched.status !== 200 || fetched.json?.data.customerName !== marker) throw new Error("Integration refused: API is not connected to the selected test database.");
});
afterAll(async () => { await pool?.end(); });

async function call(path = "", method = "GET", body?: unknown) {
  const response = await fetch(`${base}/api/requests${path}`, {
    method, headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  return { status: response.status, text, json: text ? JSON.parse(text) as Envelope : undefined };
}
function details(extra: Record<string, unknown> = {}) {
  const token = randomUUID();
  return { customerName: `${marker} ${token}`, customerEmail: "qa@example.com", customerPhone: null,
    orderReference: `QA-${token}`, itemIdentifier: "SKU-QA", itemName: "QA cushion", quantity: 1, reason: "DAMAGED", ...extra };
}
async function create(extra: Record<string, unknown> = {}): Promise<Case> {
  const result = await call("", "POST", details(extra));
  expect(result.status).toBe(201);
  return result.json!.data;
}
async function transition(row: Case, toStatus: Status, extra = {}): Promise<Case> {
  const result = await call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus, ...extra});
  expect(result.status).toBe(200);
  return result.json!.data;
}
async function atStatus(status: Status) {
  let row = await create();
  if (status === "OPEN") return row;
  row = await transition(row, "IN_REVIEW");
  if (status === "IN_REVIEW") return row;
  if (status === "REJECTED") return transition(row, "REJECTED");
  row = await transition(row, "APPROVED", {resolution: "REFUND", refundAmount: "1499.50"});
  return status === "COMPLETED" ? transition(row, "COMPLETED") : row;
}
function refused(result: Awaited<ReturnType<typeof call>>, status: number, code: string) {
  expect(result.status).toBe(status);
  expect(result.json?.error?.code).toBe(code);
  expect(result.json?.error?.fieldErrors).toBeTypeOf("object");
}

const statuses: Status[] = ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"];
const legal = new Set(["OPEN:IN_REVIEW", "IN_REVIEW:APPROVED", "IN_REVIEW:REJECTED", "APPROVED:COMPLETED"]);
describe("RULE-01 HTTP lifecycle: independent 25-pair table", () => {
  for (const from of statuses) for (const toStatus of statuses) {
    it(`${from} → ${toStatus}`, async () => {
      const row = await atStatus(from);
      const result = await call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus,
        ...(toStatus === "APPROVED" ? {resolution: "REFUND", refundAmount: "10.00"} : {})});
      if (legal.has(`${from}:${toStatus}`)) {
        expect(result.status).toBe(200);
        expect(result.json!.data.status).toBe(toStatus);
        expect(result.json!.data.version).toBe(row.version + 1);
        if (toStatus === "COMPLETED") expect(result.json!.data.refundAmount).toBe("1499.50");
      } else refused(result, 409, "INVALID_TRANSITION");
    });
  }
});

describe("RULE-02 HTTP approval precision and semantics", () => {
  it.each([undefined, null, "0", "-1", "1.001", "1e2", "10000000000.00", 12.5])("refuses refund %j", async (refundAmount) => {
    const row = await atStatus("IN_REVIEW");
    refused(await call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus: "APPROVED", resolution: "REFUND", refundAmount}), 422, "VALIDATION_ERROR");
    expect((await call(`/${row.id}`)).json!.data.version).toBe(row.version);
  });
  it("requires resolution and keeps non-refund amount null", async () => {
    let row = await atStatus("IN_REVIEW");
    refused(await call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus: "APPROVED"}), 422, "VALIDATION_ERROR");
    refused(await call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus: "APPROVED", resolution: "STORE_CREDIT", refundAmount: "5.00"}), 422, "VALIDATION_ERROR");
    row = await transition(row, "APPROVED", {resolution: "REPLACEMENT"});
    expect(row.refundAmount).toBeNull();
    row = await transition(row, "COMPLETED");
    expect(row.resolution).toBe("REPLACEMENT");
  });
});

describe("RULE-03 live-item uniqueness under writes", () => {
  it("parallel normalized creates yield exactly one201 and one409", async () => {
    const input = details();
    const results = await Promise.all([call("", "POST", input), call("", "POST", {...input, orderReference: ` ${input.orderReference.toLowerCase()} `, itemIdentifier: " sku-qa "})]);
    expect(results.map(x => x.status).sort()).toEqual([201, 409]);
    refused(results.find(x => x.status === 409)!, 409, "LIVE_REQUEST_EXISTS");
  });
  it("duplicate details edit fails; terminal history permits a new live request", async () => {
    const first = await create(); const second = await create();
    refused(await call(`/${second.id}`, "PATCH", {expectedVersion: second.version, orderReference: first.orderReference, itemIdentifier: first.itemIdentifier}), 409, "LIVE_REQUEST_EXISTS");
    let ended = await transition(first, "IN_REVIEW"); ended = await transition(ended, "REJECTED");
    const next = await create({orderReference: ended.orderReference, itemIdentifier: ended.itemIdentifier});
    expect(next.id).not.toBe(ended.id);
  });
  it("removed OPEN continues blocking a new live request", async () => {
    const row = await create();
    expect((await call(`/${row.id}`, "DELETE", {expectedVersion: row.version})).status).toBe(204);
    refused(await call("", "POST", details({orderReference: row.orderReference, itemIdentifier: row.itemIdentifier})), 409, "LIVE_REQUEST_EXISTS");
  });
});

describe("RULE-04 edits, notes and concurrent versions", () => {
  it.each(["APPROVED", "REJECTED", "COMPLETED"] as Status[])("%s locks details but accepts notes without version bump", async (status) => {
    const row = await atStatus(status);
    refused(await call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerName: "Changed"}), 409, "DETAILS_LOCKED");
    expect((await call(`/${row.id}/notes`, "POST", {body: "QA terminal note"})).status).toBe(201);
    expect((await call(`/${row.id}`)).json!.data.version).toBe(row.version);
  });
  it("checks stale version before edit eligibility and preserves omitted contact", async () => {
    const first = await atStatus("APPROVED");
    refused(await call(`/${first.id}`, "PATCH", {expectedVersion: first.version - 1, customerName: "Changed"}), 409, "STALE_REQUEST");
    let row = await create();
    const result = await call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerName: "New name"});
    expect(result.status).toBe(200); row = result.json!.data;
    expect(row.customerEmail).toBe("qa@example.com");
    refused(await call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerEmail: null}), 422, "VALIDATION_ERROR");
    expect((await call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerEmail: null, customerPhone: "+91 9876543210"})).status).toBe(200);
  });
  it("parallel same-version edits cannot overwrite each other", async () => {
    const row = await create();
    const results = await Promise.all(["Agent A", "Agent B"].map(customerName => call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerName})));
    expect(results.map(x => x.status).sort()).toEqual([200, 409]);
    refused(results.find(x => x.status === 409)!, 409, "STALE_REQUEST");
  });
  it("concurrent approve/edit serializes the decision against details", async () => {
    const row = await atStatus("IN_REVIEW");
    const results = await Promise.all([
      call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerName: "Racing editor"}),
      call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus: "APPROVED", resolution: "STORE_CREDIT"}),
    ]);
    expect(results.map(x => x.status).sort()).toEqual([200, 409]);
    refused(results.find(x => x.status === 409)!, 409, "STALE_REQUEST");
    expect((await call(`/${row.id}`)).json!.data.version).toBe(row.version + 1);
  });
  it("concurrent remove/note never appends after parent removal", async () => {
    const row = await create();
    const [removed, note] = await Promise.all([
      call(`/${row.id}`, "DELETE", {expectedVersion: row.version}),
      call(`/${row.id}/notes`, "POST", {body: "Racing note"}),
    ]);
    expect(removed.status).toBe(204);
    expect([201, 404]).toContain(note.status);
    const saved = await pool.query("select count(*)::int as count from request_notes where request_id=$1", [row.id]);
    expect(saved.rows[0].count).toBe(note.status === 201 ? 1 : 0);
    refused(await call(`/${row.id}/notes`, "POST", {body: "After removal"}), 404, "REQUEST_NOT_FOUND");
  });
  it("same-timestamp notes sort by numeric identity across digit boundary", async () => {
    const row = await create();
    const maximum = (await pool.query<{maximum: string}>("select coalesce(max(id),0)::text as maximum from request_notes")).rows[0].maximum;
    const boundary = 10n ** BigInt(maximum.length + 1);
    if (boundary > 9223372036854775807n) throw new Error("Test note identity range exhausted; use a fresh isolated database.");
    const stamp = new Date("2026-10-22T00:00:00Z");
    const ids = Array.from({length: 12}, (_, i) => boundary - 6n + BigInt(i));
    for (const [i, id] of ids.entries()) await pool.query("insert into request_notes (id,request_id,body,created_at) overriding system value values ($1,$2,$3,$4)", [id.toString(), row.id, `Tied note ${i}`, stamp]);
    const got = (await call(`/${row.id}`)).json!.data;
    expect(got.notes.map(n => n.id)).toEqual(ids.map(String));
    expect(got.notes.map(n => n.body)).toEqual(ids.map((_, i) => `Tied note ${i}`));
  });
  it("notes are ordered, retained and refused direct UPDATE/DELETE", async () => {
    const row = await create();
    const first = await call(`/${row.id}/notes`, "POST", {body: " First "});
    const second = await call(`/${row.id}/notes`, "POST", {body: "Second"});
    expect(first.status).toBe(201); expect(second.status).toBe(201);
    const got = (await call(`/${row.id}`)).json!.data;
    expect(got.notes.map(n => n.body)).toEqual(["First", "Second"]);
    expect(got.notes.every(n => typeof n.id === "string")).toBe(true);
    for (const sql of ["UPDATE request_notes SET body='mutated' WHERE request_id=$1", "DELETE FROM request_notes WHERE request_id=$1"]) {
      await expect(pool.query(sql, [row.id])).rejects.toThrow(/append-only/i);
    }
    expect((await call(`/${row.id}`)).json!.data.notes.map(n => n.body)).toEqual(["First", "Second"]);
  });
});

describe("RULE-05 soft removal and boundary refusals", () => {
  it.each(statuses)("%s removal eligibility", async status => {
    const row = await atStatus(status);
    const result = await call(`/${row.id}`, "DELETE", {expectedVersion: row.version});
    if (status === "OPEN" || status === "REJECTED") {
      expect(result.status).toBe(204); expect(result.text).toBe("");
      for (const action of [call(`/${row.id}`), call(`/${row.id}`, "PATCH", {expectedVersion: row.version, customerName: "New"}), call(`/${row.id}/notes`, "POST", {body: "Hidden"}), call(`/${row.id}/transitions`, "POST", {expectedVersion: row.version, toStatus: "IN_REVIEW"}), call(`/${row.id}`, "DELETE", {expectedVersion: row.version})]) refused(await action, 404, "REQUEST_NOT_FOUND");
      expect((await pool.query("select removed_at from return_requests where id=$1", [row.id])).rows[0].removed_at).toBeTruthy();
    } else refused(result, 409, "REMOVAL_NOT_ALLOWED");
  });
  it("rejects unknown and repeated query keys without prototype ambiguity", async () => {
    refused(await call("?__proto__=unexpected"), 422, "VALIDATION_ERROR");
    refused(await call("?page=1&page=2"), 400, "BAD_REQUEST");
    refused(await call("?sort=createdAt%3BDROP%20TABLE%20return_requests"), 422, "VALIDATION_ERROR");
  });
  it("rejects malformed UUID, missing UUID, bad JSON and unknown fields", async () => {
    refused(await call("/not-a-uuid"), 400, "BAD_REQUEST");
    refused(await call(`/${randomUUID()}`), 404, "REQUEST_NOT_FOUND");
    const response = await fetch(`${base}/api/requests`, {method: "POST", headers: {"Content-Type": "application/json"}, body: "{"});
    expect(response.status).toBe(400);
    refused(await call("", "POST", details({status: "OPEN"})), 422, "VALIDATION_ERROR");
    const row = await create();
    refused(await call(`/${row.id}`, "PATCH", {expectedVersion: row.version}), 422, "VALIDATION_ERROR");
  });
});

describe("LIST-01 combined server filters and literal search", () => {
  it("combines filters, totals and deterministic pages", async () => {
    const token = `${marker}-list`;
    for (let i = 0; i < 3; i++) await create({customerName: `${token}-${i}`, reason: "SIZE_ISSUE"});
    await create({customerName: token, reason: "DAMAGED"});
    const query = `?q=${encodeURIComponent(token)}&status=OPEN&reason=SIZE_ISSUE&sort=reference&direction=asc&pageSize=2`;
    const first = await call(query); const second = await call(`${query}&page=2`);
    expect(first.status).toBe(200);
    const a = first.json as unknown as {data: Case[]; pagination: {total: number; totalPages: number}};
    const b = second.json as unknown as typeof a;
    expect(a.data).toHaveLength(2); expect(b.data).toHaveLength(1);
    expect(a.pagination.total).toBe(3); expect(a.pagination.totalPages).toBe(2);
    expect(new Set([...a.data, ...b.data].map(r => r.id)).size).toBe(3);
    expect([...a.data, ...b.data].every(r => r.status === "OPEN")).toBe(true);
  });
  it.each(["%", "_", "\\"])("searches literal %s without SQL wildcard expansion", async char => {
    const token = `${marker}${char}literal`;
    const row = await create({customerName: token});
    await create({customerName: `${marker}Xliteral`});
    const result = await call(`?q=${encodeURIComponent(token)}`);
    const found = result.json as unknown as {data: Case[]; pagination: {total: number}};
    expect(found.pagination.total).toBe(1); expect(found.data[0].id).toBe(row.id);
  });
});
