CREATE TABLE IF NOT EXISTS "delivery_zones" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"delivery_cost" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
