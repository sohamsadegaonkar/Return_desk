import { describe, expect, it } from "vitest";
import { canTransition, getCapabilities } from "../../src/domain/requests/policy";
import type { RequestStatus } from "../../src/domain/requests/types";

// Independent oracle transcribed from the frozen assignment lifecycle.
// Never compute expected outcomes from LEGAL_TRANSITIONS.
const statuses: RequestStatus[] = ["OPEN", "IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"];
const matrix = [
  [false, true, false, false, false],
  [false, false, true, true, false],
  [false, false, false, false, true],
  [false, false, false, false, false],
  [false, false, false, false, false],
];

describe("RULE-01 independent 25-pair lifecycle oracle", () => {
  statuses.forEach((from, row) => {
    statuses.forEach((to, column) => {
      it(`${from} -> ${to}: ${matrix[row][column]}`, () => {
        expect(canTransition(from, to)).toBe(matrix[row][column]);
      });
    });
  });
});

describe("legal UI capabilities", () => {
  it.each([
    ["OPEN", true, true, ["IN_REVIEW"]],
    ["IN_REVIEW", true, false, ["APPROVED", "REJECTED"]],
    ["APPROVED", false, false, ["COMPLETED"]],
    ["REJECTED", false, true, []],
    ["COMPLETED", false, false, []],
  ] as const)("%s offers only permitted actions", (status, canEdit, canRemove, transitions) => {
    expect(getCapabilities({ status })).toEqual({
      canEdit, canRemove, canAddNote: true,
      allowedTransitions: [...transitions],
      approvalRequirements: status === "IN_REVIEW"
        ? { resolutionRequired: true, refundAmountRequiredFor: "REFUND" }
        : null,
    });
  });

  it.each(statuses)("removed %s has no actions", (status) => {
    expect(getCapabilities({ status, removedAt: "2026-10-22T00:00:00Z" })).toEqual({
      canEdit: false, canRemove: false, canAddNote: false,
      allowedTransitions: [], approvalRequirements: null,
    });
  });
});
