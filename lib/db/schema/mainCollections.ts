import { customPgTable } from '../utils';
import { text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { homePages } from './homePages';
import { type getMainCollections } from '@/lib/api/mainCollections/queries';

import { nanoid } from '@/lib/utils';

export const mainCollections = customPgTable('main_collections', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  homePageId: varchar('home_page_id', { length: 256 })
    .references(() => homePages.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for mainCollections - used to validate API requests
const baseSchema = createSelectSchema(mainCollections);

export const insertMainCollectionSchema = createInsertSchema(mainCollections);
export const insertMainCollectionParams = baseSchema
  .extend({
    homePageId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateMainCollectionSchema = baseSchema;
export const updateMainCollectionParams = baseSchema.extend({
  homePageId: z.coerce.string().min(1),
});
export const mainCollectionIdSchema = baseSchema.pick({ id: true });

// Types for mainCollections - used to type API request params and within Components
export type MainCollection = typeof mainCollections.$inferSelect;
export type NewMainCollection = z.infer<typeof insertMainCollectionSchema>;
export type NewMainCollectionParams = z.infer<
  typeof insertMainCollectionParams
>;
export type UpdateMainCollectionParams = z.infer<
  typeof updateMainCollectionParams
>;
export type MainCollectionId = z.infer<typeof mainCollectionIdSchema>['id'];

// this type infers the return from getMainCollections() - meaning it will include any joins
export type CompleteMainCollection = Awaited<
  ReturnType<typeof getMainCollections>
>['mainCollections'][number];
