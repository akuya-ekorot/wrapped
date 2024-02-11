import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { options } from './options';
import { type getOptionValues } from '@/lib/api/optionValues/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const optionValues = pgTable('option_values', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  optionId: varchar('option_id', { length: 256 })
    .references(() => options.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for optionValues - used to validate API requests
const baseSchema = createSelectSchema(optionValues).omit(timestamps);

export const insertOptionValueSchema =
  createInsertSchema(optionValues).omit(timestamps);
export const insertOptionValueParams = baseSchema
  .extend({
    optionId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateOptionValueSchema = baseSchema;
export const updateOptionValueParams = baseSchema.extend({
  optionId: z.coerce.string().min(1),
});
export const optionValueIdSchema = baseSchema.pick({ id: true });

// Types for optionValues - used to type API request params and within Components
export type OptionValue = typeof optionValues.$inferSelect;
export type NewOptionValue = z.infer<typeof insertOptionValueSchema>;
export type NewOptionValueParams = z.infer<typeof insertOptionValueParams>;
export type UpdateOptionValueParams = z.infer<typeof updateOptionValueParams>;
export type OptionValueId = z.infer<typeof optionValueIdSchema>['id'];

// this type infers the return from getOptionValues() - meaning it will include any joins
export type CompleteOptionValue = Awaited<
  ReturnType<typeof getOptionValues>
>['optionValues'][number];
