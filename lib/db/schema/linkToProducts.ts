import { sql } from 'drizzle-orm';
import { varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { pageLinks } from './pageLinks';
import { type getLinkToProducts } from '@/lib/api/linkToProducts/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const linkToProducts = pgTable('link_to_products', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: varchar('product_id', { length: 256 })
    .references(() => products.id, { onDelete: 'cascade' })
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

// Schema for linkToProducts - used to validate API requests
const baseSchema = createSelectSchema(linkToProducts).omit(timestamps);

export const insertLinkToProductSchema =
  createInsertSchema(linkToProducts).omit(timestamps);
export const insertLinkToProductParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    pageLinkId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateLinkToProductSchema = baseSchema;
export const updateLinkToProductParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  pageLinkId: z.coerce.string().min(1),
});
export const linkToProductIdSchema = baseSchema.pick({ id: true });

// Types for linkToProducts - used to type API request params and within Components
export type LinkToProduct = typeof linkToProducts.$inferSelect;
export type NewLinkToProduct = z.infer<typeof insertLinkToProductSchema>;
export type NewLinkToProductParams = z.infer<typeof insertLinkToProductParams>;
export type UpdateLinkToProductParams = z.infer<
  typeof updateLinkToProductParams
>;
export type LinkToProductId = z.infer<typeof linkToProductIdSchema>['id'];

// this type infers the return from getLinkToProducts() - meaning it will include any joins
export type CompleteLinkToProduct = Awaited<
  ReturnType<typeof getLinkToProducts>
>['linkToProducts'][number];
