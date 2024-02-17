import { customPgTable } from '../utils';
import { varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { collections } from './collections';
import { heroLinks } from './heroLinks';
import { type getHeroCollections } from '@/lib/api/heroCollections/queries';

import { nanoid } from '@/lib/utils';

export const heroCollections = customPgTable('hero_collections', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  collectionId: varchar('collection_id', { length: 256 })
    .references(() => collections.id, { onDelete: 'cascade' })
    .notNull(),
  heroLinkId: varchar('hero_link_id', { length: 256 })
    .references(() => heroLinks.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for heroCollections - used to validate API requests
const baseSchema = createSelectSchema(heroCollections);

export const insertHeroCollectionSchema = createInsertSchema(heroCollections);
export const insertHeroCollectionParams = baseSchema
  .extend({
    collectionId: z.coerce.string().min(1),
    heroLinkId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateHeroCollectionSchema = baseSchema;
export const updateHeroCollectionParams = baseSchema.extend({
  collectionId: z.coerce.string().min(1),
  heroLinkId: z.coerce.string().min(1),
});
export const heroCollectionIdSchema = baseSchema.pick({ id: true });

// Types for heroCollections - used to type API request params and within Components
export type HeroCollection = typeof heroCollections.$inferSelect;
export type NewHeroCollection = z.infer<typeof insertHeroCollectionSchema>;
export type NewHeroCollectionParams = z.infer<
  typeof insertHeroCollectionParams
>;
export type UpdateHeroCollectionParams = z.infer<
  typeof updateHeroCollectionParams
>;
export type HeroCollectionId = z.infer<typeof heroCollectionIdSchema>['id'];

// this type infers the return from getHeroCollections() - meaning it will include any joins
export type CompleteHeroCollection = Awaited<
  ReturnType<typeof getHeroCollections>
>['heroCollections'][number];
