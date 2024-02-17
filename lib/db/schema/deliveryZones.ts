import { sql } from 'drizzle-orm';
import { text, real, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getDeliveryZones } from '@/lib/api/deliveryZones/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const deliveryZones = pgTable('delivery_zones', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  deliveryCost: real('delivery_cost').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for deliveryZones - used to validate API requests
const baseSchema = createSelectSchema(deliveryZones).omit(timestamps);

export const insertDeliveryZoneSchema =
  createInsertSchema(deliveryZones).omit(timestamps);
export const insertDeliveryZoneParams = baseSchema
  .extend({
    deliveryCost: z.coerce.number(),
  })
  .omit({
    id: true,
  });

export const updateDeliveryZoneSchema = baseSchema;
export const updateDeliveryZoneParams = baseSchema.extend({
  deliveryCost: z.coerce.number(),
});
export const deliveryZoneIdSchema = baseSchema.pick({ id: true });

// Types for deliveryZones - used to type API request params and within Components
export type DeliveryZone = typeof deliveryZones.$inferSelect;
export type NewDeliveryZone = z.infer<typeof insertDeliveryZoneSchema>;
export type NewDeliveryZoneParams = z.infer<typeof insertDeliveryZoneParams>;
export type UpdateDeliveryZoneParams = z.infer<typeof updateDeliveryZoneParams>;
export type DeliveryZoneId = z.infer<typeof deliveryZoneIdSchema>['id'];

// this type infers the return from getDeliveryZones() - meaning it will include any joins
export type CompleteDeliveryZone = Awaited<
  ReturnType<typeof getDeliveryZones>
>['deliveryZones'][number];
