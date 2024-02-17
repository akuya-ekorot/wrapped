CREATE TABLE IF NOT EXISTS "link_to_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"page_link_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link_to_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"page_link_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "page_links" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_collections" ADD CONSTRAINT "link_to_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_collections" ADD CONSTRAINT "link_to_collections_page_link_id_page_links_id_fk" FOREIGN KEY ("page_link_id") REFERENCES "page_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_products" ADD CONSTRAINT "link_to_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link_to_products" ADD CONSTRAINT "link_to_products_page_link_id_page_links_id_fk" FOREIGN KEY ("page_link_id") REFERENCES "page_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
