import { varchar, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { collections } from './collections';
import { mainCollections } from './mainCollections';
import { type getReferredCollections } from '@/lib/api/referredCollections/queries';

import { nanoid } from '@/lib/utils';

export const referredCollections = pgTable('referred_collections', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  collectionId: varchar('collection_id', { length: 256 })
    .references(() => collections.id, { onDelete: 'cascade' })
    .notNull(),
  mainCollectionId: varchar('main_collection_id', { length: 256 })
    .references(() => mainCollections.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for referredCollections - used to validate API requests
const baseSchema = createSelectSchema(referredCollections);

export const insertReferredCollectionSchema =
  createInsertSchema(referredCollections);
export const insertReferredCollectionParams = baseSchema
  .extend({
    collectionId: z.coerce.string().min(1),
    mainCollectionId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateReferredCollectionSchema = baseSchema;
export const updateReferredCollectionParams = baseSchema.extend({
  collectionId: z.coerce.string().min(1),
  mainCollectionId: z.coerce.string().min(1),
});
export const referredCollectionIdSchema = baseSchema.pick({ id: true });

// Types for referredCollections - used to type API request params and within Components
export type ReferredCollection = typeof referredCollections.$inferSelect;
export type NewReferredCollection = z.infer<
  typeof insertReferredCollectionSchema
>;
export type NewReferredCollectionParams = z.infer<
  typeof insertReferredCollectionParams
>;
export type UpdateReferredCollectionParams = z.infer<
  typeof updateReferredCollectionParams
>;
export type ReferredCollectionId = z.infer<
  typeof referredCollectionIdSchema
>['id'];

// this type infers the return from getReferredCollections() - meaning it will include any joins
export type CompleteReferredCollection = Awaited<
  ReturnType<typeof getReferredCollections>
>['referredCollections'][number];
