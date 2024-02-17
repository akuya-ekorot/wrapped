import { customPgTable } from '../utils';
import { varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { heroLinks } from './heroLinks';
import { type getHeroProducts } from '@/lib/api/heroProducts/queries';

import { nanoid } from '@/lib/utils';

export const heroProducts = customPgTable('hero_products', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: varchar('product_id', { length: 256 })
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  heroLinkId: varchar('hero_link_id', { length: 256 })
    .references(() => heroLinks.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for heroProducts - used to validate API requests
const baseSchema = createSelectSchema(heroProducts);

export const insertHeroProductSchema = createInsertSchema(heroProducts);
export const insertHeroProductParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    heroLinkId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateHeroProductSchema = baseSchema;
export const updateHeroProductParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  heroLinkId: z.coerce.string().min(1),
});
export const heroProductIdSchema = baseSchema.pick({ id: true });

// Types for heroProducts - used to type API request params and within Components
export type HeroProduct = typeof heroProducts.$inferSelect;
export type NewHeroProduct = z.infer<typeof insertHeroProductSchema>;
export type NewHeroProductParams = z.infer<typeof insertHeroProductParams>;
export type UpdateHeroProductParams = z.infer<typeof updateHeroProductParams>;
export type HeroProductId = z.infer<typeof heroProductIdSchema>['id'];

// this type infers the return from getHeroProducts() - meaning it will include any joins
export type CompleteHeroProduct = Awaited<
  ReturnType<typeof getHeroProducts>
>['heroProducts'][number];
