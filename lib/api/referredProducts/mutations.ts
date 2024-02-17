import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ReferredProductId,
  NewReferredProductParams,
  UpdateReferredProductParams,
  updateReferredProductSchema,
  insertReferredProductSchema,
  referredProducts,
  referredProductIdSchema,
} from '@/lib/db/schema/referredProducts';

export const createReferredProduct = async (
  referredProduct: NewReferredProductParams,
) => {
  const newReferredProduct = insertReferredProductSchema.parse(referredProduct);
  try {
    const [r] = await db
      .insert(referredProducts)
      .values(newReferredProduct)
      .returning();
    return { referredProduct: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateReferredProduct = async (
  id: ReferredProductId,
  referredProduct: UpdateReferredProductParams,
) => {
  const { id: referredProductId } = referredProductIdSchema.parse({ id });
  const newReferredProduct = updateReferredProductSchema.parse(referredProduct);
  try {
    const [r] = await db
      .update(referredProducts)
      .set(newReferredProduct)
      .where(eq(referredProducts.id, referredProductId!))
      .returning();
    return { referredProduct: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteReferredProduct = async (id: ReferredProductId) => {
  const { id: referredProductId } = referredProductIdSchema.parse({ id });
  try {
    const [r] = await db
      .delete(referredProducts)
      .where(eq(referredProducts.id, referredProductId!))
      .returning();
    return { referredProduct: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
