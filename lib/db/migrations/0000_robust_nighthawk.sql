DO $$ BEGIN
 CREATE TYPE "collection_status" AS ENUM('active', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "hero_link_types" AS ENUM('collection', 'product');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "order_status" AS ENUM('payment_pending', 'payment_paid', 'payment_failed', 'processing', 'ready_for_pickup', 'picked_up', 'shipped', 'delivered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "order_type" AS ENUM('pickup', 'delivery');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "product_status" AS ENUM('active', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "variant_status" AS ENUM('active', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "WRAPPED_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "WRAPPED_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_collection_images" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"image_id" varchar(256) NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"status" "collection_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_customers" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"extra_details" text,
	"phone" text NOT NULL,
	"postal_code" text,
	"user_id" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_delivery_zones" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"delivery_cost" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_featured_collection_sections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"call_to_action" text,
	"image_id" varchar(256) NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_featured_products_section" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_hero_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"hero_link_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_hero_links" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"type" "hero_link_types" NOT NULL,
	"hero_section_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_hero_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"hero_link_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_hero_sections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"call_to_action" text,
	"image_id" varchar(256) NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_home_pages" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_images" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_link_to_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"page_link_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_link_to_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"page_link_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_main_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"home_page_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_option_values" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"option_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_options" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"product_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_order_items" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"quantity" integer NOT NULL,
	"amount" real NOT NULL,
	"variant_id" varchar(256) NOT NULL,
	"order_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_orders" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"status" "order_status" NOT NULL,
	"type" "order_type" NOT NULL,
	"delivery_zone_id" varchar(256),
	"payment_id" varchar(256) NOT NULL,
	"notes" text,
	"amount" real NOT NULL,
	"user_id" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_page_links" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_payments" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"status" text NOT NULL,
	"amount" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_product_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_product_images" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"image_id" varchar(256) NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_product_tags" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"tag_id" varchar(256) NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_referred_collections" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"collection_id" varchar(256) NOT NULL,
	"main_collection_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_referred_products" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"featured_products_section_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_tags" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_variant_images" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_image_id" varchar(256) NOT NULL,
	"variant_id" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_variant_options" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"option_id" varchar(256) NOT NULL,
	"option_value_id" varchar(256) NOT NULL,
	"variant_id" varchar(256) NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "WRAPPED_variants" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"product_id" varchar(256) NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" real,
	"status" "variant_status" DEFAULT 'active' NOT NULL,
	"is_complete" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "collection_slug_idx" ON "WRAPPED_collections" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "image_url_idx" ON "WRAPPED_images" ("url");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payment_reference_idx" ON "WRAPPED_payments" ("reference");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_collection_unique_idx" ON "WRAPPED_product_collections" ("collection_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_slug_idx" ON "WRAPPED_products" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tag_name_idx" ON "WRAPPED_tags" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "variant_option_id_idx" ON "WRAPPED_variant_options" ("option_id","variant_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_account" ADD CONSTRAINT "WRAPPED_account_userId_WRAPPED_user_id_fk" FOREIGN KEY ("userId") REFERENCES "WRAPPED_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_session" ADD CONSTRAINT "WRAPPED_session_userId_WRAPPED_user_id_fk" FOREIGN KEY ("userId") REFERENCES "WRAPPED_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_collection_images" ADD CONSTRAINT "WRAPPED_collection_images_image_id_WRAPPED_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "WRAPPED_images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_collection_images" ADD CONSTRAINT "WRAPPED_collection_images_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_customers" ADD CONSTRAINT "WRAPPED_customers_user_id_WRAPPED_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "WRAPPED_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_featured_collection_sections" ADD CONSTRAINT "WRAPPED_featured_collection_sections_image_id_WRAPPED_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "WRAPPED_images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_featured_collection_sections" ADD CONSTRAINT "WRAPPED_featured_collection_sections_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_featured_collection_sections" ADD CONSTRAINT "WRAPPED_featured_collection_sections_home_page_id_WRAPPED_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "WRAPPED_home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_featured_products_section" ADD CONSTRAINT "WRAPPED_featured_products_section_home_page_id_WRAPPED_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "WRAPPED_home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_collections" ADD CONSTRAINT "WRAPPED_hero_collections_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_collections" ADD CONSTRAINT "WRAPPED_hero_collections_hero_link_id_WRAPPED_hero_links_id_fk" FOREIGN KEY ("hero_link_id") REFERENCES "WRAPPED_hero_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_links" ADD CONSTRAINT "WRAPPED_hero_links_hero_section_id_WRAPPED_hero_sections_id_fk" FOREIGN KEY ("hero_section_id") REFERENCES "WRAPPED_hero_sections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_products" ADD CONSTRAINT "WRAPPED_hero_products_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_products" ADD CONSTRAINT "WRAPPED_hero_products_hero_link_id_WRAPPED_hero_links_id_fk" FOREIGN KEY ("hero_link_id") REFERENCES "WRAPPED_hero_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_sections" ADD CONSTRAINT "WRAPPED_hero_sections_image_id_WRAPPED_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "WRAPPED_images"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_hero_sections" ADD CONSTRAINT "WRAPPED_hero_sections_home_page_id_WRAPPED_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "WRAPPED_home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_link_to_collections" ADD CONSTRAINT "WRAPPED_link_to_collections_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_link_to_collections" ADD CONSTRAINT "WRAPPED_link_to_collections_page_link_id_WRAPPED_page_links_id_fk" FOREIGN KEY ("page_link_id") REFERENCES "WRAPPED_page_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_link_to_products" ADD CONSTRAINT "WRAPPED_link_to_products_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_link_to_products" ADD CONSTRAINT "WRAPPED_link_to_products_page_link_id_WRAPPED_page_links_id_fk" FOREIGN KEY ("page_link_id") REFERENCES "WRAPPED_page_links"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_main_collections" ADD CONSTRAINT "WRAPPED_main_collections_home_page_id_WRAPPED_home_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "WRAPPED_home_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_option_values" ADD CONSTRAINT "WRAPPED_option_values_option_id_WRAPPED_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "WRAPPED_options"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_options" ADD CONSTRAINT "WRAPPED_options_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_order_items" ADD CONSTRAINT "WRAPPED_order_items_variant_id_WRAPPED_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "WRAPPED_variants"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_order_items" ADD CONSTRAINT "WRAPPED_order_items_order_id_WRAPPED_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "WRAPPED_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_order_items" ADD CONSTRAINT "WRAPPED_order_items_user_id_WRAPPED_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "WRAPPED_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_orders" ADD CONSTRAINT "WRAPPED_orders_delivery_zone_id_WRAPPED_delivery_zones_id_fk" FOREIGN KEY ("delivery_zone_id") REFERENCES "WRAPPED_delivery_zones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_orders" ADD CONSTRAINT "WRAPPED_orders_payment_id_WRAPPED_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "WRAPPED_payments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_orders" ADD CONSTRAINT "WRAPPED_orders_user_id_WRAPPED_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "WRAPPED_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_collections" ADD CONSTRAINT "WRAPPED_product_collections_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_collections" ADD CONSTRAINT "WRAPPED_product_collections_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_images" ADD CONSTRAINT "WRAPPED_product_images_image_id_WRAPPED_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "WRAPPED_images"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_images" ADD CONSTRAINT "WRAPPED_product_images_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_tags" ADD CONSTRAINT "WRAPPED_product_tags_tag_id_WRAPPED_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "WRAPPED_tags"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_product_tags" ADD CONSTRAINT "WRAPPED_product_tags_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_referred_collections" ADD CONSTRAINT "WRAPPED_referred_collections_collection_id_WRAPPED_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "WRAPPED_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_referred_collections" ADD CONSTRAINT "WRAPPED_referred_collections_main_collection_id_WRAPPED_main_collections_id_fk" FOREIGN KEY ("main_collection_id") REFERENCES "WRAPPED_main_collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_referred_products" ADD CONSTRAINT "WRAPPED_referred_products_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_referred_products" ADD CONSTRAINT "WRAPPED_referred_products_featured_products_section_id_WRAPPED_featured_products_section_id_fk" FOREIGN KEY ("featured_products_section_id") REFERENCES "WRAPPED_featured_products_section"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_images" ADD CONSTRAINT "WRAPPED_variant_images_product_image_id_WRAPPED_product_images_id_fk" FOREIGN KEY ("product_image_id") REFERENCES "WRAPPED_product_images"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_images" ADD CONSTRAINT "WRAPPED_variant_images_variant_id_WRAPPED_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "WRAPPED_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_options" ADD CONSTRAINT "WRAPPED_variant_options_option_id_WRAPPED_options_id_fk" FOREIGN KEY ("option_id") REFERENCES "WRAPPED_options"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_options" ADD CONSTRAINT "WRAPPED_variant_options_option_value_id_WRAPPED_option_values_id_fk" FOREIGN KEY ("option_value_id") REFERENCES "WRAPPED_option_values"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_options" ADD CONSTRAINT "WRAPPED_variant_options_variant_id_WRAPPED_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "WRAPPED_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variant_options" ADD CONSTRAINT "WRAPPED_variant_options_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_variants" ADD CONSTRAINT "WRAPPED_variants_product_id_WRAPPED_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "WRAPPED_products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
