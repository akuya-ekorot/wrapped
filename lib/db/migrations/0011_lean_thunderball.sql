CREATE TABLE IF NOT EXISTS "variant_images" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_image_id" varchar(256) NOT NULL,
	"variant_id" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variant_images" ADD CONSTRAINT "variant_images_product_image_id_product_images_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "product_images"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variant_images" ADD CONSTRAINT "variant_images_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
