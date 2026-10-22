import type { RequestCapabilities, RequestStatus } from "./types";

export const LEGAL_TRANSITIONS: Readonly<Record<RequestStatus, readonly RequestStatus[]>> = Object.freeze({
  OPEN: Object.freeze(["IN_REVIEW"] as const),
  IN_REVIEW: Object.freeze(["APPROVED", "REJECTED"] as const),
  APPROVED: Object.freeze(["COMPLETED"] as const),
  REJECTED: Object.freeze([]),
  COMPLETED: Object.freeze([]),
});

export function canTransition(from: RequestStatus, to: RequestStatus): boolean {
  return LEGAL_TRANSITIONS[from].includes(to);
}

export function getCapabilities(request: {
  status: RequestStatus;
  removedAt?: string | Date | null;
}): RequestCapabilities {
  const visible = request.removedAt == null;
  return {
    canEdit: visible && (request.status === "OPEN" || request.status === "IN_REVIEW"),
    canAddNote: visible,
    canRemove: visible && (request.status === "OPEN" || request.status === "REJECTED"),
    allowedTransitions: visible ? [...LEGAL_TRANSITIONS[request.status]] : [],
    approvalRequirements: visible && request.status === "IN_REVIEW"
      ? { resolutionRequired: true, refundAmountRequiredFor: "REFUND" }
      : null,
  };
}
