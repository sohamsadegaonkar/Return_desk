import { describe, expect, it } from "vitest";
import {
  createRequestSchema, patchRequestSchema, transitionRequestSchema,
  noteSchema, removalSchema, listQuerySchema,
  validateMergedDetails, validateTransitionDetails,
} from "../../src/domain/requests/schemas";

const details = {
  customerName: "Asha", customerEmail: "asha@example.com", customerPhone: null,
  orderReference: "ORD-1001", itemIdentifier: "SKU-1", itemName: "Cushion",
  quantity: 1, reason: "DAMAGED" as const,
};

describe("create contract", () => {
  it("trims display fields and allows phone-only contact", () => {
    const result = createRequestSchema.parse({ ...details, customerName: " Asha ", customerEmail: " ", customerPhone: " +91 9876543210 " });
    expect(result.customerName).toBe("Asha");
    expect(result.customerEmail).toBeNull();
    expect(result.customerPhone).toBe("+91 9876543210");
  });
  it.each([undefined, null, "", "   "])("refuses missing contact with email %j", (customerEmail) => {
    expect(createRequestSchema.safeParse({ ...details, customerEmail }).success).toBe(false);
  });
  it.each(["status", "resolution", "refundAmount", "reference", "version", "removedAt"])("refuses server-owned %s", (field) => {
    expect(createRequestSchema.safeParse({ ...details, [field]: "OPEN" }).success).toBe(false);
  });
  it.each([0, -1, 1.5, "1", 2147483648, NaN, Infinity])("refuses invalid quantity %j", (quantity) => {
    expect(createRequestSchema.safeParse({ ...details, quantity }).success).toBe(false);
  });
  it("accepts the PostgreSQL integer quantity boundary", () => {
    expect(createRequestSchema.safeParse({ ...details, quantity: 2147483647 }).success).toBe(true);
  });
  it.each(["customerName", "orderReference", "itemIdentifier", "itemName"])("refuses blank %s", (field) => {
    expect(createRequestSchema.safeParse({ ...details, [field]: "   " }).success).toBe(false);
  });
  it("refuses invalid email and unknown reason", () => {
    expect(createRequestSchema.safeParse({ ...details, customerEmail: "not-an-email" }).success).toBe(false);
    expect(createRequestSchema.safeParse({ ...details, reason: "OTHER" }).success).toBe(false);
  });
});

describe("partial edit contract", () => {
  it("requires at least one detail and a positive version", () => {
    expect(patchRequestSchema.safeParse({ expectedVersion: 1 }).success).toBe(false);
    expect(patchRequestSchema.safeParse({ customerName: "New" }).success).toBe(false);
    expect(patchRequestSchema.safeParse({ expectedVersion: 0, customerName: "New" }).success).toBe(false);
  });
  it("checks contact against merged state, preserving omitted details", () => {
    const patch = patchRequestSchema.parse({ expectedVersion: 1, customerName: "New" });
    const result = validateMergedDetails(details, patch);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({ customerName: "New", customerEmail: "asha@example.com", itemIdentifier: "SKU-1" });
  });
  it("rejects clearing the last contact, accepts swapping contact channels", () => {
    expect(validateMergedDetails(details, patchRequestSchema.parse({ expectedVersion: 1, customerEmail: null })).success).toBe(false);
    expect(validateMergedDetails(details, patchRequestSchema.parse({ expectedVersion: 1, customerEmail: null, customerPhone: "9876543210" })).success).toBe(true);
  });
  it("rejects direct lifecycle edits", () => {
    expect(patchRequestSchema.safeParse({ expectedVersion: 1, status: "APPROVED" }).success).toBe(false);
  });
});

const approval = { expectedVersion: 1, toStatus: "APPROVED", resolution: "REFUND" };
const semantic = (input: unknown) => {
  const shape = transitionRequestSchema.safeParse(input);
  return shape.success ? validateTransitionDetails(shape.data) : shape;
};

describe("approval monetary contract", () => {
  it.each([["1", "1.00"], ["0.01", "0.01"], ["1499.5", "1499.50"], ["9999999999.99", "9999999999.99"]])("canonicalizes %s losslessly", (refundAmount, expected) => {
    const result = semantic({ ...approval, refundAmount });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.refundAmount).toBe(expected);
  });
  it.each([undefined, null, "0", "0.00", "-1", "1.001", "1e2", "NaN", "Infinity", "10000000000.00", 1499.5, "", ".50", "+1"])("rejects invalid refund %j", (refundAmount) => {
    expect(semantic({ ...approval, refundAmount }).success).toBe(false);
  });
  it("requires approval resolution", () => {
    expect(semantic({ expectedVersion: 1, toStatus: "APPROVED" }).success).toBe(false);
  });
  it.each(["REPLACEMENT", "STORE_CREDIT"])("%s permits no refund amount", (resolution) => {
    expect(semantic({ ...approval, resolution }).success).toBe(true);
    expect(semantic({ ...approval, resolution, refundAmount: null }).success).toBe(true);
    expect(semantic({ ...approval, resolution, refundAmount: "0.00" }).success).toBe(false);
  });
  it.each(["IN_REVIEW", "REJECTED", "COMPLETED"])("%s rejects new resolution metadata", (toStatus) => {
    expect(semantic({ expectedVersion: 1, toStatus }).success).toBe(true);
    expect(semantic({ ...approval, toStatus, refundAmount: "1.00" }).success).toBe(false);
  });
  it("defers approval semantics until after current-state eligibility", () => {
    expect(transitionRequestSchema.safeParse({ expectedVersion: 1, toStatus: "APPROVED" }).success).toBe(true);
  });
});

describe("notes, removal and list boundary contracts", () => {
  it("trims notes, rejects blank and oversize text, rejects version fields", () => {
    expect(noteSchema.parse({ body: " note " })).toEqual({ body: "note" });
    expect(noteSchema.safeParse({ body: " " }).success).toBe(false);
    expect(noteSchema.safeParse({ body: "x".repeat(4001) }).success).toBe(false);
    expect(noteSchema.safeParse({ body: "note", expectedVersion: 1 }).success).toBe(false);
  });
  it("removal requires only a positive integer version", () => {
    expect(removalSchema.parse({ expectedVersion: 1 })).toEqual({ expectedVersion: 1 });
    for (const expectedVersion of [0, -1, 1.5, "1"]) expect(removalSchema.safeParse({ expectedVersion }).success).toBe(false);
  });
  it("provides deterministic query defaults", () => {
    expect(listQuerySchema.parse({})).toEqual({ q: "", page: 1, pageSize: 10, sort: "createdAt", direction: "desc" });
  });
  it("accepts HTTP string pagination and exact filters", () => {
    expect(listQuerySchema.parse({ page: "2", pageSize: "50", q: " Asha ", status: "OPEN", reason: "DAMAGED", sort: "reference", direction: "asc" })).toMatchObject({ page: 2, pageSize: 50, q: "Asha", status: "OPEN", reason: "DAMAGED", sort: "reference", direction: "asc" });
  });
  it.each([{ page: "0" }, { page: "1.5" }, { pageSize: "51" }, { status: "open" }, { reason: "OTHER" }, { sort: "createdAt; DROP TABLE return_requests" }, { direction: "sideways" }])("rejects invalid query %j", (query) => {
    expect(listQuerySchema.safeParse(query).success).toBe(false);
  });
});
