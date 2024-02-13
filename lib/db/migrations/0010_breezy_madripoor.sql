DO $$ BEGIN
 CREATE TYPE "hero_link_types" AS ENUM('collection', 'product');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "hero_links" ALTER COLUMN "type" SET DATA TYPE hero_link_types USING "type"::hero_link_types;
