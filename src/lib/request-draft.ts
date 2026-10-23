import type { RequestDetails } from "../domain/requests/types";

export type DetailsDraft = Omit<RequestDetails, "quantity"> & {
  quantity: string;
};
export const blankDraft: DetailsDraft = {
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  orderReference: "",
  itemIdentifier: "",
  itemName: "",
  quantity: "1",
  reason: "DAMAGED",
};

/** Explicit boundary allowlist: a full server DTO must never leak readonly fields into PATCH. */
export function draftFrom(details: RequestDetails): DetailsDraft {
  return {
    customerName: details.customerName,
    customerEmail: details.customerEmail || "",
    customerPhone: details.customerPhone || "",
    orderReference: details.orderReference,
    itemIdentifier: details.itemIdentifier,
    itemName: details.itemName,
    quantity: String(details.quantity),
    reason: details.reason,
  };
}

export function draftPayload(draft: DetailsDraft): RequestDetails {
  return {
    customerName: draft.customerName,
    customerEmail: draft.customerEmail?.trim() || null,
    customerPhone: draft.customerPhone?.trim() || null,
    orderReference: draft.orderReference,
    itemIdentifier: draft.itemIdentifier,
    itemName: draft.itemName,
    quantity: Number(draft.quantity),
    reason: draft.reason,
  };
}
