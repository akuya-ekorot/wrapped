import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  HeroSectionId,
  NewHeroSectionParams,
  UpdateHeroSectionParams,
  updateHeroSectionSchema,
  insertHeroSectionSchema,
  heroSections,
  heroSectionIdSchema,
} from '@/lib/db/schema/heroSections';

export const createHeroSection = async (heroSection: NewHeroSectionParams) => {
  const newHeroSection = insertHeroSectionSchema.parse(heroSection);
  try {
    const [h] = await db
      .insert(heroSections)
      .values(newHeroSection)
      .returning();
    return { heroSection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateHeroSection = async (
  id: HeroSectionId,
  heroSection: UpdateHeroSectionParams,
) => {
  const { id: heroSectionId } = heroSectionIdSchema.parse({ id });
  const newHeroSection = updateHeroSectionSchema.parse(heroSection);
  try {
    const [h] = await db
      .update(heroSections)
      .set(newHeroSection)
      .where(eq(heroSections.id, heroSectionId!))
      .returning();
    return { heroSection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteHeroSection = async (id: HeroSectionId) => {
  const { id: heroSectionId } = heroSectionIdSchema.parse({ id });
  try {
    const [h] = await db
      .delete(heroSections)
      .where(eq(heroSections.id, heroSectionId!))
      .returning();
    return { heroSection: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
