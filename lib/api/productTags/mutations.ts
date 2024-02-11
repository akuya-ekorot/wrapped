import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  ProductTagId,
  NewProductTagParams,
  UpdateProductTagParams,
  updateProductTagSchema,
  insertProductTagSchema,
  productTags,
  productTagIdSchema,
} from '@/lib/db/schema/productTags';

export const createProductTag = async (productTag: NewProductTagParams) => {
  const newProductTag = insertProductTagSchema.parse(productTag);
  try {
    const [p] = await db.insert(productTags).values(newProductTag).returning();
    return { productTag: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateProductTag = async (
  id: ProductTagId,
  productTag: UpdateProductTagParams,
) => {
  const { id: productTagId } = productTagIdSchema.parse({ id });
  const newProductTag = updateProductTagSchema.parse(productTag);
  try {
    const [p] = await db
      .update(productTags)
      .set({ ...newProductTag, updatedAt: new Date() })
      .where(eq(productTags.id, productTagId!))
      .returning();
    return { productTag: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteProductTag = async (id: ProductTagId) => {
  const { id: productTagId } = productTagIdSchema.parse({ id });
  try {
    const [p] = await db
      .delete(productTags)
      .where(eq(productTags.id, productTagId!))
      .returning();
    return { productTag: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
