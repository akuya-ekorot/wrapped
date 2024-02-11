import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  CollectionImageId,
  NewCollectionImageParams,
  UpdateCollectionImageParams,
  updateCollectionImageSchema,
  insertCollectionImageSchema,
  collectionImages,
  collectionImageIdSchema,
} from '@/lib/db/schema/collectionImages';

export const createCollectionImage = async (
  collectionImage: NewCollectionImageParams,
) => {
  const newCollectionImage = insertCollectionImageSchema.parse(collectionImage);
  try {
    const [c] = await db
      .insert(collectionImages)
      .values(newCollectionImage)
      .returning();
    return { collectionImage: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateCollectionImage = async (
  id: CollectionImageId,
  collectionImage: UpdateCollectionImageParams,
) => {
  const { id: collectionImageId } = collectionImageIdSchema.parse({ id });
  const newCollectionImage = updateCollectionImageSchema.parse(collectionImage);
  try {
    const [c] = await db
      .update(collectionImages)
      .set({ ...newCollectionImage, updatedAt: new Date() })
      .where(eq(collectionImages.id, collectionImageId!))
      .returning();
    return { collectionImage: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteCollectionImage = async (id: CollectionImageId) => {
  const { id: collectionImageId } = collectionImageIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(collectionImages)
      .where(eq(collectionImages.id, collectionImageId!))
      .returning();
    return { collectionImage: c };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
