import "server-only";
import type { Pool, PoolClient } from "pg";
import { getPool } from "../db";
import { canTransition, getCapabilities } from "../../domain/requests/policy";
import {
  createRequestSchema, listQuerySchema, noteSchema, patchRequestSchema, removalSchema,
  transitionRequestSchema, validateMergedDetails, validateTransitionDetails,
} from "../../domain/requests/schemas";
import type { RequestDetails, RequestStatus, Resolution } from "../../domain/requests/types";
import type { ListResult, NoteDTO, RequestDTO, RequestDetailDTO } from "./dto";
import { databaseError, RequestError, validationError } from "./errors";

// Every identifier below is static. User values are passed as bind parameters.
const columns = `id, reference, reference_number::text AS "referenceNumber",
  customer_name AS "customerName", customer_email AS "customerEmail", customer_phone AS "customerPhone",
  order_reference AS "orderReference", item_identifier AS "itemIdentifier", item_name AS "itemName",
  quantity, reason, status, resolution, refund_amount::text AS "refundAmount", version,
  created_at AS "createdAt", updated_at AS "updatedAt", decided_at AS "decidedAt",
  completed_at AS "completedAt", removed_at AS "removedAt"`;
const noteColumns = `id::text AS id, request_id AS "requestId", body, created_at AS "createdAt"`;
type RequestRow = RequestDetails & {
  id: string; reference: string; referenceNumber: string; status: RequestStatus;
  resolution: Resolution | null; refundAmount: string | null; version: number;
  createdAt: Date; updatedAt: Date; decidedAt: Date | null; completedAt: Date | null; removedAt: Date | null;
};
type NoteRow = Omit<NoteDTO, "createdAt"> & { createdAt: Date };
const noteDTO = (row: NoteRow): NoteDTO => ({ ...row, id: String(row.id), createdAt: row.createdAt.toISOString() });
function requestDTO(row: RequestRow): RequestDTO {
  return { ...row, referenceNumber: String(row.referenceNumber),
    createdAt: row.createdAt.toISOString(), updatedAt: row.updatedAt.toISOString(),
    decidedAt: row.decidedAt?.toISOString() ?? null, completedAt: row.completedAt?.toISOString() ?? null,
    removedAt: row.removedAt?.toISOString() ?? null, capabilities: getCapabilities(row) };
}
function validId(id: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new RequestError(400, "BAD_REQUEST", "The request identifier must be a UUID.");
  }
}
function sameVersion(row: RequestRow, expectedVersion: number): void {
  if (row.version !== expectedVersion) throw new RequestError(409, "STALE_REQUEST",
    "This request changed after you opened it. Reload the latest details before trying again.", {},
    { expectedVersion, currentVersion: row.version });
}
const missing = () => new RequestError(404, "REQUEST_NOT_FOUND", "This request was not found or has been removed from the desk.");

export class RequestService {
  constructor(private readonly poolFactory: () => Pool = getPool) {}

  private async transaction<T>(work: (client: PoolClient) => Promise<T>, readOnly = false): Promise<T> {
    const client = await this.poolFactory().connect();
    try {
      await client.query(readOnly ? "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY" : "BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => undefined);
      // This catch is outside the aborted work: never query inside a failed transaction.
      throw databaseError(error);
    } finally { client.release(); }
  }

  private async visible(client: PoolClient, id: string, lock = false): Promise<RequestRow> {
    const result = await client.query<RequestRow>(
      `SELECT ${columns} FROM return_requests WHERE id = $1 AND removed_at IS NULL${lock ? " FOR UPDATE" : ""}`, [id]);
    if (!result.rows[0]) throw missing();
    return result.rows[0];
  }

  async create(input: unknown): Promise<RequestDTO> {
    const parsed = createRequestSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    const d = parsed.data;
    return this.transaction(async (client) => {
      const result = await client.query<RequestRow>(`INSERT INTO return_requests
        (customer_name, customer_email, customer_phone, order_reference, item_identifier, item_name, quantity, reason)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${columns}`,
      [d.customerName, d.customerEmail, d.customerPhone, d.orderReference, d.itemIdentifier, d.itemName, d.quantity, d.reason]);
      return requestDTO(result.rows[0]);
    });
  }

  async get(id: string): Promise<RequestDetailDTO> {
    validId(id);
    return this.transaction(async (client) => {
      const row = await this.visible(client, id);
      const notes = await client.query<NoteRow>(`SELECT ${noteColumns} FROM request_notes
        WHERE request_id = $1 ORDER BY created_at ASC, id ASC`, [id]);
      return { ...requestDTO(row), notes: notes.rows.map(noteDTO) };
    }, true);
  }

  async list(input: unknown): Promise<ListResult> {
    const parsed = listQuerySchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    const q = parsed.data;
    // Multiplying arbitrary valid page numbers in JS could lose integer precision.
    const offset = (BigInt(q.page) - 1n) * BigInt(q.pageSize);
    const args: unknown[] = [];
    const predicates = ["removed_at IS NULL"];
    if (q.status) { args.push(q.status); predicates.push(`status = $${args.length}`); }
    if (q.reason) { args.push(q.reason); predicates.push(`reason = $${args.length}`); }
    if (q.q) {
      args.push(`%${q.q.replace(/[\\%_]/g, "\\$&")}%`);
      const bound = `$${args.length}`;
      predicates.push(`(${["reference", "customer_name", "customer_email", "customer_phone", "order_reference", "item_name", "item_identifier"]
        .map((field) => `${field} ILIKE ${bound} ESCAPE E'\\\\'`).join(" OR ")})`);
    }
    const where = predicates.join(" AND ");
    const sortColumns = { createdAt: "created_at", updatedAt: "updated_at", reference: "reference_number", customerName: "customer_name" } as const;
    const order = `${sortColumns[q.sort]} ${q.direction === "asc" ? "ASC" : "DESC"}, id DESC`;
    return this.transaction(async (client) => {
      const count = await client.query<{ count: string }>(`SELECT count(*)::text AS count FROM return_requests WHERE ${where}`, args);
      const total = Number(count.rows[0].count);
      // A page beyond the result set is empty. Avoid asking PostgreSQL to cast an overflowing offset.
      const rows = offset >= BigInt(total) ? [] : (await client.query<RequestRow>(
        `SELECT ${columns} FROM return_requests WHERE ${where} ORDER BY ${order} LIMIT $${args.length + 1} OFFSET $${args.length + 2}`,
        [...args, q.pageSize, offset.toString()])).rows;
      return { data: rows.map(requestDTO), pagination: { page: q.page, pageSize: q.pageSize, total, totalPages: Math.ceil(total / q.pageSize) } };
    }, true);
  }

  async patch(id: string, input: unknown): Promise<RequestDTO> {
    validId(id);
    const parsed = patchRequestSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    return this.transaction(async (client) => {
      const row = await this.visible(client, id, true);
      sameVersion(row, parsed.data.expectedVersion);
      if (!getCapabilities(row).canEdit) throw new RequestError(409, "DETAILS_LOCKED", "Details are locked after a decision. You can still add a note.");
      const merged = validateMergedDetails(row, parsed.data);
      if (!merged.success) throw validationError(merged.error);
      const d = merged.data;
      const result = await client.query<RequestRow>(`UPDATE return_requests SET customer_name=$2, customer_email=$3,
        customer_phone=$4, order_reference=$5, item_identifier=$6, item_name=$7, quantity=$8, reason=$9,
        version=version+1, updated_at=clock_timestamp() WHERE id=$1 RETURNING ${columns}`,
      [id, d.customerName, d.customerEmail, d.customerPhone, d.orderReference, d.itemIdentifier, d.itemName, d.quantity, d.reason]);
      return requestDTO(result.rows[0]);
    });
  }

  async transition(id: string, input: unknown): Promise<RequestDTO> {
    validId(id);
    const parsed = transitionRequestSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    return this.transaction(async (client) => {
      const row = await this.visible(client, id, true);
      sameVersion(row, parsed.data.expectedVersion);
      if (!canTransition(row.status, parsed.data.toStatus)) throw new RequestError(409, "INVALID_TRANSITION",
        `A request in ${row.status} cannot move to ${parsed.data.toStatus}.`, {}, { currentStatus: row.status, toStatus: parsed.data.toStatus });
      const semantic = validateTransitionDetails(parsed.data);
      if (!semantic.success) throw validationError(semantic.error);
      const d = semantic.data;
      const result = await client.query<RequestRow>(`UPDATE return_requests SET status=$2,
        resolution=$3, refund_amount=$4, version=version+1, updated_at=clock_timestamp(),
        decided_at=CASE WHEN $2 IN ('APPROVED','REJECTED') THEN clock_timestamp() ELSE decided_at END,
        completed_at=CASE WHEN $2='COMPLETED' THEN clock_timestamp() ELSE completed_at END
        WHERE id=$1 RETURNING ${columns}`,
      [id, d.toStatus, d.toStatus === "APPROVED" ? d.resolution : row.resolution,
        d.toStatus === "APPROVED" ? d.refundAmount ?? null : row.refundAmount]);
      return requestDTO(result.rows[0]);
    });
  }

  async addNote(id: string, input: unknown): Promise<NoteDTO> {
    validId(id);
    const parsed = noteSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    return this.transaction(async (client) => {
      await this.visible(client, id, true);
      const result = await client.query<NoteRow>(`INSERT INTO request_notes (request_id, body, created_at)
        VALUES ($1,$2,clock_timestamp()) RETURNING ${noteColumns}`, [id, parsed.data.body]);
      return noteDTO(result.rows[0]);
    });
  }

  async remove(id: string, input: unknown): Promise<void> {
    validId(id);
    const parsed = removalSchema.safeParse(input);
    if (!parsed.success) throw validationError(parsed.error);
    await this.transaction(async (client) => {
      const row = await this.visible(client, id, true);
      sameVersion(row, parsed.data.expectedVersion);
      if (!getCapabilities(row).canRemove) throw new RequestError(409, "REMOVAL_NOT_ALLOWED", "Only open or rejected requests can be removed from the desk.");
      await client.query("UPDATE return_requests SET removed_at=clock_timestamp(), updated_at=clock_timestamp(), version=version+1 WHERE id=$1", [id]);
    });
  }
}

export const requests = new RequestService();
