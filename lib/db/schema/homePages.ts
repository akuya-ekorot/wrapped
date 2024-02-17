import { customPgTable } from '../utils';
import { text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getHomePages } from '@/lib/api/homePages/queries';

import { nanoid } from '@/lib/utils';

export const homePages = customPgTable('home_pages', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  description: text('description'),
});

// Schema for homePages - used to validate API requests
const baseSchema = createSelectSchema(homePages);

export const insertHomePageSchema = createInsertSchema(homePages);
export const insertHomePageParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateHomePageSchema = baseSchema;
export const updateHomePageParams = baseSchema.extend({});
export const homePageIdSchema = baseSchema.pick({ id: true });

// Types for homePages - used to type API request params and within Components
export type HomePage = typeof homePages.$inferSelect;
export type NewHomePage = z.infer<typeof insertHomePageSchema>;
export type NewHomePageParams = z.infer<typeof insertHomePageParams>;
export type UpdateHomePageParams = z.infer<typeof updateHomePageParams>;
export type HomePageId = z.infer<typeof homePageIdSchema>['id'];

// this type infers the return from getHomePages() - meaning it will include any joins
export type CompleteHomePage = Awaited<
  ReturnType<typeof getHomePages>
>['homePages'][number];
