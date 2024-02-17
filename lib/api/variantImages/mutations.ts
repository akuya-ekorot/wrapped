import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  VariantImageId, 
  NewVariantImageParams,
  UpdateVariantImageParams, 
  updateVariantImageSchema,
  insertVariantImageSchema, 
  variantImages,
  variantImageIdSchema 
} from "@/lib/db/schema/variantImages";

export const createVariantImage = async (variantImage: NewVariantImageParams) => {
  const newVariantImage = insertVariantImageSchema.parse(variantImage);
  try {
    const [v] =  await db.insert(variantImages).values(newVariantImage).returning();
    return { variantImage: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVariantImage = async (id: VariantImageId, variantImage: UpdateVariantImageParams) => {
  const { id: variantImageId } = variantImageIdSchema.parse({ id });
  const newVariantImage = updateVariantImageSchema.parse(variantImage);
  try {
    const [v] =  await db
     .update(variantImages)
     .set(newVariantImage)
     .where(eq(variantImages.id, variantImageId!))
     .returning();
    return { variantImage: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVariantImage = async (id: VariantImageId) => {
  const { id: variantImageId } = variantImageIdSchema.parse({ id });
  try {
    const [v] =  await db.delete(variantImages).where(eq(variantImages.id, variantImageId!))
    .returning();
    return { variantImage: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

