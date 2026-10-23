import { sql } from "drizzle-orm";
import { bigint, check, index, integer, numeric, pgEnum, pgSequence, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const returnStatus = pgEnum("return_status", ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"]);
export const returnReason = pgEnum("return_reason", ["DAMAGED", "WRONG_ITEM", "SIZE_ISSUE", "NOT_AS_DESCRIBED", "CHANGED_MIND"]);
export const returnResolution = pgEnum("return_resolution", ["REFUND", "REPLACEMENT", "STORE_CREDIT"]);
export const returnRequestRefSequence = pgSequence("return_request_ref_seq", { startWith: 1001, increment: 1 });
const instant = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

export const returnRequests = pgTable("return_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceNumber: bigint("reference_number", { mode: "bigint" }).notNull().unique().default(sql`nextval('return_request_ref_seq')`),
  reference: varchar("reference", { length: 32 }).generatedAlwaysAs(sql`'RD-' || lpad(reference_number::text, greatest(6, length(reference_number::text)), '0')`).unique(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 40 }),
  orderReference: varchar("order_reference", { length: 64 }).notNull(),
  orderKey: text("order_key").generatedAlwaysAs(sql`lower(trim(order_reference))`),
  itemIdentifier: varchar("item_identifier", { length: 64 }).notNull(),
  itemKey: text("item_key").generatedAlwaysAs(sql`lower(trim(item_identifier))`),
  itemName: varchar("item_name", { length: 200 }).notNull(),
  quantity: integer("quantity").notNull(),
  reason: returnReason("reason").notNull(),
  status: returnStatus("status").notNull().default("OPEN"),
  resolution: returnResolution("resolution"),
  refundAmount: numeric("refund_amount", { precision: 12, scale: 2 }),
  version: integer("version").notNull().default(1),
  createdAt: instant("created_at").notNull().defaultNow(),
  updatedAt: instant("updated_at").notNull().defaultNow(),
  decidedAt: instant("decided_at"),
  completedAt: instant("completed_at"),
  removedAt: instant("removed_at"),
}, (t) => [
  check("chk_non_empty_required_text", sql`length(trim(${t.customerName})) > 0 AND length(trim(${t.orderReference})) > 0 AND length(trim(${t.itemIdentifier})) > 0 AND length(trim(${t.itemName})) > 0`),
  check("chk_customer_contact_present", sql`(${t.customerEmail} IS NOT NULL AND length(trim(${t.customerEmail})) > 0) OR (${t.customerPhone} IS NOT NULL AND length(trim(${t.customerPhone})) > 0)`),
  check("chk_positive_quantity", sql`${t.quantity} > 0`),
  check("chk_positive_version", sql`${t.version} >= 1`),
  check("chk_resolution_by_status", sql`(${t.status} IN ('OPEN', 'IN_REVIEW', 'REJECTED') AND ${t.resolution} IS NULL AND ${t.refundAmount} IS NULL) OR (${t.status} IN ('APPROVED', 'COMPLETED') AND ${t.resolution} IS NOT NULL)`),
  check("chk_refund_amount_by_resolution", sql`(${t.resolution} = 'REFUND' AND ${t.refundAmount} IS NOT NULL AND ${t.refundAmount} > 0 AND ${t.refundAmount} <= 9999999999.99) OR (${t.resolution} IS DISTINCT FROM 'REFUND' AND ${t.refundAmount} IS NULL)`),
  uniqueIndex("one_live_request_per_order_item").on(t.orderKey, t.itemKey).where(sql`${t.status} IN ('OPEN', 'IN_REVIEW', 'APPROVED')`),
  index("idx_return_requests_visible_created").on(t.createdAt.desc(), t.id.desc()).where(sql`${t.removedAt} IS NULL`),
  index("idx_return_requests_visible_status_reason").on(t.status, t.reason, t.createdAt.desc(), t.id.desc()).where(sql`${t.removedAt} IS NULL`),
]);

export const requestNotes = pgTable("request_notes", {
  id: bigint("id", { mode: "bigint" }).primaryKey().generatedAlwaysAsIdentity(),
  requestId: uuid("request_id").notNull().references(() => returnRequests.id, { onDelete: "restrict" }),
  body: text("body").notNull(),
  createdAt: instant("created_at").notNull().defaultNow(),
}, (t) => [
  check("request_notes_body_check", sql`length(trim(${t.body})) > 0 AND length(${t.body}) <= 4000`),
  index("idx_request_notes_chronological").on(t.requestId, t.createdAt.asc(), t.id.asc()),
]);

export type ReturnRequestRow = typeof returnRequests.$inferSelect;
export type RequestNoteRow = typeof requestNotes.$inferSelect;
