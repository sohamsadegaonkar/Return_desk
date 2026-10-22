import { z } from "zod";
import { REQUEST_STATUSES, RESOLUTIONS, RETURN_REASONS, type RequestDetails } from "./types";

const text = (maximum: number) => z.string().trim().min(1).max(maximum);
const contact = (schema: z.ZodType<string>) => z.preprocess(
  (value) => typeof value === "string" ? value.trim() || null : value,
  schema.nullable(),
);
const email = contact(z.string().max(255).email());
const phone = contact(text(40));
const expectedVersion = z.number().int().positive().max(2147483647);
const detailShape = {
  customerName: text(120),
  customerEmail: email,
  customerPhone: phone,
  orderReference: text(64),
  itemIdentifier: text(64),
  itemName: text(200),
  quantity: z.number().int().positive().max(2147483647),
  reason: z.enum(RETURN_REASONS),
};
const editableKeys = Object.keys(detailShape) as (keyof RequestDetails)[];

export const createRequestSchema = z.object({
  ...detailShape,
  customerEmail: email.optional().default(null),
  customerPhone: phone.optional().default(null),
}).strict().superRefine((value, ctx) => {
  if (!value.customerEmail && !value.customerPhone) {
    ctx.addIssue({ code: "custom", path: ["customerEmail"], message: "Provide an email address or phone number." });
  }
});

export const patchRequestSchema = z.object(detailShape).partial().extend({ expectedVersion }).strict()
  .superRefine((value, ctx) => {
    if (!editableKeys.some((key) => value[key] !== undefined)) {
      ctx.addIssue({ code: "custom", message: "Provide at least one editable field." });
    }
  });
export type CreateRequestInput = z.output<typeof createRequestSchema>;
export type PatchRequestInput = z.output<typeof patchRequestSchema>;

/** Invoke after locking, checking version and checking edit eligibility. */
export function validateMergedDetails(current: RequestDetails, patch: PatchRequestInput) {
  const merged: Record<string, unknown> = {};
  for (const key of editableKeys) merged[key] = patch[key] === undefined ? current[key] : patch[key];
  return createRequestSchema.safeParse(merged);
}

/** Shape only: operation-specific checks follow lookup/version/eligibility. */
export const transitionRequestSchema = z.object({
  expectedVersion,
  toStatus: z.enum(REQUEST_STATUSES),
  resolution: z.enum(RESOLUTIONS).optional(),
  refundAmount: z.string().trim().nullable().optional(),
}).strict();
export type TransitionRequestInput = z.output<typeof transitionRequestSchema>;

export const refundAmountSchema = z.string().trim().regex(/^\d+(?:\.\d{1,2})?$/, "Use an unsigned decimal with at most two fractional digits.")
  .transform((value, ctx) => {
    const [whole, fraction = ""] = value.split(".");
    const normalizedWhole = whole.replace(/^0+(?=\d)/, "");
    if (normalizedWhole.length > 10) {
      ctx.addIssue({ code: "custom", message: "Refund exceeds 9999999999.99." });
      return z.NEVER;
    }
    const cents = BigInt(normalizedWhole) * 100n + BigInt(fraction.padEnd(2, "0"));
    if (cents <= 0n || cents > 999999999999n) {
      ctx.addIssue({ code: "custom", message: "Refund must be positive and at most 9999999999.99." });
      return z.NEVER;
    }
    return `${normalizedWhole}.${fraction.padEnd(2, "0")}`;
  });

const transitionDetailsSchema = transitionRequestSchema.superRefine((value, ctx) => {
  if (value.toStatus !== "APPROVED") {
    for (const key of ["resolution", "refundAmount"] as const) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        ctx.addIssue({ code: "custom", path: [key], message: "Only approval can set resolution details." });
      }
    }
    return;
  }
  if (!value.resolution) {
    ctx.addIssue({ code: "custom", path: ["resolution"], message: "Choose a resolution." });
  }
  if (value.resolution === "REFUND") {
    const result = refundAmountSchema.safeParse(value.refundAmount);
    if (!result.success) {
      for (const issue of result.error.issues) ctx.addIssue({ code: "custom", path: ["refundAmount"], message: issue.message });
    }
  } else if (value.refundAmount != null) {
    ctx.addIssue({ code: "custom", path: ["refundAmount"], message: "Only refunds may include an amount." });
  }
}).transform((value) => value.resolution === "REFUND" && value.toStatus === "APPROVED"
  ? { ...value, refundAmount: refundAmountSchema.parse(value.refundAmount) }
  : value);

/** Invoke only after the service has established the requested transition is legal. */
export function validateTransitionDetails(input: TransitionRequestInput) {
  return transitionDetailsSchema.safeParse(input);
}

export const noteSchema = z.object({ body: text(4000) }).strict();
export const removalSchema = z.object({ expectedVersion }).strict();
const queryInteger = (maximum: number) => z.preprocess(
  (value) => typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value,
  z.number().int().positive().max(maximum),
);
export const listQuerySchema = z.object({
  q: z.string().trim().default(""),
  status: z.enum(REQUEST_STATUSES).optional(),
  reason: z.enum(RETURN_REASONS).optional(),
  sort: z.enum(["createdAt", "updatedAt", "reference", "customerName"]).default("createdAt"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  page: queryInteger(Number.MAX_SAFE_INTEGER).default(1),
  pageSize: queryInteger(50).default(10),
}).strict();
export type ListQuery = z.output<typeof listQuerySchema>;
