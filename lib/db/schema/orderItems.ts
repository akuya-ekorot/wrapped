import { customPgTable } from '../utils';
import { sql } from 'drizzle-orm';
import { integer, real, varchar, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { variants } from './variants';
import { orders } from './orders';
import { type getOrderItems } from '@/lib/api/orderItems/queries';

import { nanoid, timestamps } from '@/lib/utils';
import { products } from './products';

export const orderItems = customPgTable('order_items', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  quantity: integer('quantity').notNull(),
  amount: real('amount').notNull(),
  variantId: varchar('variant_id', { length: 256 }).references(
    () => variants.id,
  ),
  productId: varchar('product_id', { length: 256 }).references(
    () => products.id,
  ),
  orderId: varchar('order_id', { length: 256 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for orderItems - used to validate API requests
const baseSchema = createSelectSchema(orderItems).omit(timestamps);

export const insertOrderItemSchema =
  createInsertSchema(orderItems).omit(timestamps);
export const insertOrderItemParams = baseSchema
  .extend({
    quantity: z.coerce.number(),
    amount: z.coerce.number(),
    variantId: z.coerce.string().min(1).nullable(),
    productId: z.coerce.string().min(1).nullable(),
    orderId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateOrderItemSchema = baseSchema;
export const updateOrderItemParams = baseSchema
  .extend({
    quantity: z.coerce.number(),
    amount: z.coerce.number(),
    variantId: z.coerce.string().min(1).nullable(),
    productId: z.coerce.string().min(1).nullable(),
    orderId: z.coerce.string().min(1),
  })
  .omit({});
export const orderItemIdSchema = baseSchema.pick({ id: true });

// Types for orderItems - used to type API request params and within Components
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = z.infer<typeof insertOrderItemSchema>;
export type NewOrderItemParams = z.infer<typeof insertOrderItemParams>;
export type UpdateOrderItemParams = z.infer<typeof updateOrderItemParams>;
export type OrderItemId = z.infer<typeof orderItemIdSchema>['id'];

// this type infers the return from getOrderItems() - meaning it will include any joins
export type CompleteOrderItem = Awaited<
  ReturnType<typeof getOrderItems>
>['orderItems'][number];
