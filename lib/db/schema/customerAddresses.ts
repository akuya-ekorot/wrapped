import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from '@/lib/db/schema/auth';
import { type getCustomerAddresses } from '@/lib/api/customerAddresses/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const customerAddresses = pgTable('customer_addresses', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  country: text('country').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  extraDetails: text('extra_details'),
  phone: text('phone').notNull(),
  postalCode: text('postal_code'),
  userId: varchar('user_id', { length: 256 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for customerAddresses - used to validate API requests
const baseSchema = createSelectSchema(customerAddresses).omit(timestamps);

export const insertCustomerAddressSchema =
  createInsertSchema(customerAddresses).omit(timestamps);
export const insertCustomerAddressParams = baseSchema
  .extend({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required'),
    extraDetails: z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    postalCode: z.string().optional(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateCustomerAddressSchema = baseSchema;
export const updateCustomerAddressParams = baseSchema.extend({}).omit({
  userId: true,
});
export const customerAddressIdSchema = baseSchema.pick({ id: true });

// Types for customerAddresses - used to type API request params and within Components
export type CustomerAddress = typeof customerAddresses.$inferSelect;
export type NewCustomerAddress = z.infer<typeof insertCustomerAddressSchema>;
export type NewCustomerAddressParams = z.infer<
  typeof insertCustomerAddressParams
>;
export type UpdateCustomerAddressParams = z.infer<
  typeof updateCustomerAddressParams
>;
export type CustomerAddressId = z.infer<typeof customerAddressIdSchema>['id'];

// this type infers the return from getCustomerAddresses() - meaning it will include any joins
export type CompleteCustomerAddress = Awaited<
  ReturnType<typeof getCustomerAddresses>
>['customerAddresses'][number];
