import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ReferredCollectionId,
  NewReferredCollectionParams,
  UpdateReferredCollectionParams,
  updateReferredCollectionSchema,
  insertReferredCollectionSchema,
  referredCollections,
  referredCollectionIdSchema,
} from '@/lib/db/schema/referredCollections';

export const createReferredCollection = async (
  referredCollection: NewReferredCollectionParams,
) => {
  const newReferredCollection =
    insertReferredCollectionSchema.parse(referredCollection);
  try {
    const [r] = await db
      .insert(referredCollections)
      .values(newReferredCollection)
      .returning();
    return { referredCollection: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateReferredCollection = async (
  id: ReferredCollectionId,
  referredCollection: UpdateReferredCollectionParams,
) => {
  const { id: referredCollectionId } = referredCollectionIdSchema.parse({ id });
  const newReferredCollection =
    updateReferredCollectionSchema.parse(referredCollection);
  try {
    const [r] = await db
      .update(referredCollections)
      .set(newReferredCollection)
      .where(eq(referredCollections.id, referredCollectionId!))
      .returning();
    return { referredCollection: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteReferredCollection = async (id: ReferredCollectionId) => {
  const { id: referredCollectionId } = referredCollectionIdSchema.parse({ id });
  try {
    const [r] = await db
      .delete(referredCollections)
      .where(eq(referredCollections.id, referredCollectionId!))
      .returning();
    return { referredCollection: r };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
