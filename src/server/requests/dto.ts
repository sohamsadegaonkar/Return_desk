import type { RequestCapabilities, RequestDetails, RequestStatus, Resolution } from "../../domain/requests/types";

/** Transport types only. Safe for type-only imports by the React client. */
export interface RequestDTO extends RequestDetails {
  id: string;
  reference: string;
  referenceNumber: string;
  status: RequestStatus;
  resolution: Resolution | null;
  refundAmount: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  decidedAt: string | null;
  completedAt: string | null;
  removedAt: string | null;
  capabilities: RequestCapabilities;
}
export interface NoteDTO { id: string; requestId: string; body: string; createdAt: string }
export interface RequestDetailDTO extends RequestDTO { notes: NoteDTO[] }
export interface ListResult {
  data: RequestDTO[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}
