import { customPgTable } from '../utils';
import { varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { featuredProductsSection } from './featuredProductsSection';
import { type getReferredProducts } from '@/lib/api/referredProducts/queries';

import { nanoid } from '@/lib/utils';

export const referredProducts = customPgTable('referred_products', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: varchar('product_id', { length: 256 })
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  featuredProductsSectionId: varchar('featured_products_section_id', {
    length: 256,
  })
    .references(() => featuredProductsSection.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for referredProducts - used to validate API requests
const baseSchema = createSelectSchema(referredProducts);

export const insertReferredProductSchema = createInsertSchema(referredProducts);
export const insertReferredProductParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    featuredProductsSectionId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateReferredProductSchema = baseSchema;
export const updateReferredProductParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  featuredProductsSectionId: z.coerce.string().min(1),
});
export const referredProductIdSchema = baseSchema.pick({ id: true });

// Types for referredProducts - used to type API request params and within Components
export type ReferredProduct = typeof referredProducts.$inferSelect;
export type NewReferredProduct = z.infer<typeof insertReferredProductSchema>;
export type NewReferredProductParams = z.infer<
  typeof insertReferredProductParams
>;
export type UpdateReferredProductParams = z.infer<
  typeof updateReferredProductParams
>;
export type ReferredProductId = z.infer<typeof referredProductIdSchema>['id'];

// this type infers the return from getReferredProducts() - meaning it will include any joins
export type CompleteReferredProduct = Awaited<
  ReturnType<typeof getReferredProducts>
>['referredProducts'][number];
