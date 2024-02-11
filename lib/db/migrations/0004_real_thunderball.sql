CREATE TABLE IF NOT EXISTS "payments" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"reference" text NOT NULL,
	"status" text NOT NULL,
	"amount" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "payment_reference_idx" ON "payments" ("reference");