import { sql } from 'drizzle-orm';
import { varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { tags } from './tags';
import { products } from './products';
import { type getProductTags } from '@/lib/api/productTags/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const productTags = pgTable('product_tags', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  tagId: varchar('tag_id', { length: 256 })
    .references(() => tags.id, { onDelete: 'cascade' })
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
});

// Schema for productTags - used to validate API requests
const baseSchema = createSelectSchema(productTags).omit(timestamps);

export const insertProductTagSchema =
  createInsertSchema(productTags).omit(timestamps);
export const insertProductTagParams = baseSchema
  .extend({
    tagId: z.coerce.string().min(1),
    productId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateProductTagSchema = baseSchema;
export const updateProductTagParams = baseSchema.extend({
  tagId: z.coerce.string().min(1),
  productId: z.coerce.string().min(1),
});
export const productTagIdSchema = baseSchema.pick({ id: true });

// Types for productTags - used to type API request params and within Components
export type ProductTag = typeof productTags.$inferSelect;
export type NewProductTag = z.infer<typeof insertProductTagSchema>;
export type NewProductTagParams = z.infer<typeof insertProductTagParams>;
export type UpdateProductTagParams = z.infer<typeof updateProductTagParams>;
export type ProductTagId = z.infer<typeof productTagIdSchema>['id'];

// this type infers the return from getProductTags() - meaning it will include any joins
export type CompleteProductTag = Awaited<
  ReturnType<typeof getProductTags>
>['productTags'][number];
