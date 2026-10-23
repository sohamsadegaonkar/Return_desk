import type {
  RequestStatus,
  Resolution,
  ReturnReason,
} from "@/domain/requests/types";
export const statusLabels: Record<RequestStatus, string> = {
  OPEN: "Open",
  IN_REVIEW: "In review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};
export const reasonLabels: Record<ReturnReason, string> = {
  DAMAGED: "Damaged",
  WRONG_ITEM: "Wrong item",
  SIZE_ISSUE: "Size issue",
  NOT_AS_DESCRIBED: "Not as described",
  CHANGED_MIND: "Changed mind",
};
export const resolutionLabels: Record<Resolution, string> = {
  REFUND: "Refund",
  REPLACEMENT: "Replacement",
  STORE_CREDIT: "Store credit",
};
export const shortDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const fullDate = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
export const money = (value: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(value),
  );
