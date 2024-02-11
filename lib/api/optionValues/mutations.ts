import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  OptionValueId, 
  NewOptionValueParams,
  UpdateOptionValueParams, 
  updateOptionValueSchema,
  insertOptionValueSchema, 
  optionValues,
  optionValueIdSchema 
} from "@/lib/db/schema/optionValues";

export const createOptionValue = async (optionValue: NewOptionValueParams) => {
  const newOptionValue = insertOptionValueSchema.parse(optionValue);
  try {
    const [o] =  await db.insert(optionValues).values(newOptionValue).returning();
    return { optionValue: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateOptionValue = async (id: OptionValueId, optionValue: UpdateOptionValueParams) => {
  const { id: optionValueId } = optionValueIdSchema.parse({ id });
  const newOptionValue = updateOptionValueSchema.parse(optionValue);
  try {
    const [o] =  await db
     .update(optionValues)
     .set({...newOptionValue, updatedAt: new Date() })
     .where(eq(optionValues.id, optionValueId!))
     .returning();
    return { optionValue: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteOptionValue = async (id: OptionValueId) => {
  const { id: optionValueId } = optionValueIdSchema.parse({ id });
  try {
    const [o] =  await db.delete(optionValues).where(eq(optionValues.id, optionValueId!))
    .returning();
    return { optionValue: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

