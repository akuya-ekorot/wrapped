import { sql } from 'drizzle-orm';
import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getImages } from '@/lib/api/images/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const images = pgTable(
  'images',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    url: text('url').notNull(),

    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (images) => {
    return {
      urlIndex: uniqueIndex('image_url_idx').on(images.url),
    };
  },
);

// Schema for images - used to validate API requests
const baseSchema = createSelectSchema(images).omit(timestamps);

export const insertImageSchema = createInsertSchema(images).omit(timestamps);
export const insertImageParams = baseSchema.extend({}).omit({
  id: true,
});

export const updateImageSchema = baseSchema;
export const updateImageParams = baseSchema.extend({});
export const imageIdSchema = baseSchema.pick({ id: true });

// Types for images - used to type API request params and within Components
export type TImage = typeof images.$inferSelect;
export type NewImage = z.infer<typeof insertImageSchema>;
export type NewImageParams = z.infer<typeof insertImageParams>;
export type UpdateImageParams = z.infer<typeof updateImageParams>;
export type ImageId = z.infer<typeof imageIdSchema>['id'];

// this type infers the return from getImages() - meaning it will include any joins
export type CompleteImage = Awaited<
  ReturnType<typeof getImages>
>['images'][number];
