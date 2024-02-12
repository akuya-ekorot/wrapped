import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  type PaymentId,
  paymentIdSchema,
  payments,
} from '@/lib/db/schema/payments';
import { users } from '@/lib/db/schema/auth';

export const getUsers = async () => {
  const rows = await db.select().from(users);
  const p = rows;
  return { users: p };
};

/*
export const getUserById = async (id: PaymentId) => {
  const { id: paymentId } = paymentIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId));
  if (row === undefined) return {};
  const p = row;
  return { payment: p };
};
*/
