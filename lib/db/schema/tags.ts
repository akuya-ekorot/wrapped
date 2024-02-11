import { sql } from "drizzle-orm";
import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getTags } from "@/lib/api/tags/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const tags = pgTable(
  "tags",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),

    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`now()`),
  },
  (tags) => {
    return {
      nameIndex: uniqueIndex("tag_name_idx").on(tags.name),
    };
  },
);

// Schema for tags - used to validate API requests
const baseSchema = createSelectSchema(tags).omit(timestamps);

export const insertTagSchema = createInsertSchema(tags).omit(timestamps);
export const insertTagParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateTagSchema = baseSchema;
export const updateTagParams = baseSchema.extend({});
export const tagIdSchema = baseSchema.pick({ id: true });

// Types for tags - used to type API request params and within Components
export type Tag = typeof tags.$inferSelect;
export type NewTag = z.infer<typeof insertTagSchema>;
export type NewTagParams = z.infer<typeof insertTagParams>;
export type UpdateTagParams = z.infer<typeof updateTagParams>;
export type TagId = z.infer<typeof tagIdSchema>["id"];

// this type infers the return from getTags() - meaning it will include any joins
export type CompleteTag = Awaited<ReturnType<typeof getTags>>["tags"][number];
