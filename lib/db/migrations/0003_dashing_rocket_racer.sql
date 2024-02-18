ALTER TABLE "WRAPPED_orders" RENAME COLUMN "user_id" TO "customer_id";--> statement-breakpoint
ALTER TABLE "WRAPPED_orders" DROP CONSTRAINT "WRAPPED_orders_user_id_WRAPPED_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_orders" ADD CONSTRAINT "WRAPPED_orders_customer_id_WRAPPED_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "WRAPPED_customers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
