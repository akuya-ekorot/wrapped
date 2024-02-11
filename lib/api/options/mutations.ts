import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  OptionId, 
  NewOptionParams,
  UpdateOptionParams, 
  updateOptionSchema,
  insertOptionSchema, 
  options,
  optionIdSchema 
} from "@/lib/db/schema/options";

export const createOption = async (option: NewOptionParams) => {
  const newOption = insertOptionSchema.parse(option);
  try {
    const [o] =  await db.insert(options).values(newOption).returning();
    return { option: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateOption = async (id: OptionId, option: UpdateOptionParams) => {
  const { id: optionId } = optionIdSchema.parse({ id });
  const newOption = updateOptionSchema.parse(option);
  try {
    const [o] =  await db
     .update(options)
     .set({...newOption, updatedAt: new Date() })
     .where(eq(options.id, optionId!))
     .returning();
    return { option: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteOption = async (id: OptionId) => {
  const { id: optionId } = optionIdSchema.parse({ id });
  try {
    const [o] =  await db.delete(options).where(eq(options.id, optionId!))
    .returning();
    return { option: o };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

