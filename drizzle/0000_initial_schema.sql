CREATE TYPE "public"."return_reason" AS ENUM('DAMAGED', 'WRONG_ITEM', 'SIZE_ISSUE', 'NOT_AS_DESCRIBED', 'CHANGED_MIND');--> statement-breakpoint
CREATE TYPE "public"."return_resolution" AS ENUM('REFUND', 'REPLACEMENT', 'STORE_CREDIT');--> statement-breakpoint
CREATE TYPE "public"."return_status" AS ENUM('OPEN', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED');--> statement-breakpoint
CREATE SEQUENCE "public"."return_request_ref_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1001 CACHE 1;--> statement-breakpoint
CREATE TABLE "request_notes" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_notes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"request_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "request_notes_body_check" CHECK (length(trim("request_notes"."body")) > 0 AND length("request_notes"."body") <= 4000)
);
--> statement-breakpoint
CREATE TABLE "return_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_number" bigint DEFAULT nextval('return_request_ref_seq') NOT NULL,
	"reference" varchar(32) GENERATED ALWAYS AS ('RD-' || lpad(reference_number::text, greatest(6, length(reference_number::text)), '0')) STORED,
	"customer_name" varchar(120) NOT NULL,
	"customer_email" varchar(255),
	"customer_phone" varchar(40),
	"order_reference" varchar(64) NOT NULL,
	"order_key" text GENERATED ALWAYS AS (lower(trim(order_reference))) STORED,
	"item_identifier" varchar(64) NOT NULL,
	"item_key" text GENERATED ALWAYS AS (lower(trim(item_identifier))) STORED,
	"item_name" varchar(200) NOT NULL,
	"quantity" integer NOT NULL,
	"reason" "return_reason" NOT NULL,
	"status" "return_status" DEFAULT 'OPEN' NOT NULL,
	"resolution" "return_resolution",
	"refund_amount" numeric(12, 2),
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"removed_at" timestamp with time zone,
	CONSTRAINT "return_requests_reference_number_unique" UNIQUE("reference_number"),
	CONSTRAINT "return_requests_reference_unique" UNIQUE("reference"),
	CONSTRAINT "chk_non_empty_required_text" CHECK (length(trim("return_requests"."customer_name")) > 0 AND length(trim("return_requests"."order_reference")) > 0 AND length(trim("return_requests"."item_identifier")) > 0 AND length(trim("return_requests"."item_name")) > 0),
	CONSTRAINT "chk_customer_contact_present" CHECK (("return_requests"."customer_email" IS NOT NULL AND length(trim("return_requests"."customer_email")) > 0) OR ("return_requests"."customer_phone" IS NOT NULL AND length(trim("return_requests"."customer_phone")) > 0)),
	CONSTRAINT "chk_positive_quantity" CHECK ("return_requests"."quantity" > 0),
	CONSTRAINT "chk_positive_version" CHECK ("return_requests"."version" >= 1),
	CONSTRAINT "chk_resolution_by_status" CHECK (("return_requests"."status" IN ('OPEN', 'IN_REVIEW', 'REJECTED') AND "return_requests"."resolution" IS NULL AND "return_requests"."refund_amount" IS NULL) OR ("return_requests"."status" IN ('APPROVED', 'COMPLETED') AND "return_requests"."resolution" IS NOT NULL)),
	CONSTRAINT "chk_refund_amount_by_resolution" CHECK (("return_requests"."resolution" = 'REFUND' AND "return_requests"."refund_amount" IS NOT NULL AND "return_requests"."refund_amount" > 0 AND "return_requests"."refund_amount" <= 9999999999.99) OR ("return_requests"."resolution" IS DISTINCT FROM 'REFUND' AND "return_requests"."refund_amount" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "request_notes" ADD CONSTRAINT "request_notes_request_id_return_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."return_requests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_request_notes_chronological" ON "request_notes" USING btree ("request_id","created_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "one_live_request_per_order_item" ON "return_requests" USING btree ("order_key","item_key") WHERE "return_requests"."status" IN ('OPEN', 'IN_REVIEW', 'APPROVED');--> statement-breakpoint
CREATE INDEX "idx_return_requests_visible_created" ON "return_requests" USING btree ("created_at" DESC NULLS LAST,"id" DESC NULLS LAST) WHERE "return_requests"."removed_at" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_return_requests_visible_status_reason" ON "return_requests" USING btree ("status","reason","created_at" DESC NULLS LAST,"id" DESC NULLS LAST) WHERE "return_requests"."removed_at" IS NULL;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION prevent_note_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Return request notes are append-only and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_request_notes_append_only
  BEFORE UPDATE OR DELETE ON request_notes
  FOR EACH ROW EXECUTE FUNCTION prevent_note_mutation();
