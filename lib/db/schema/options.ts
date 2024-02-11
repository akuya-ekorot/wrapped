import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { products } from './products';
import { type getOptions } from '@/lib/api/options/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const options = pgTable('options', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
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

// Schema for options - used to validate API requests
const baseSchema = createSelectSchema(options).omit(timestamps);

export const insertOptionSchema = createInsertSchema(options).omit(timestamps);
export const insertOptionParams = baseSchema
  .extend({
    productId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateOptionSchema = baseSchema;
export const updateOptionParams = baseSchema.extend({
  productId: z.coerce.string().min(1),
});
export const optionIdSchema = baseSchema.pick({ id: true });

// Types for options - used to type API request params and within Components
export type Option = typeof options.$inferSelect;
export type NewOption = z.infer<typeof insertOptionSchema>;
export type NewOptionParams = z.infer<typeof insertOptionParams>;
export type UpdateOptionParams = z.infer<typeof updateOptionParams>;
export type OptionId = z.infer<typeof optionIdSchema>['id'];

// this type infers the return from getOptions() - meaning it will include any joins
export type CompleteOption = Awaited<
  ReturnType<typeof getOptions>
>['options'][number];
