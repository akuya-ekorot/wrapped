import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  VariantId, 
  NewVariantParams,
  UpdateVariantParams, 
  updateVariantSchema,
  insertVariantSchema, 
  variants,
  variantIdSchema 
} from "@/lib/db/schema/variants";

export const createVariant = async (variant: NewVariantParams) => {
  const newVariant = insertVariantSchema.parse(variant);
  try {
    const [v] =  await db.insert(variants).values(newVariant).returning();
    return { variant: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVariant = async (id: VariantId, variant: UpdateVariantParams) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  const newVariant = updateVariantSchema.parse(variant);
  try {
    const [v] =  await db
     .update(variants)
     .set({...newVariant, updatedAt: new Date() })
     .where(eq(variants.id, variantId!))
     .returning();
    return { variant: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVariant = async (id: VariantId) => {
  const { id: variantId } = variantIdSchema.parse({ id });
  try {
    const [v] =  await db.delete(variants).where(eq(variants.id, variantId!))
    .returning();
    return { variant: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

