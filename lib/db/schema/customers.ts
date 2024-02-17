import { sql } from 'drizzle-orm';
import { text, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from '@/lib/db/schema/auth';
import { type getCustomers } from '@/lib/api/customers/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const customers = pgTable('customers', {
  id: varchar('id', { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  extraDetails: text('extra_details'),
  phone: text('phone').notNull(),
  postalCode: text('postal_code'),
  userId: varchar('user_id', { length: 256 }).references(() => users.id, {
    onDelete: 'cascade',
  }),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
});

// Schema for customerAddresses - used to validate API requests
const baseSchema = createSelectSchema(customers).omit(timestamps);

export const insertCustomerSchema =
  createInsertSchema(customers).omit(timestamps);
export const insertCustomerParams = baseSchema
  .extend({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email(),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address: z.string().min(1, 'Address is required'),
    extraDetails: z.string().nullable(),
    phone: z.string().min(1, 'Phone is required'),
    postalCode: z.string().nullable(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateCustomerSchema = baseSchema;
export const updateCustomerParams = baseSchema.extend({}).omit({
  userId: true,
});
export const customerIdSchema = baseSchema.pick({ id: true });

// Types for customerAddresses - used to type API request params and within Components
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type NewCustomerParams = z.infer<typeof insertCustomerParams>;
export type UpdateCustomerParams = z.infer<typeof updateCustomerParams>;
export type CustomerId = z.infer<typeof customerIdSchema>['id'];

// this type infers the return from getCustomerAddresses() - meaning it will include any joins
export type CompleteCustomer = Awaited<
  ReturnType<typeof getCustomers>
>['customers'][number];
