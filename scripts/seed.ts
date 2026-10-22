import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { createPool } from "../src/server/db/connection";
import { returnRequests, requestNotes } from "../src/server/db/schema";

type SeedRow = typeof returnRequests.$inferInsert;
const statuses = ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"] as const;
const reasons = ["DAMAGED", "WRONG_ITEM", "SIZE_ISSUE", "NOT_AS_DESCRIBED", "CHANGED_MIND"] as const;
const resolutions = ["REFUND", "REPLACEMENT", "STORE_CREDIT"] as const;
const rows: SeedRow[] = [];

function row(status: SeedRow["status"], reason: SeedRow["reason"], overrides: Partial<SeedRow> = {}): SeedRow {
  const n = rows.length + 1;
  const createdAt = new Date(Date.UTC(2026, 9, 1, 9, n));
  const decided = status === "APPROVED" || status === "COMPLETED" || status === "REJECTED";
  const resolution = status === "APPROVED" || status === "COMPLETED" ? resolutions[(n - 1) % 3] : null;
  return {
    id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    customerName: `Demo Customer ${n}`,
    customerEmail: `customer${n}@example.test`,
    customerPhone: null,
    orderReference: `ORD-DEMO-${String(n).padStart(3, "0")}`,
    itemIdentifier: `SKU-${String(n).padStart(3, "0")}`,
    itemName: ["Everyday comfort insole", "Ergonomic seat cushion", "Arch support footwear"][n % 3],
    quantity: 1 + n % 3,
    reason, status, resolution,
    refundAmount: resolution === "REFUND" ? "1499.00" : null,
    createdAt,
    updatedAt: new Date(createdAt.getTime() + (decided ? 3_600_000 : 0)),
    decidedAt: decided ? new Date(createdAt.getTime() + 1_800_000) : null,
    completedAt: status === "COMPLETED" ? new Date(createdAt.getTime() + 3_600_000) : null,
    ...overrides,
  };
}

for (const status of statuses) for (const reason of reasons) rows.push(row(status, reason));
// Two historical/live pairs = four rows; normalized item identity repeats legally.
for (const [n, terminal] of (["REJECTED", "COMPLETED"] as const).entries()) {
  const identity = { orderReference: `ORD-FOLLOWUP-${n + 1}`, itemIdentifier: "SKU-FOLLOWUP" };
  rows.push(row(terminal, "DAMAGED", identity));
  rows.push(row("OPEN", "DAMAGED", identity));
}
rows.push(row("OPEN", "SIZE_ISSUE", { customerEmail: null, customerPhone: "+91 90000 00001" }));
rows.push(row("IN_REVIEW", "NOT_AS_DESCRIBED", { customerName: "Demo Customer With A Long Name For Responsive Layout Verification", itemName: "Everyday comfort and arch support insole — extended product label for narrow screen wrapping and request workspace layout checks" }));
rows.push(row("APPROVED", "DAMAGED", { resolution: "REFUND", refundAmount: "0.01" }));
rows.push(row("COMPLETED", "WRONG_ITEM", { resolution: "REPLACEMENT", refundAmount: null }));
rows.push(row("APPROVED", "CHANGED_MIND", { resolution: "STORE_CREDIT", refundAmount: null }));
rows.push(row("REJECTED", "SIZE_ISSUE", { customerPhone: "+91 90000 00002", quantity: 12 }));
rows.push(row("OPEN", "NOT_AS_DESCRIBED", { itemName: "Support cushion — 100% comfort_edition", customerName: "Demo O'Connor" }));

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("Demo seed is disabled in production mode.");
  if (rows.length !== 36) throw new Error("Seed fixture count must be exactly 36.");
  const pool = createPool();
  try {
    await drizzle(pool).transaction(async (tx) => {
      // Blocks concurrent app writes while checking emptiness and inserting.
      await tx.execute(sql`LOCK TABLE return_requests, request_notes IN EXCLUSIVE MODE`);
      const existing = await tx.select({ id: returnRequests.id }).from(returnRequests).limit(1);
      if (existing.length) throw new Error("SEED_NOT_EMPTY");
      await tx.insert(returnRequests).values(rows);
      await tx.insert(requestNotes).values([0, 10, 15, 20, 25, 27].map((i) => ({
        requestId: rows[i].id!,
        body: "Synthetic demo note: customer details and return reason reviewed.",
        createdAt: new Date(Date.UTC(2026, 9, 2, 10, i)),
      })));
    });
    console.log("Seeded 36 visible synthetic requests and 6 append-only notes.");
  } finally {
    await pool.end();
  }
}
main().catch((error: unknown) => {
  console.error(error instanceof Error && error.message === "SEED_NOT_EMPTY"
    ? "Seed refused: request data already exists. Existing data was not changed. Use a separate empty demo database."
    : "Seed failed; transaction rolled back. Check configuration, migrations, and production-mode guard. No credentials are logged.");
  process.exitCode = 1;
});
