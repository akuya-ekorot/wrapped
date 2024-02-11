import { sql } from 'drizzle-orm';
import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getCollections } from '@/lib/api/collections/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const collectionStatus = pgEnum('collection_status', [
  'active',
  'draft',
]);
export enum CollectionStatus {
  Active = 'active',
  Draft = 'draft',
}

export const collections = pgTable(
  'collections',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text('name').notNull(),
    description: text('description'),
    slug: text('slug').notNull(),
    status: collectionStatus('status').notNull().default('active'),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (collections) => {
    return {
      slugIndex: uniqueIndex('collection_slug_idx').on(collections.slug),
    };
  },
);

// Schema for collections - used to validate API requests
const baseSchema = createSelectSchema(collections).omit(timestamps);

export const insertCollectionSchema =
  createInsertSchema(collections).omit(timestamps);
export const insertCollectionParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateCollectionSchema = baseSchema;
export const updateCollectionParams = baseSchema.extend({});
export const collectionIdSchema = baseSchema.pick({ id: true });

// Types for collections - used to type API request params and within Components
export type Collection = typeof collections.$inferSelect;
export type NewCollection = z.infer<typeof insertCollectionSchema>;
export type NewCollectionParams = z.infer<typeof insertCollectionParams>;
export type UpdateCollectionParams = z.infer<typeof updateCollectionParams>;
export type CollectionId = z.infer<typeof collectionIdSchema>['id'];

// this type infers the return from getCollections() - meaning it will include any joins
export type CompleteCollection = Awaited<
  ReturnType<typeof getCollections>
>['collections'][number];
