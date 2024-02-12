import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getPageLinks } from '@/lib/api/pageLinks/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const pageLinks = pgTable('page_links', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  type: text('type').notNull(),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for pageLinks - used to validate API requests
const baseSchema = createSelectSchema(pageLinks).omit(timestamps);

export const insertPageLinkSchema =
  createInsertSchema(pageLinks).omit(timestamps);
export const insertPageLinkParams = baseSchema.extend({}).omit({
  id: true,
});

export const updatePageLinkSchema = baseSchema;
export const updatePageLinkParams = baseSchema.extend({});
export const pageLinkIdSchema = baseSchema.pick({ id: true });

// Types for pageLinks - used to type API request params and within Components
export type PageLink = typeof pageLinks.$inferSelect;
export type NewPageLink = z.infer<typeof insertPageLinkSchema>;
export type NewPageLinkParams = z.infer<typeof insertPageLinkParams>;
export type UpdatePageLinkParams = z.infer<typeof updatePageLinkParams>;
export type PageLinkId = z.infer<typeof pageLinkIdSchema>['id'];

// this type infers the return from getPageLinks() - meaning it will include any joins
export type CompletePageLink = Awaited<
  ReturnType<typeof getPageLinks>
>['pageLinks'][number];
