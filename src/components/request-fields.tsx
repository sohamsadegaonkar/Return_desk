"use client";
import { RETURN_REASONS } from "@/domain/requests/types";
import { reasonLabels } from "@/lib/display";
import { FieldError } from "./ui";

import type { DetailsDraft } from "@/lib/request-draft";
export { blankDraft, draftFrom, draftPayload } from "@/lib/request-draft";
export type { DetailsDraft } from "@/lib/request-draft";

export function RequestFields({
  draft,
  onChange,
  errors,
  disabled = false,
}: {
  draft: DetailsDraft;
  onChange: (value: DetailsDraft) => void;
  errors: Record<string, string[]>;
  disabled?: boolean;
}) {
  const input = (
    name: keyof DetailsDraft,
    label: string,
    type = "text",
    maxLength?: number,
    hint?: string,
  ) => (
    <div className={name === "itemName" ? "sm:col-span-2" : ""}>
      <label className="field-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={draft[name] ?? ""}
        onChange={(e) => onChange({ ...draft, [name]: e.target.value })}
        disabled={disabled}
        maxLength={maxLength}
        min={type === "number" ? "1" : undefined}
        step={type === "number" ? "1" : undefined}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className="input"
      />
      {hint && <p className="field-hint">{hint}</p>}
      <FieldError errors={errors} name={name} />
    </div>
  );
  return (
    <>
      <fieldset disabled={disabled}>
        <legend className="section-label">
          01 <span>Customer</span>
        </legend>
        <p className="mb-5 text-sm text-slate-500">
          Provide a name and at least one way to reach the customer.
        </p>
        <div className="form-grid">
          {input("customerName", "Customer name", "text", 120)}
          {input("customerEmail", "Email address", "email", 255)}
          {input("customerPhone", "Phone number", "tel", 40)}
        </div>
      </fieldset>
      <fieldset
        disabled={disabled}
        className="mt-8 border-t border-slate-100 pt-7"
      >
        <legend className="section-label">
          02 <span>Order & item</span>
        </legend>
        <div className="form-grid mt-4">
          {input("orderReference", "Order reference", "text", 64)}
          {input("itemIdentifier", "Item identifier / SKU", "text", 64)}
          {input("itemName", "Item name", "text", 200)}
          {input("quantity", "Quantity", "number")}
          <div>
            <label className="field-label" htmlFor="reason">
              Reason for return
            </label>
            <select
              id="reason"
              className="input"
              value={draft.reason}
              onChange={(e) =>
                onChange({
                  ...draft,
                  reason: e.target.value as DetailsDraft["reason"],
                })
              }
            >
              {RETURN_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reasonLabels[reason]}
                </option>
              ))}
            </select>
            <FieldError errors={errors} name="reason" />
          </div>
        </div>
      </fieldset>
    </>
  );
}
