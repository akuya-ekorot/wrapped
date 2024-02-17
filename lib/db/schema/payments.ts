import { sql } from 'drizzle-orm';
import {
  text,
  real,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { type getPayments } from '@/lib/api/payments/queries';

import { nanoid, timestamps } from '@/lib/utils';

export const payments = pgTable(
  'payments',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    reference: text('reference').notNull(),
    status: text('status').notNull(),
    amount: real('amount'),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at')
      .notNull()
      .default(sql`now()`),
  },
  (payments) => {
    return {
      referenceIndex: uniqueIndex('payment_reference_idx').on(
        payments.reference,
      ),
    };
  },
);

// Schema for payments - used to validate API requests
const baseSchema = createSelectSchema(payments).omit(timestamps);

export const insertPaymentSchema = createInsertSchema(payments)
  .extend({ amount: z.coerce.number() })
  .omit(timestamps);
export const insertPaymentParams = baseSchema
  .extend({
    amount: z.coerce.number(),
  })
  .omit({
    id: true,
  });

export const updatePaymentSchema = baseSchema;
export const updatePaymentParams = baseSchema.extend({
  amount: z.coerce.number(),
});
export const paymentIdSchema = baseSchema.pick({ id: true });

// Types for payments - used to type API request params and within Components
export type Payment = typeof payments.$inferSelect;
export type NewPayment = z.infer<typeof insertPaymentSchema>;
export type NewPaymentParams = z.infer<typeof insertPaymentParams>;
export type UpdatePaymentParams = z.infer<typeof updatePaymentParams>;
export type PaymentId = z.infer<typeof paymentIdSchema>['id'];

// this type infers the return from getPayments() - meaning it will include any joins
export type CompletePayment = Awaited<
  ReturnType<typeof getPayments>
>['payments'][number];
