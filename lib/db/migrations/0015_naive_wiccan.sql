ALTER TABLE "variant_options" ADD COLUMN "product_id" varchar(256) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variant_options" ADD CONSTRAINT "variant_options_product_id_variants_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "variants"("product_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
