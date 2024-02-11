import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type PaymentId, paymentIdSchema, payments } from "@/lib/db/schema/payments";

export const getPayments = async () => {
  const rows = await db.select().from(payments);
  const p = rows
  return { payments: p };
};

export const getPaymentById = async (id: PaymentId) => {
  const { id: paymentId } = paymentIdSchema.parse({ id });
  const [row] = await db.select().from(payments).where(eq(payments.id, paymentId));
  if (row === undefined) return {};
  const p = row;
  return { payment: p };
};


