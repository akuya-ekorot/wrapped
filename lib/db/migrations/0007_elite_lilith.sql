DO $$ BEGIN
 CREATE TYPE "collection_status" AS ENUM('active', 'draft');
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
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE order_status USING "status"::order_status;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "type" SET DATA TYPE order_type USING "type"::order_type;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DATA TYPE product_status USING "status"::product_status;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'active'::product_status;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "status" "collection_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "status" "variant_status" DEFAULT 'active' NOT NULL;
