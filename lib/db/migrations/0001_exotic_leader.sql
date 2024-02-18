ALTER TABLE "WRAPPED_order_items" ALTER COLUMN "variant_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "WRAPPED_order_items" ADD COLUMN "product_id" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_order_items" ADD CONSTRAINT "WRAPPED_order_items_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
