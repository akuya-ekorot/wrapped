import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  HeroCollectionId,
  NewHeroCollectionParams,
  UpdateHeroCollectionParams,
  updateHeroCollectionSchema,
  insertHeroCollectionSchema,
  heroCollections,
  heroCollectionIdSchema,
} from '@/lib/db/schema/heroCollections';

export const createHeroCollection = async (
  heroCollection: NewHeroCollectionParams,
) => {
  const newHeroCollection = insertHeroCollectionSchema.parse(heroCollection);
  try {
    const [h] = await db
      .insert(heroCollections)
      .values(newHeroCollection)
      .returning();
    return { heroCollection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateHeroCollection = async (
  id: HeroCollectionId,
  heroCollection: UpdateHeroCollectionParams,
) => {
  const { id: heroCollectionId } = heroCollectionIdSchema.parse({ id });
  const newHeroCollection = updateHeroCollectionSchema.parse(heroCollection);
  try {
    const [h] = await db
      .update(heroCollections)
      .set(newHeroCollection)
      .where(eq(heroCollections.id, heroCollectionId!))
      .returning();
    return { heroCollection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteHeroCollection = async (id: HeroCollectionId) => {
  const { id: heroCollectionId } = heroCollectionIdSchema.parse({ id });
  try {
    const [h] = await db
      .delete(heroCollections)
      .where(eq(heroCollections.id, heroCollectionId!))
      .returning();
    return { heroCollection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
