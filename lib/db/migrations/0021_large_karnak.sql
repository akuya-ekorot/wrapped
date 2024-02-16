CREATE TABLE IF NOT EXISTS "customer_addresses" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"extra_details" text,
	"phone" text NOT NULL,
	"postal_code" text,
	"delivery_zone_id" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_delivery_zone_id_delivery_zones_id_fk" FOREIGN KEY ("delivery_zone_id") REFERENCES "delivery_zones"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
