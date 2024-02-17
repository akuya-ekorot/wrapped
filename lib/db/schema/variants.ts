import { sql } from 'drizzle-orm';
import {
  varchar,
  text,
  real,
  timestamp,
  pgTable,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { type getVariants } from '@/lib/api/variants/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const variantStatus = pgEnum('variant_status', ['active', 'draft']);
export enum VariantStatus {
  Active = 'active',
  Draft = 'draft',
}

export const variants = pgTable('variants', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productId: varchar('product_id', { length: 256 })
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price'),
  status: variantStatus('status').notNull().default('active'),
  isComplete: boolean('is_complete'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for variants - used to validate API requests
const baseSchema = createSelectSchema(variants).omit(timestamps);

export const insertVariantSchema =
  createInsertSchema(variants).omit(timestamps);
export const insertVariantParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
    price: z.coerce.number(),
  })
  .omit({
    id: true,
  });

export const updateVariantSchema = baseSchema;
export const updateVariantParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
  price: z.coerce.number(),
});
export const variantIdSchema = baseSchema.pick({ id: true });

// Types for variants - used to type API request params and within Components
export type Variant = typeof variants.$inferSelect;
export type NewVariant = z.infer<typeof insertVariantSchema>;
export type NewVariantParams = z.infer<typeof insertVariantParams>;
export type UpdateVariantParams = z.infer<typeof updateVariantParams>;
export type VariantId = z.infer<typeof variantIdSchema>['id'];

// this type infers the return from getVariants() - meaning it will include any joins
export type CompleteVariant = Awaited<
  ReturnType<typeof getVariants>
>['variants'][number];
