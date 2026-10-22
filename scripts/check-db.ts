import "dotenv/config";
import assert from "node:assert/strict";
import { AssertionError } from "node:assert";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { createPool } from "../src/server/db/connection";

/** Nonpersistent checks intended only for a separate PostgreSQL 16 test database. */
function isolatedTestUrl(): string {
  const value = process.env.TEST_DATABASE_URL;
  if (!value) throw new Error("TEST_DATABASE_URL is required.");
  const test = new URL(value);
  if (!["postgres:", "postgresql:"].includes(test.protocol) || !/(?:^|[_-])test(?:[_-]|$)/i.test(decodeURIComponent(test.pathname.slice(1)))) {
    throw new Error("Use a separate PostgreSQL database whose name contains a test segment.");
  }
  if (process.env.NODE_ENV === "production") throw new Error("Database checks are disabled in production mode.");
  if (process.env.DATABASE_URL) {
    const app = new URL(process.env.DATABASE_URL);
    const identity = (url: URL) => `${url.hostname.toLowerCase()}:${url.port || "5432"}${decodeURIComponent(url.pathname)}`;
    if (identity(test) === identity(app)) throw new Error("Test database must differ from DATABASE_URL.");
  }
  return value;
}

type SqlFailure = { code?: string; constraint?: string };
let assertions = 0;
async function rejected(client: PoolClient, label: string, statement: string, values: unknown[], code: string, constraint?: string) {
  await client.query("SAVEPOINT expected_failure");
  let failure: unknown;
  try { await client.query(statement, values); } catch (error) { failure = error; }
  await client.query("ROLLBACK TO SAVEPOINT expected_failure");
  await client.query("RELEASE SAVEPOINT expected_failure");
  assert.ok(failure, `${label} unexpectedly succeeded`);
  assert.equal((failure as SqlFailure).code, code, `${label} returned an unexpected SQLSTATE`);
  if (constraint) assert.equal((failure as SqlFailure).constraint, constraint, `${label} returned an unexpected constraint`);
  assertions++;
}

async function main() {
  const pool = createPool(isolatedTestUrl());
  const client = await pool.connect().catch(async (error: unknown) => {
    await pool.end();
    throw error;
  });
  try {
    const version = await client.query<{ version: string }>("SELECT current_setting('server_version_num') AS version");
    assert.equal(Math.floor(Number(version.rows[0].version) / 10000), 16, "These acceptance checks target PostgreSQL 16");
    assertions++;
    await client.query("BEGIN");
    const prefix = `check-${randomUUID()}`;
    const insertSql = `INSERT INTO return_requests
      (customer_name, customer_email, order_reference, item_identifier, item_name, quantity, reason, status, resolution, refund_amount)
      VALUES ('Database check', 'db-check@example.test', $1, $2, 'Synthetic fixture', $3, 'DAMAGED', $4, $5, $6)
      RETURNING id, reference, reference_number, order_key, item_key`;
    const insert = (order: string, item: string, quantity = 1, status = "OPEN", resolution: string | null = null, amount: string | null = null) =>
      client.query(insertSql, [order, item, quantity, status, resolution, amount]);
    const first = (await insert(` ${prefix.toUpperCase()} `, " SKU-CHECK ")).rows[0];
    assert.equal(first.order_key, prefix);
    assert.equal(first.item_key, "sku-check");
    assert.match(first.reference, /^RD-\d{6,}$/);
    assertions += 3;
    await rejected(client, "normalized live duplicate", insertSql, [prefix, "sku-check", 1, "OPEN", null, null], "23505", "one_live_request_per_order_item");
    await client.query("UPDATE return_requests SET removed_at = now() WHERE id = $1", [first.id]);
    await rejected(client, "removed OPEN still blocks duplicate", insertSql, [prefix, "sku-check", 1, "OPEN", null, null], "23505", "one_live_request_per_order_item");
    await client.query("UPDATE return_requests SET status = 'REJECTED' WHERE id = $1", [first.id]);
    const followup = (await insert(prefix, "sku-check")).rows[0];
    assert.notEqual(followup.id, first.id);
    assertions++;
    const another = (await insert(`${prefix}-edit`, "other-item")).rows[0];
    await rejected(client, "duplicate edit", "UPDATE return_requests SET order_reference=$1, item_identifier=$2 WHERE id=$3", [prefix, "sku-check", another.id], "23505", "one_live_request_per_order_item");
    await rejected(client, "positive quantity", insertSql, [`${prefix}-quantity`, "item", 0, "OPEN", null, null], "23514", "chk_positive_quantity");
    await rejected(client, "contact required", "UPDATE return_requests SET customer_email=NULL, customer_phone=NULL WHERE id=$1", [another.id], "23514", "chk_customer_contact_present");
    await rejected(client, "approval resolution required", insertSql, [`${prefix}-no-resolution`, "item", 1, "APPROVED", null, null], "23514", "chk_resolution_by_status");
    await rejected(client, "refund amount required", insertSql, [`${prefix}-no-refund`, "item", 1, "APPROVED", "REFUND", null], "23514", "chk_refund_amount_by_resolution");
    await rejected(client, "refund positive", insertSql, [`${prefix}-zero-refund`, "item", 1, "APPROVED", "REFUND", "0.00"], "23514", "chk_refund_amount_by_resolution");
    await rejected(client, "nonrefund amount forbidden", insertSql, [`${prefix}-replacement`, "item", 1, "APPROVED", "REPLACEMENT", "1.00"], "23514", "chk_refund_amount_by_resolution");
    await rejected(client, "preapproval resolution forbidden", insertSql, [`${prefix}-premature`, "item", 1, "OPEN", "STORE_CREDIT", null], "23514", "chk_resolution_by_status");
    const refund = (await insert(`${prefix}-max-refund`, "item", 1, "APPROVED", "REFUND", "9999999999.99")).rows[0];
    const refundAmount = await client.query("SELECT refund_amount FROM return_requests WHERE id=$1", [refund.id]);
    assert.equal(refundAmount.rows[0].refund_amount, "9999999999.99");
    assertions++;
    for (const number of [1, 999999, 1000000]) {
      const result = await client.query(`INSERT INTO return_requests
        (reference_number, customer_name, customer_phone, order_reference, item_identifier, item_name, quantity, reason)
        VALUES ($1, 'Reference check', '123', $2, 'boundary-item', 'Fixture', 1, 'SIZE_ISSUE') RETURNING reference`, [number, `${prefix}-ref-${number}`]);
      assert.equal(result.rows[0].reference, `RD-${String(number).padStart(6, "0")}`);
      assertions++;
    }
    const note = await client.query("INSERT INTO request_notes(request_id,body) VALUES ($1,'Original note') RETURNING id", [followup.id]);
    assert.equal(typeof note.rows[0].id, "string");
    assertions++;
    await rejected(client, "note UPDATE blocked", "UPDATE request_notes SET body='Changed' WHERE id=$1", [note.rows[0].id], "P0001");
    await rejected(client, "note DELETE blocked", "DELETE FROM request_notes WHERE id=$1", [note.rows[0].id], "P0001");
    await rejected(client, "note body required", "INSERT INTO request_notes(request_id,body) VALUES ($1,'   ')", [followup.id], "23514", "request_notes_body_check");
    await client.query("ROLLBACK");
    console.log(`PostgreSQL 16 invariant checks passed (${assertions} assertions). All fixture rows rolled back.`);
  } finally {
    try { await client.query("ROLLBACK"); } catch { /* Connection may have failed before BEGIN. */ }
    client.release();
    await pool.end();
  }
}
main().catch((error: unknown) => {
  const failure = error as SqlFailure;
  const detail = error instanceof AssertionError ? error.message
    : failure.code && /^[A-Z0-9]{5}$/.test(failure.code) ? `SQLSTATE ${failure.code}; constraint ${failure.constraint ?? "unspecified"}`
    : "Verify isolated TEST_DATABASE_URL, PostgreSQL 16, committed migration and fixture availability.";
  console.error(`Database checks failed: ${detail}`);
  process.exitCode = 1;
});
