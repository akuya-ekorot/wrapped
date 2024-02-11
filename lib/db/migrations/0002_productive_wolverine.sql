CREATE TABLE IF NOT EXISTS "tags" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX IF EXISTS "url_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tag_name_idx" ON "tags" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "image_url_idx" ON "images" ("url");