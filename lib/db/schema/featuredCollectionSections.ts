import { text, varchar, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { images } from './images';
import { collections } from './collections';
import { homePages } from './homePages';
import { type getFeaturedCollectionSections } from '@/lib/api/featuredCollectionSections/queries';

import { nanoid } from '@/lib/utils';

export const featuredCollectionSections = pgTable(
  'featured_collection_sections',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    title: text('title').notNull(),
    callToAction: text('call_to_action'),
    imageId: varchar('image_id', { length: 256 })
      .references(() => images.id)
      .notNull(),
    collectionId: varchar('collection_id', { length: 256 })
      .references(() => collections.id, { onDelete: 'cascade' })
      .notNull(),
    homePageId: varchar('home_page_id', { length: 256 })
      .references(() => homePages.id, { onDelete: 'cascade' })
      .notNull(),
  },
);

// Schema for featuredCollectionSections - used to validate API requests
const baseSchema = createSelectSchema(featuredCollectionSections);

export const insertFeaturedCollectionSectionSchema = createInsertSchema(
  featuredCollectionSections,
);
export const insertFeaturedCollectionSectionParams = baseSchema
  .extend({
    imageId: z.coerce.string().min(1),
    collectionId: z.coerce.string().min(1),
    homePageId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateFeaturedCollectionSectionSchema = baseSchema;
export const updateFeaturedCollectionSectionParams = baseSchema.extend({
  imageId: z.coerce.string().min(1),
  collectionId: z.coerce.string().min(1),
  homePageId: z.coerce.string().min(1),
});
export const featuredCollectionSectionIdSchema = baseSchema.pick({ id: true });

// Types for featuredCollectionSections - used to type API request params and within Components
export type FeaturedCollectionSection =
  typeof featuredCollectionSections.$inferSelect;
export type NewFeaturedCollectionSection = z.infer<
  typeof insertFeaturedCollectionSectionSchema
>;
export type NewFeaturedCollectionSectionParams = z.infer<
  typeof insertFeaturedCollectionSectionParams
>;
export type UpdateFeaturedCollectionSectionParams = z.infer<
  typeof updateFeaturedCollectionSectionParams
>;
export type FeaturedCollectionSectionId = z.infer<
  typeof featuredCollectionSectionIdSchema
>['id'];

// this type infers the return from getFeaturedCollectionSections() - meaning it will include any joins
export type CompleteFeaturedCollectionSection = Awaited<
  ReturnType<typeof getFeaturedCollectionSections>
>['featuredCollectionSections'][number];
