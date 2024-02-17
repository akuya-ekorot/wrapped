import { customPgTable } from '../utils';
import { text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { homePages } from './homePages';
import { type getFeaturedProductsSections } from '@/lib/api/featuredProductsSection/queries';

import { nanoid } from '@/lib/utils';

export const featuredProductsSection = customPgTable(
  'featured_products_section',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text('title').notNull(),
    homePageId: varchar('home_page_id', { length: 256 })
      .references(() => homePages.id, { onDelete: 'cascade' })
      .notNull(),
  },
);

// Schema for featuredProductsSection - used to validate API requests
const baseSchema = createSelectSchema(featuredProductsSection);

export const insertFeaturedProductsSectionSchema = createInsertSchema(
  featuredProductsSection,
);
export const insertFeaturedProductsSectionParams = baseSchema
  .extend({
    homePageId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateFeaturedProductsSectionSchema = baseSchema;
export const updateFeaturedProductsSectionParams = baseSchema.extend({
  homePageId: z.coerce.string().min(1),
});
export const featuredProductsSectionIdSchema = baseSchema.pick({ id: true });

// Types for featuredProductsSection - used to type API request params and within Components
export type FeaturedProductsSection =
  typeof featuredProductsSection.$inferSelect;
export type NewFeaturedProductsSection = z.infer<
  typeof insertFeaturedProductsSectionSchema
>;
export type NewFeaturedProductsSectionParams = z.infer<
  typeof insertFeaturedProductsSectionParams
>;
export type UpdateFeaturedProductsSectionParams = z.infer<
  typeof updateFeaturedProductsSectionParams
>;
export type FeaturedProductsSectionId = z.infer<
  typeof featuredProductsSectionIdSchema
>['id'];

// this type infers the return from getFeaturedProductsSection() - meaning it will include any joins
export type CompleteFeaturedProductsSection = Awaited<
  ReturnType<typeof getFeaturedProductsSections>
>['featuredProductsSection'][number];
