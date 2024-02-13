import { text, varchar, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { heroSections } from './heroSections';
import { type getHeroLinks } from '@/lib/api/heroLinks/queries';

import { nanoid } from '@/lib/utils';

export const heroLinks = pgTable('hero_links', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  type: text('type').notNull(),
  heroSectionId: varchar('hero_section_id', { length: 256 })
    .references(() => heroSections.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for heroLinks - used to validate API requests
const baseSchema = createSelectSchema(heroLinks);

export const insertHeroLinkSchema = createInsertSchema(heroLinks);
export const insertHeroLinkParams = baseSchema
  .extend({
    heroSectionId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateHeroLinkSchema = baseSchema;
export const updateHeroLinkParams = baseSchema.extend({
  heroSectionId: z.coerce.string().min(1),
});
export const heroLinkIdSchema = baseSchema.pick({ id: true });

// Types for heroLinks - used to type API request params and within Components
export type HeroLink = typeof heroLinks.$inferSelect;
export type NewHeroLink = z.infer<typeof insertHeroLinkSchema>;
export type NewHeroLinkParams = z.infer<typeof insertHeroLinkParams>;
export type UpdateHeroLinkParams = z.infer<typeof updateHeroLinkParams>;
export type HeroLinkId = z.infer<typeof heroLinkIdSchema>['id'];

// this type infers the return from getHeroLinks() - meaning it will include any joins
export type CompleteHeroLink = Awaited<
  ReturnType<typeof getHeroLinks>
>['heroLinks'][number];
