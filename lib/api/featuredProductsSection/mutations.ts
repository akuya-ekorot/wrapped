import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  FeaturedProductsSectionId,
  NewFeaturedProductsSectionParams,
  UpdateFeaturedProductsSectionParams,
  updateFeaturedProductsSectionSchema,
  insertFeaturedProductsSectionSchema,
  featuredProductsSection,
  featuredProductsSectionIdSchema,
} from '@/lib/db/schema/featuredProductsSection';

export const createFeaturedProductsSection = async (
  featuredProductsSection: NewFeaturedProductsSectionParams,
) => {
  const newFeaturedProductsSection = insertFeaturedProductsSectionSchema.parse(
    featuredProductsSection,
  );
  try {
    const [f] = await db
      .insert(featuredProductsSection)
      .values(newFeaturedProductsSection)
      .returning();
    return { featuredProductsSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateFeaturedProductsSection = async (
  id: FeaturedProductsSectionId,
  featuredProductsSection: UpdateFeaturedProductsSectionParams,
) => {
  const { id: featuredProductsSectionId } =
    featuredProductsSectionIdSchema.parse({ id });
  const newFeaturedProductsSection = updateFeaturedProductsSectionSchema.parse(
    featuredProductsSection,
  );
  try {
    const [f] = await db
      .update(featuredProductsSection)
      .set(newFeaturedProductsSection)
      .where(eq(featuredProductsSection.id, featuredProductsSectionId!))
      .returning();
    return { featuredProductsSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteFeaturedProductsSection = async (
  id: FeaturedProductsSectionId,
) => {
  const { id: featuredProductsSectionId } =
    featuredProductsSectionIdSchema.parse({ id });
  try {
    const [f] = await db
      .delete(featuredProductsSection)
      .where(eq(featuredProductsSection.id, featuredProductsSectionId!))
      .returning();
    return { featuredProductsSection: f };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
