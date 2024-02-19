ALTER TABLE "content_blocks" RENAME TO "WRAPPED_content_blocks";--> statement-breakpoint
ALTER TABLE "pages" RENAME TO "WRAPPED_pages";--> statement-breakpoint
ALTER TABLE "WRAPPED_content_blocks" DROP CONSTRAINT "content_blocks_page_id_pages_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "WRAPPED_content_blocks" ADD CONSTRAINT "WRAPPED_content_blocks_page_id_WRAPPED_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "WRAPPED_pages"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
