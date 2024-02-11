import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  PaymentId,
  NewPaymentParams,
  UpdatePaymentParams,
  updatePaymentSchema,
  insertPaymentSchema,
  payments,
  paymentIdSchema,
} from '@/lib/db/schema/payments';

export const createPayment = async (payment: NewPaymentParams) => {
  const newPayment = insertPaymentSchema.parse(payment);
  try {
    const [p] = await db.insert(payments).values(newPayment).returning();
    return { payment: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updatePayment = async (
  id: PaymentId,
  payment: UpdatePaymentParams,
) => {
  const { id: paymentId } = paymentIdSchema.parse({ id });
  const newPayment = updatePaymentSchema.parse(payment);
  try {
    const [p] = await db
      .update(payments)
      .set({ ...newPayment, updatedAt: new Date() })
      .where(eq(payments.id, paymentId!))
      .returning();
    return { payment: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deletePayment = async (id: PaymentId) => {
  const { id: paymentId } = paymentIdSchema.parse({ id });
  try {
    const [p] = await db
      .delete(payments)
      .where(eq(payments.id, paymentId!))
      .returning();
    return { payment: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
