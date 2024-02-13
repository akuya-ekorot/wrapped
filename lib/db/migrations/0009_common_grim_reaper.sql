CREATE TABLE IF NOT EXISTS "featured_collection_sections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"call_to_action" text,
	"image_id" varchar(256) NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "featured_products_section" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"hero_link_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_links" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"hero_section_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"hero_link_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_sections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"call_to_action" text,
	"image_id" varchar(256) NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "home_pages" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referred_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"main_collection_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referred_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"featured_products_section_id" varchar(256) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "featured_collection_sections" ADD CONSTRAINT "featured_collection_sections_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "featured_collection_sections" ADD CONSTRAINT "featured_collection_sections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "featured_collection_sections" ADD CONSTRAINT "featured_collection_sections_home_page_id_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "featured_products_section" ADD CONSTRAINT "featured_products_section_home_page_id_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_collections" ADD CONSTRAINT "hero_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_collections" ADD CONSTRAINT "hero_collections_hero_link_id_hero_links_id_fk" FOREIGN KEY ("hero_link_id") REFERENCES "hero_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_links" ADD CONSTRAINT "hero_links_hero_section_id_hero_sections_id_fk" FOREIGN KEY ("hero_section_id") REFERENCES "hero_sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_products" ADD CONSTRAINT "hero_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_products" ADD CONSTRAINT "hero_products_hero_link_id_hero_links_id_fk" FOREIGN KEY ("hero_link_id") REFERENCES "hero_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_sections" ADD CONSTRAINT "hero_sections_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hero_sections" ADD CONSTRAINT "hero_sections_home_page_id_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "main_collections" ADD CONSTRAINT "main_collections_home_page_id_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referred_collections" ADD CONSTRAINT "referred_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referred_collections" ADD CONSTRAINT "referred_collections_main_collection_id_main_collections_id_fk" FOREIGN KEY ("main_collection_id") REFERENCES "main_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referred_products" ADD CONSTRAINT "referred_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "referred_products" ADD CONSTRAINT "referred_products_featured_products_section_id_featured_products_section_id_fk" FOREIGN KEY ("featured_products_section_id") REFERENCES "featured_products_section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
