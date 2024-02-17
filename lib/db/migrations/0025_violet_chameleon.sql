ALTER TABLE "products" DROP CONSTRAINT "products_collection_id_collections_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "collection_id";