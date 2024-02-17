import { sql } from 'drizzle-orm';
import { varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { collections } from './collections';
import { pageLinks } from './pageLinks';
import { type getLinkToCollections } from '@/lib/api/linkToCollections/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const linkToCollections = pgTable('link_to_collections', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  collectionId: varchar('collection_id', { length: 256 })
    .references(() => collections.id, { onDelete: 'cascade' })
    .notNull(),
  pageLinkId: varchar('page_link_id', { length: 256 })
    .references(() => pageLinks.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for linkToCollections - used to validate API requests
const baseSchema = createSelectSchema(linkToCollections).omit(timestamps);

export const insertLinkToCollectionSchema =
  createInsertSchema(linkToCollections).omit(timestamps);
export const insertLinkToCollectionParams = baseSchema
  .extend({
    collectionId: z.coerce.string().min(1),
    pageLinkId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateLinkToCollectionSchema = baseSchema;
export const updateLinkToCollectionParams = baseSchema.extend({
  collectionId: z.coerce.string().min(1),
  pageLinkId: z.coerce.string().min(1),
});
export const linkToCollectionIdSchema = baseSchema.pick({ id: true });

// Types for linkToCollections - used to type API request params and within Components
export type LinkToCollection = typeof linkToCollections.$inferSelect;
export type NewLinkToCollection = z.infer<typeof insertLinkToCollectionSchema>;
export type NewLinkToCollectionParams = z.infer<
  typeof insertLinkToCollectionParams
>;
export type UpdateLinkToCollectionParams = z.infer<
  typeof updateLinkToCollectionParams
>;
export type LinkToCollectionId = z.infer<typeof linkToCollectionIdSchema>['id'];

// this type infers the return from getLinkToCollections() - meaning it will include any joins
export type CompleteLinkToCollection = Awaited<
  ReturnType<typeof getLinkToCollections>
>['linkToCollections'][number];
