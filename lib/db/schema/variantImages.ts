import { customPgTable } from '../utils';
import { varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { productImages } from './productImages';
import { variants } from './variants';
import { type getVariantImages } from '@/lib/api/variantImages/queries';

import { nanoid } from '@/lib/utils';

export const variantImages = customPgTable('variant_images', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  productImageId: varchar('product_image_id', { length: 256 })
    .references(() => productImages.id, { onDelete: 'cascade' })
    .notNull(),
  variantId: varchar('variant_id', { length: 256 })
    .references(() => variants.id, { onDelete: 'cascade' })
    .notNull(),
});

// Schema for variantImages - used to validate API requests
const baseSchema = createSelectSchema(variantImages);

export const insertVariantImageSchema = createInsertSchema(variantImages);
export const insertVariantImageParams = baseSchema
  .extend({
    productImageId: z.coerce.string().min(1),
    variantId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
  });

export const updateVariantImageSchema = baseSchema;
export const updateVariantImageParams = baseSchema.extend({
  productImageId: z.coerce.string().min(1),
  variantId: z.coerce.string().min(1),
});
export const variantImageIdSchema = baseSchema.pick({ id: true });

// Types for variantImages - used to type API request params and within Components
export type VariantImage = typeof variantImages.$inferSelect;
export type NewVariantImage = z.infer<typeof insertVariantImageSchema>;
export type NewVariantImageParams = z.infer<typeof insertVariantImageParams>;
export type UpdateVariantImageParams = z.infer<typeof updateVariantImageParams>;
export type VariantImageId = z.infer<typeof variantImageIdSchema>['id'];

// this type infers the return from getVariantImages() - meaning it will include any joins
export type CompleteVariantImage = Awaited<
  ReturnType<typeof getVariantImages>
>['variantImages'][number];
