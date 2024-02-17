import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  LinkToProductId,
  NewLinkToProductParams,
  UpdateLinkToProductParams,
  updateLinkToProductSchema,
  insertLinkToProductSchema,
  linkToProducts,
  linkToProductIdSchema,
} from '@/lib/db/schema/linkToProducts';

export const createLinkToProduct = async (
  linkToProduct: NewLinkToProductParams,
) => {
  const newLinkToProduct = insertLinkToProductSchema.parse(linkToProduct);
  try {
    const [l] = await db
      .insert(linkToProducts)
      .values(newLinkToProduct)
      .returning();
    return { linkToProduct: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateLinkToProduct = async (
  id: LinkToProductId,
  linkToProduct: UpdateLinkToProductParams,
) => {
  const { id: linkToProductId } = linkToProductIdSchema.parse({ id });
  const newLinkToProduct = updateLinkToProductSchema.parse(linkToProduct);
  try {
    const [l] = await db
      .update(linkToProducts)
      .set({ ...newLinkToProduct, updatedAt: new Date() })
      .where(eq(linkToProducts.id, linkToProductId!))
      .returning();
    return { linkToProduct: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteLinkToProduct = async (id: LinkToProductId) => {
  const { id: linkToProductId } = linkToProductIdSchema.parse({ id });
  try {
    const [l] = await db
      .delete(linkToProducts)
      .where(eq(linkToProducts.id, linkToProductId!))
      .returning();
    return { linkToProduct: l };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
