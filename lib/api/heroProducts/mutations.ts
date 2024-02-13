import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  HeroProductId,
  NewHeroProductParams,
  UpdateHeroProductParams,
  updateHeroProductSchema,
  insertHeroProductSchema,
  heroProducts,
  heroProductIdSchema,
} from '@/lib/db/schema/heroProducts';

export const createHeroProduct = async (heroProduct: NewHeroProductParams) => {
  const newHeroProduct = insertHeroProductSchema.parse(heroProduct);
  try {
    const [h] = await db
      .insert(heroProducts)
      .values(newHeroProduct)
      .returning();
    return { heroProduct: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateHeroProduct = async (
  id: HeroProductId,
  heroProduct: UpdateHeroProductParams,
) => {
  const { id: heroProductId } = heroProductIdSchema.parse({ id });
  const newHeroProduct = updateHeroProductSchema.parse(heroProduct);
  try {
    const [h] = await db
      .update(heroProducts)
      .set(newHeroProduct)
      .where(eq(heroProducts.id, heroProductId!))
      .returning();
    return { heroProduct: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteHeroProduct = async (id: HeroProductId) => {
  const { id: heroProductId } = heroProductIdSchema.parse({ id });
  try {
    const [h] = await db
      .delete(heroProducts)
      .where(eq(heroProducts.id, heroProductId!))
      .returning();
    return { heroProduct: h };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
