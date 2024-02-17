import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  FeaturedCollectionSectionId,
  NewFeaturedCollectionSectionParams,
  UpdateFeaturedCollectionSectionParams,
  updateFeaturedCollectionSectionSchema,
  insertFeaturedCollectionSectionSchema,
  featuredCollectionSections,
  featuredCollectionSectionIdSchema,
} from '@/lib/db/schema/featuredCollectionSections';

export const createFeaturedCollectionSection = async (
  featuredCollectionSection: NewFeaturedCollectionSectionParams,
) => {
  const newFeaturedCollectionSection =
    insertFeaturedCollectionSectionSchema.parse(featuredCollectionSection);
  try {
    const [f] = await db
      .insert(featuredCollectionSections)
      .values(newFeaturedCollectionSection)
      .returning();
    return { featuredCollectionSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateFeaturedCollectionSection = async (
  id: FeaturedCollectionSectionId,
  featuredCollectionSection: UpdateFeaturedCollectionSectionParams,
) => {
  const { id: featuredCollectionSectionId } =
    featuredCollectionSectionIdSchema.parse({ id });
  const newFeaturedCollectionSection =
    updateFeaturedCollectionSectionSchema.parse(featuredCollectionSection);
  try {
    const [f] = await db
      .update(featuredCollectionSections)
      .set(newFeaturedCollectionSection)
      .where(eq(featuredCollectionSections.id, featuredCollectionSectionId!))
      .returning();
    return { featuredCollectionSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteFeaturedCollectionSection = async (
  id: FeaturedCollectionSectionId,
) => {
  const { id: featuredCollectionSectionId } =
    featuredCollectionSectionIdSchema.parse({ id });
  try {
    const [f] = await db
      .delete(featuredCollectionSections)
      .where(eq(featuredCollectionSections.id, featuredCollectionSectionId!))
      .returning();
    return { featuredCollectionSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
