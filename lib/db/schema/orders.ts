import { customPgTable } from '../utils';
import { sql } from 'drizzle-orm';
import { text, varchar, real, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { deliveryZones } from './deliveryZones';
import { users } from '@/lib/db/schema/auth';
import { type getOrders } from '@/lib/api/orders/queries';

import { nanoid, timestamps } from '@/lib/utils';
import { payments } from './payments';
import { customers } from './customers';

export const orderStatus = pgEnum('order_status', [
  'payment_pending',
  'payment_paid',
  'payment_failed',
  'processing',
  'ready_for_pickup',
  'picked_up',
  'shipped',
  'delivered',
  'cancelled',
]);

export enum OrderStatus {
  'Payment Pending' = 'payment_pending',
  'Payment Paid' = 'payment_paid',
  'Payment Failed' = 'payment_failed',
  Processing = 'processing',
  'Ready For Pickup' = 'ready_for_pickup',
  'Picked Up' = 'picked_up',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export const orderType = pgEnum('order_type', ['pickup', 'delivery']);
export enum OrderType {
  Pickup = 'pickup',
  Delivery = 'delivery',
}

export const orders = customPgTable('orders', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  status: orderStatus('status').notNull(),
  type: orderType('type').notNull(),
  deliveryZoneId: varchar('delivery_zone_id', { length: 256 }).references(
    () => deliveryZones.id,
  ),
  paymentId: varchar('payment_id', { length: 256 })
    .references(() => payments.id)
    .notNull(),
  notes: text('notes'),
  amount: real('amount').notNull(),
  customerId: varchar('customer_id', { length: 256 }).references(
    () => customers.id,
    {
      onDelete: 'cascade',
    },
  ),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for orders - used to validate API requests
const baseSchema = createSelectSchema(orders).omit(timestamps);

export const insertOrderSchema = createInsertSchema(orders).omit(timestamps);
export const insertOrderParams = baseSchema
  .extend({
    deliveryZoneId: z.nullable(z.coerce.string()),
    amount: z.coerce.number(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateOrderSchema = baseSchema;
export const updateOrderParams = baseSchema
  .extend({
    deliveryZoneId: z.coerce.string().min(1).nullable(),
    amount: z.coerce.number(),
  })
  .omit({});
export const orderIdSchema = baseSchema.pick({ id: true });

// Types for orders - used to type API request params and within Components
export type Order = typeof orders.$inferSelect;
export type NewOrder = z.infer<typeof insertOrderSchema>;
export type NewOrderParams = z.infer<typeof insertOrderParams>;
export type UpdateOrderParams = z.infer<typeof updateOrderParams>;
export type OrderId = z.infer<typeof orderIdSchema>['id'];

// this type infers the return from getOrders() - meaning it will include any joins
export type CompleteOrder = Awaited<
  ReturnType<typeof getOrders>
>['orders'][number];
