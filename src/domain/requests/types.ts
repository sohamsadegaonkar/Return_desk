export const REQUEST_STATUSES = ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"] as const;
export const RETURN_REASONS = ["DAMAGED", "WRONG_ITEM", "SIZE_ISSUE", "NOT_AS_DESCRIBED", "CHANGED_MIND"] as const;
export const RESOLUTIONS = ["REFUND", "REPLACEMENT", "STORE_CREDIT"] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];
export type ReturnReason = (typeof RETURN_REASONS)[number];
export type Resolution = (typeof RESOLUTIONS)[number];

export interface RequestDetails {
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  orderReference: string;
  itemIdentifier: string;
  itemName: string;
  quantity: number;
  reason: ReturnReason;
}

export interface RequestCapabilities {
  canEdit: boolean;
  canAddNote: boolean;
  canRemove: boolean;
  allowedTransitions: RequestStatus[];
  approvalRequirements: {
    resolutionRequired: true;
    refundAmountRequiredFor: "REFUND";
  } | null;
}
