import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  MainCollectionId,
  NewMainCollectionParams,
  UpdateMainCollectionParams,
  updateMainCollectionSchema,
  insertMainCollectionSchema,
  mainCollections,
  mainCollectionIdSchema,
} from '@/lib/db/schema/mainCollections';

export const createMainCollection = async (
  mainCollection: NewMainCollectionParams,
) => {
  const newMainCollection = insertMainCollectionSchema.parse(mainCollection);
  try {
    const [m] = await db
      .insert(mainCollections)
      .values(newMainCollection)
      .returning();
    return { mainCollection: m };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateMainCollection = async (
  id: MainCollectionId,
  mainCollection: UpdateMainCollectionParams,
) => {
  const { id: mainCollectionId } = mainCollectionIdSchema.parse({ id });
  const newMainCollection = updateMainCollectionSchema.parse(mainCollection);
  try {
    const [m] = await db
      .update(mainCollections)
      .set(newMainCollection)
      .where(eq(mainCollections.id, mainCollectionId!))
      .returning();
    return { mainCollection: m };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteMainCollection = async (id: MainCollectionId) => {
  const { id: mainCollectionId } = mainCollectionIdSchema.parse({ id });
  try {
    const [m] = await db
      .delete(mainCollections)
      .where(eq(mainCollections.id, mainCollectionId!))
      .returning();
    return { mainCollection: m };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
