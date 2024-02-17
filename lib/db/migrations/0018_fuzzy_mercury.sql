DROP INDEX IF EXISTS "variant_option_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "variant_option_id_idx" ON "variant_options" ("option_value_id","variant_id");