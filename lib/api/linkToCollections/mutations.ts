import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  LinkToCollectionId,
  NewLinkToCollectionParams,
  UpdateLinkToCollectionParams,
  updateLinkToCollectionSchema,
  insertLinkToCollectionSchema,
  linkToCollections,
  linkToCollectionIdSchema,
} from '@/lib/db/schema/linkToCollections';

export const createLinkToCollection = async (
  linkToCollection: NewLinkToCollectionParams,
) => {
  const newLinkToCollection =
    insertLinkToCollectionSchema.parse(linkToCollection);
  try {
    const [l] = await db
      .insert(linkToCollections)
      .values(newLinkToCollection)
      .returning();
    return { linkToCollection: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateLinkToCollection = async (
  id: LinkToCollectionId,
  linkToCollection: UpdateLinkToCollectionParams,
) => {
  const { id: linkToCollectionId } = linkToCollectionIdSchema.parse({ id });
  const newLinkToCollection =
    updateLinkToCollectionSchema.parse(linkToCollection);
  try {
    const [l] = await db
      .update(linkToCollections)
      .set({ ...newLinkToCollection, updatedAt: new Date() })
      .where(eq(linkToCollections.id, linkToCollectionId!))
      .returning();
    return { linkToCollection: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteLinkToCollection = async (id: LinkToCollectionId) => {
  const { id: linkToCollectionId } = linkToCollectionIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(linkToCollections)
      .where(eq(linkToCollections.id, linkToCollectionId!))
      .returning();
    return { linkToCollection: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
