ALTER TABLE "WRAPPED_order_items" DROP CONSTRAINT "WRAPPED_order_items_user_id_WRAPPED_user_id_fk";
--> statement-breakpoint
ALTER TABLE "WRAPPED_order_items" DROP COLUMN IF EXISTS "user_id";