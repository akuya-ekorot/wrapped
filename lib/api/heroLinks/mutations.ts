import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  HeroLinkId,
  NewHeroLinkParams,
  UpdateHeroLinkParams,
  updateHeroLinkSchema,
  insertHeroLinkSchema,
  heroLinks,
  heroLinkIdSchema,
} from '@/lib/db/schema/heroLinks';

export const createHeroLink = async (heroLink: NewHeroLinkParams) => {
  const newHeroLink = insertHeroLinkSchema.parse(heroLink);
  try {
    const [h] = await db.insert(heroLinks).values(newHeroLink).returning();
    return { heroLink: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateHeroLink = async (
  id: HeroLinkId,
  heroLink: UpdateHeroLinkParams,
) => {
  const { id: heroLinkId } = heroLinkIdSchema.parse({ id });
  const newHeroLink = updateHeroLinkSchema.parse(heroLink);
  try {
    const [h] = await db
      .update(heroLinks)
      .set(newHeroLink)
      .where(eq(heroLinks.id, heroLinkId!))
      .returning();
    return { heroLink: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteHeroLink = async (id: HeroLinkId) => {
  const { id: heroLinkId } = heroLinkIdSchema.parse({ id });
  try {
    const [h] = await db
      .delete(heroLinks)
      .where(eq(heroLinks.id, heroLinkId!))
      .returning();
    return { heroLink: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
