import { db } from '@/lib/db/index';
import { eq } from 'drizzle-orm';
import {
  VariantOptionId,
  NewVariantOptionParams,
  UpdateVariantOptionParams,
  updateVariantOptionSchema,
  insertVariantOptionSchema,
  variantOptions,
  variantOptionIdSchema,
} from '@/lib/db/schema/variantOptions';

export const createVariantOption = async (
  variantOption: NewVariantOptionParams,
) => {
  const newVariantOption = insertVariantOptionSchema.parse(variantOption);
  try {
    const [v] = await db
      .insert(variantOptions)
      .values(newVariantOption)
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateVariantOption = async (
  id: VariantOptionId,
  variantOption: UpdateVariantOptionParams,
) => {
  const { id: variantOptionId } = variantOptionIdSchema.parse({ id });
  const newVariantOption = updateVariantOptionSchema.parse(variantOption);
  try {
    const [v] = await db
      .update(variantOptions)
      .set({ ...newVariantOption, updatedAt: new Date() })
      .where(eq(variantOptions.id, variantOptionId!))
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteVariantOption = async (id: VariantOptionId) => {
  const { id: variantOptionId } = variantOptionIdSchema.parse({ id });
  try {
    const [v] = await db
      .delete(variantOptions)
      .where(eq(variantOptions.id, variantOptionId!))
      .returning();
    return { variantOption: v };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
