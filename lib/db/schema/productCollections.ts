import { sql } from 'drizzle-orm';
import { varchar, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { collections } from './collections';
import { products } from './products';
import { type getProductCollections } from '@/lib/api/productCollections/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const productCollections = pgTable(
  'product_collections',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    collectionId: varchar('collection_id', { length: 256 })
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
    productId: varchar('product_id', { length: 256 })
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (t) => ({
    uniqueIndex: uniqueIndex('product_collection_unique_idx').on(
      t.collectionId,
      t.productId,
    ),
  }),
);

// Schema for productCollections - used to validate API requests
const baseSchema = createSelectSchema(productCollections).omit(timestamps);

export const insertProductCollectionSchema =
  createInsertSchema(productCollections).omit(timestamps);
export const insertProductCollectionParams = baseSchema
  .extend({
    collectionId: z.coerce.string().min(1),
    productId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateProductCollectionSchema = baseSchema;
export const updateProductCollectionParams = baseSchema.extend({
  collectionId: z.coerce.string().min(1),
  productId: z.coerce.string().min(1),
});
export const productCollectionIdSchema = baseSchema.pick({ id: true });

// Types for productCollections - used to type API request params and within Components
export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = z.infer<
  typeof insertProductCollectionSchema
>;
export type NewProductCollectionParams = z.infer<
  typeof insertProductCollectionParams
>;
export type UpdateProductCollectionParams = z.infer<
  typeof updateProductCollectionParams
>;
export type ProductCollectionId = z.infer<
  typeof productCollectionIdSchema
>['id'];

// this type infers the return from getProductCollections() - meaning it will include any joins
export type CompleteProductCollection = Awaited<
  ReturnType<typeof getProductCollections>
>['productCollections'][number];
