ALTER TABLE "customer_addresses" RENAME TO "customers";--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "customer_addresses_delivery_zone_id_delivery_zones_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" DROP CONSTRAINT "customer_addresses_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN IF EXISTS "delivery_zone_id";