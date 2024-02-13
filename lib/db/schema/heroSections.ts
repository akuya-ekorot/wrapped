import { text, varchar, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { images } from './images';
import { homePages } from './homePages';
import { type getHeroSections } from '@/lib/api/heroSections/queries';

import { nanoid } from '@/lib/utils';

export const heroSections = pgTable('hero_sections', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  title: text('title').notNull(),
  callToAction: text('call_to_action'),
  imageId: varchar('image_id', { length: 256 })
    .references(() => images.id)
    .notNull(),
  homePageId: varchar('home_page_id', { length: 256 })
    .references(() => homePages.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for heroSections - used to validate API requests
const baseSchema = createSelectSchema(heroSections);

export const insertHeroSectionSchema = createInsertSchema(heroSections);
export const insertHeroSectionParams = baseSchema
  .extend({
    imageId: z.coerce.string().min(1),
    homePageId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateHeroSectionSchema = baseSchema;
export const updateHeroSectionParams = baseSchema.extend({
  imageId: z.coerce.string().min(1),
  homePageId: z.coerce.string().min(1),
});
export const heroSectionIdSchema = baseSchema.pick({ id: true });

// Types for heroSections - used to type API request params and within Components
export type HeroSection = typeof heroSections.$inferSelect;
export type NewHeroSection = z.infer<typeof insertHeroSectionSchema>;
export type NewHeroSectionParams = z.infer<typeof insertHeroSectionParams>;
export type UpdateHeroSectionParams = z.infer<typeof updateHeroSectionParams>;
export type HeroSectionId = z.infer<typeof heroSectionIdSchema>['id'];

// this type infers the return from getHeroSections() - meaning it will include any joins
export type CompleteHeroSection = Awaited<
  ReturnType<typeof getHeroSections>
>['heroSections'][number];
