import { customPgTable } from '../utils';
import { sql } from 'drizzle-orm';
import { varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { options } from './options';
import { optionValues } from './optionValues';
import { variants } from './variants';
import { type getVariantOptions } from '@/lib/api/variantOptions/queries';

import { nanoid, timestamps } from '@/lib/utils';
import { products } from './products';

export const variantOptions = customPgTable(
  'variant_options',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    optionId: varchar('option_id', { length: 256 })
      .references(() => options.id, { onDelete: 'cascade' })
      .notNull(),
    optionValueId: varchar('option_value_id', { length: 256 })
      .references(() => optionValues.id, { onDelete: 'cascade' })
      .notNull(),
    variantId: varchar('variant_id', { length: 256 })
      .references(() => variants.id, { onDelete: 'cascade' })
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
  (variantOptions) => {
    return {
      optionIdIndex: uniqueIndex('variant_option_id_idx').on(
        variantOptions.optionId,
        variantOptions.variantId,
      ),
    };
  },
);

// Schema for variantOptions - used to validate API requests
const baseSchema = createSelectSchema(variantOptions).omit(timestamps);

export const insertVariantOptionSchema =
  createInsertSchema(variantOptions).omit(timestamps);
export const insertVariantOptionParams = baseSchema
  .extend({
    optionId: z.coerce.string().min(1),
    optionValueId: z.coerce.string().min(1),
    variantId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateVariantOptionSchema = baseSchema;
export const updateVariantOptionParams = baseSchema.extend({
  optionId: z.coerce.string().min(1),
  optionValueId: z.coerce.string().min(1),
  variantId: z.coerce.string().min(1),
});
export const variantOptionIdSchema = baseSchema.pick({ id: true });

// Types for variantOptions - used to type API request params and within Components
export type VariantOption = typeof variantOptions.$inferSelect;
export type NewVariantOption = z.infer<typeof insertVariantOptionSchema>;
export type NewVariantOptionParams = z.infer<typeof insertVariantOptionParams>;
export type UpdateVariantOptionParams = z.infer<
  typeof updateVariantOptionParams
>;
export type VariantOptionId = z.infer<typeof variantOptionIdSchema>['id'];

// this type infers the return from getVariantOptions() - meaning it will include any joins
export type CompleteVariantOption = Awaited<
  ReturnType<typeof getVariantOptions>
>['variantOptions'][number];
